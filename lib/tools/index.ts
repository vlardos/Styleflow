import { getAllProducts, searchProducts, getProductById } from "../services/product.service";
import { getWeather, getWeatherByCoords } from "../services/weather.service";
import { createOrder } from "../services/order.service";

export type ToolName =
  | "get_products"
  | "search_products"
  | "get_product_by_id"
  | "get_weather"
  | "get_weather_by_coords"
  | "create_order";

export const toolDefinitions = [
  {
    name: "get_products" as const,
    description: "Возвращает весь каталог товаров магазина StyleFlow",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "search_products" as const,
    description: "Ищет товары по запросу (название, категория, теги)",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Поисковый запрос" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_product_by_id" as const,
    description: "Возвращает товар по его ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID товара (например p1, p2)" },
      },
      required: ["id"],
    },
  },
  {
    name: "get_weather" as const,
    description: "Получает текущую погоду в указанном городе и рекомендует категорию одежды (cold/warm/rainy)",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "Название города" },
      },
      required: ["city"],
    },
  },
  {
    name: "get_weather_by_coords" as const,
    description: "Получает текущую погоду по координатам GPS пользователя. Используй этот инструмент когда известны координаты.",
    inputSchema: {
      type: "object",
      properties: {
        lat: { type: "number", description: "Широта" },
        lon: { type: "number", description: "Долгота" },
      },
      required: ["lat", "lon"],
    },
  },
  {
    name: "create_order" as const,
    description: "Оформляет заказ на выбранные товары",
    inputSchema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: { type: "string" },
          description: "Массив ID товаров",
        },
        customerName: { type: "string", description: "Имя покупателя" },
      },
      required: ["items", "customerName"],
    },
  },
];

export async function executeTool(name: ToolName, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "get_products":
      return getAllProducts();

    case "search_products":
      return searchProducts(args.query as string);

    case "get_product_by_id": {
      const product = getProductById(args.id as string);
      if (!product) throw new Error(`Товар ${args.id} не найден`);
      return product;
    }

    case "get_weather":
      return getWeather(args.city as string);

    case "get_weather_by_coords":
      return getWeatherByCoords(args.lat as number, args.lon as number);

    case "create_order":
      return createOrder(args.items as string[], args.customerName as string);

    default:
      throw new Error(`Неизвестный инструмент: ${name}`);
  }
}
