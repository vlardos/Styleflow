import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAllProducts, searchProducts, getProductById } from "./lib/services/product.service";
import { getWeather } from "./lib/services/weather.service";
import { createOrder } from "./lib/services/order.service";

const server = new McpServer({
  name: "styleflow",
  version: "1.0.0",
});

// Tool: get_products
server.tool("get_products", "Возвращает весь каталог товаров StyleFlow", {}, async () => ({
  content: [{ type: "text", text: JSON.stringify(getAllProducts(), null, 2) }],
}));

// Tool: search_products
server.tool(
  "search_products",
  "Ищет товары по запросу (название, категория, теги)",
  { query: z.string().describe("Поисковый запрос") },
  async ({ query }) => ({
    content: [{ type: "text", text: JSON.stringify(searchProducts(query), null, 2) }],
  })
);

// Tool: get_product_by_id
server.tool(
  "get_product_by_id",
  "Возвращает товар по ID",
  { id: z.string().describe("ID товара, например p1") },
  async ({ id }) => {
    const product = getProductById(id);
    if (!product) throw new Error(`Товар ${id} не найден`);
    return { content: [{ type: "text", text: JSON.stringify(product, null, 2) }] };
  }
);

// Tool: get_weather
server.tool(
  "get_weather",
  "Получает погоду в городе и категорию одежды (cold/warm/rainy)",
  { city: z.string().describe("Название города") },
  async ({ city }) => {
    const weather = await getWeather(city);
    return { content: [{ type: "text", text: JSON.stringify(weather, null, 2) }] };
  }
);

// Tool: create_order
server.tool(
  "create_order",
  "Оформляет заказ на выбранные товары",
  {
    items: z.array(z.string()).describe("Массив ID товаров"),
    customerName: z.string().describe("Имя покупателя"),
  },
  async ({ items, customerName }) => {
    const order = createOrder(items, customerName);
    return { content: [{ type: "text", text: JSON.stringify(order, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("StyleFlow MCP server running");
}

main().catch(console.error);
