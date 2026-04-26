import { getProductById } from '@/lib/services/product.service';
import { ok, err } from '@/lib/utils/response';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return err('Product not found', 404);
  return ok({ product });
}
