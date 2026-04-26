import { NextRequest } from "next/server";
import { OrderRequestSchema } from "@/lib/schemas/order.schema";
import { createOrder } from "@/lib/services/order.service";
import { getProductById } from "@/lib/services/product.service";
import { ok, err } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = OrderRequestSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { items, customerName } = parsed.data;

  // Проверяем что все товары существуют
  const missing = items.filter((id) => !getProductById(id));
  if (missing.length > 0) return err(`Товары не найдены: ${missing.join(", ")}`);

  const order = createOrder(items, customerName);
  return ok({ order }, 201);
}
