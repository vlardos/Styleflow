import { getSessionId } from '@/lib/utils/session';
import { updateCartItem, getCartWithItems } from '@/lib/services/cart.service';
import { ok, err } from '@/lib/utils/response';

// PATCH /api/cart/update
// Body: { itemId: string, quantity: number }
// quantity <= 0 removes the item
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { itemId, quantity } = body as { itemId?: string; quantity?: number };

    if (!itemId || typeof itemId !== 'string') {
      return err('itemId is required', 400);
    }
    if (typeof quantity !== 'number') {
      return err('quantity is required', 400);
    }

    const sessionId = await getSessionId();

    try {
      await updateCartItem(sessionId, itemId, quantity);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('not found')) return err(msg, 404);
      throw e;
    }

    const cart = await getCartWithItems(sessionId);
    return ok({ cart });
  } catch {
    return err('Failed to update cart item', 500);
  }
}
