import { NextRequest } from "next/server";
import { getWeather } from "@/lib/services/weather.service";
import { filterByWeather } from "@/lib/services/product.service";
import { chatWithTools } from "@/lib/services/ai.service";
import { ok, err } from "@/lib/utils/response";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  if (!city) return err("Укажи параметр ?city=");

  try {
    const weather = await getWeather(city);
    const products = filterByWeather(weather.category);

    if (products.length === 0) return err("Нет товаров для этой погоды");

    const { text } = await chatWithTools(
      `Погода в ${weather.city}: ${weather.temp}°C, ${weather.condition}. Подбери образ из этих вещей: ${products.map((p) => p.name).join(", ")}.`
    );

    return ok({ weather, products, message: text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Ошибка получения погоды";
    return err(message);
  }
}
