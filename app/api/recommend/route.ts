import { NextRequest } from "next/server";
import { getAllProducts } from "@/lib/services/product.service";
import { chatWithTools } from "@/lib/services/ai.service";
import { ok, err } from "@/lib/utils/response";
import { RecommendRequestSchema } from "@/lib/schemas/recommend.schema";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Некорректный JSON в теле запроса");
  }

  const parsed = RecommendRequestSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message);
  }

  const { style, maxPrice, season } = parsed.data;

  try {
    let products = getAllProducts();

    if (maxPrice !== undefined) {
      products = products.filter((p) => p.price <= maxPrice);
    }

    if (season !== undefined) {
      products = products.filter((p) => p.season.includes(season));
    }

    if (products.length === 0) {
      return err("Нет товаров по заданным параметрам");
    }

    const promptParts: string[] = [];
    if (style) promptParts.push(`в стиле ${style}`);
    if (maxPrice !== undefined) promptParts.push(`до ${maxPrice}$`);
    if (season) promptParts.push(`на ${season}`);

    const criteriaText = promptParts.length > 0
      ? ` ${promptParts.join(", ")}`
      : "";

    const productList = products.map((p) => p.name).join(", ");
    const prompt = `Подбери образ${criteriaText} из этих вещей: ${productList}.`;

    const { text } = await chatWithTools(prompt);

    return ok({ products, message: text });
  } catch (e: unknown) {
    return err("Failed to generate recommendation", 500);
  }
}
