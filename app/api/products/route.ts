import { getAllProducts } from '@/lib/services/product.service';
import { ok } from '@/lib/utils/response';

export async function GET() {
  const products = getAllProducts();
  return ok({ products });
}
