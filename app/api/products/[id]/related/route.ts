import { getRelatedProductsFromDb, getRelatedProducts } from '@/lib/services/product.service';
import { ok } from '@/lib/utils/response';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const products = await getRelatedProductsFromDb(id);
    return ok({ products });
  } catch {
    // Fallback to static JSON if DB is unavailable
    const products = getRelatedProducts(id);
    return ok({ products });
  }
}
