import { getSessionId } from '@/lib/utils/session';
import { removeCartItem, getCartWithItems } from '@/lib/services/cart.service';
import { ok, err } from '@/lib/utils/response';

// DELETE /api/cart/remove
// Body: { itemId: string }
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { itemId } = body as { itemId?: string };

    if (!itemId || typeof itemId !== 'string') {
      return err('itemId is required', 400);
    }

    const sessionId = await getSessionId();

    try {
      await removeCartItem(sessionId, itemId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('not found')) return err(msg, 404);
      throw e;
    }

    const cart = await getCartWithItems(sessionId);
    return ok({ cart });
  } catch {
    return err('Failed to remove cart item', 500);
  }
}
