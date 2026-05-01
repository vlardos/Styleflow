import { NextRequest } from "next/server";
import { ChatRequestSchema } from "@/lib/schemas/chat.schema";
import { chatWithToolsStream } from "@/lib/services/ai.service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.issues[0].message }), { status: 400 });
  }

  const { message, coords, city, history } = parsed.data;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { toolCalls, textStream } = await chatWithToolsStream(
          message,
          coords ?? undefined,
          history ?? [],
          city ?? undefined
        );

        const products = toolCalls
          .filter(tc => ["get_products", "search_products"].includes(tc.tool))
          .flatMap(tc => Array.isArray(tc.result) ? tc.result : []);

        // Сначала шлём meta — tool calls и товары
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "meta", toolCalls, products })}\n\n`)
        );

        // Потом стримим текст по чанкам
        for await (const delta of textStream) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "text", delta })}\n\n`)
          );
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (e) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message: "Something went wrong" })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
