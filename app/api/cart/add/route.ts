import { getSessionId } from '@/lib/utils/session';
import { addToCart, getCartWithItems } from '@/lib/services/cart.service';
import { ok, err } from '@/lib/utils/response';

// POST /api/cart/add
// Body: { productId: string, quantity?: number }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity = 1 } = body as { productId?: string; quantity?: number };

    if (!productId || typeof productId !== 'string') {
      return err('productId is required', 400);
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return err('quantity must be a positive number', 400);
    }

    const sessionId = await getSessionId();

    try {
      await addToCart(sessionId, productId, quantity);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      if (msg === 'Product not found') return err('Product not found', 404);
      throw e;
    }

    const cart = await getCartWithItems(sessionId);
    return ok({ cart });
  } catch {
    return err('Failed to add item to cart', 500);
  }
}
