import Groq from "groq-sdk";
import { toolDefinitions, executeTool, type ToolName } from "../tools";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Ты — Стайл, AI-стилист онлайн-магазина одежды StyleFlow.

Твой характер: дружелюбный, уверенный, с хорошим вкусом. Говоришь как живой человек, не как робот.

У тебя есть инструменты для работы с магазином — используй их чтобы давать точные ответы.

Правила:
- Всегда отвечай по-русски
- Используй инструменты для получения реальных данных из каталога
- Давай конкретные советы с реальными товарами
- Не перечисляй вещи списком — вплетай в живой текст
- Длина ответа: 2-4 предложения
- Никогда не пиши "конечно!", "отличный выбор!", "с удовольствием"`;

// Конвертируем наши tool definitions в формат Groq
const groqTools = toolDefinitions.map((t) => ({
  type: "function" as const,
  function: {
    name: t.name,
    description: t.description,
    parameters: t.inputSchema,
  },
}));

export type ToolCall = {
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
};

export type HistoryMessage = { role: "user" | "assistant"; content: string };

export async function chatWithTools(
  message: string,
  coords?: { lat: number; lon: number },
  history?: HistoryMessage[]
): Promise<{ text: string; toolCalls: ToolCall[] }> {
  const locationHint = coords
    ? `\nКоординаты пользователя: lat=${coords.lat}, lon=${coords.lon}. Если спрашивает про погоду — используй get_weather_by_coords с этими координатами.`
    : "";

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT + locationHint },
    ...(history ?? []).slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const toolCalls: ToolCall[] = [];

  // Первый запрос — AI решает какие инструменты вызвать
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    tools: groqTools,
    tool_choice: "auto",
    max_tokens: 1024,
    temperature: 0.7,
  });

  const assistantMessage = response.choices[0].message;
  messages.push(assistantMessage);

  // Выполняем все запрошенные инструменты
  if (assistantMessage.tool_calls?.length) {
    for (const call of assistantMessage.tool_calls) {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(call.function.arguments);
      } catch {
        args = {};
      }
      const result = await executeTool(call.function.name as ToolName, args);

      toolCalls.push({ tool: call.function.name, args, result });

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }

    // Второй запрос — AI формулирует финальный ответ с результатами инструментов
    const finalResponse = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 400,
      temperature: 0.8,
    });

    return {
      text: finalResponse.choices[0].message.content ?? "Не удалось сформировать ответ.",
      toolCalls,
    };
  }

  return {
    text: assistantMessage.content ?? "Не удалось сформировать ответ.",
    toolCalls,
  };
}

async function* generateText(
  groqStream: AsyncIterable<Groq.Chat.ChatCompletionChunk>
): AsyncIterable<string> {
  for await (const chunk of groqStream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

export async function chatWithToolsStream(
  message: string,
  coords?: { lat: number; lon: number },
  history: HistoryMessage[] = [],
  city?: string
): Promise<{ toolCalls: ToolCall[]; textStream: AsyncIterable<string> }> {
  // Sanitize city: оставляем только буквы, цифры, пробелы и дефис — защита от prompt injection
  const safeCity = city ? city.replace(/[^a-zA-ZА-Яа-яёЁ0-9\s\-]/g, "").trim().slice(0, 80) : undefined;

  const locationHint = coords
    ? `\nКоординаты пользователя: lat=${coords.lat.toFixed(4)}, lon=${coords.lon.toFixed(4)}. Если спрашивает про погоду — используй get_weather_by_coords с этими координатами.`
    : safeCity
    ? `\nГород пользователя: ${safeCity}. Если спрашивает про погоду — используй get_weather с городом "${safeCity}".`
    : "";

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT + locationHint },
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const toolCalls: ToolCall[] = [];

  // Первый запрос — без стриминга, нужен для tool calls
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    tools: groqTools,
    tool_choice: "auto",
    max_tokens: 1024,
    temperature: 0.7,
  });

  const assistantMessage = response.choices[0].message;
  messages.push(assistantMessage);

  // Выполняем все запрошенные инструменты
  if (assistantMessage.tool_calls?.length) {
    for (const call of assistantMessage.tool_calls) {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(call.function.arguments);
      } catch {
        args = {};
      }
      const result = await executeTool(call.function.name as ToolName, args);

      toolCalls.push({ tool: call.function.name, args, result });

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }

    // Финальный запрос — стримим ответ
    const groqStream = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 400,
      temperature: 0.8,
      stream: true,
    });

    return { toolCalls, textStream: generateText(groqStream) };
  }

  // Если инструменты не вызывались — стримим первый ответ
  // assistantMessage уже есть, но он не стримился — отдаём как одиночный chunk
  async function* singleChunk(): AsyncIterable<string> {
    const text = assistantMessage.content ?? "Не удалось сформировать ответ.";
    yield text;
  }

  return { toolCalls, textStream: singleChunk() };
}
