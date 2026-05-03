import { getSessionId } from '@/lib/utils/session';
import { getCartWithItems, clearCart } from '@/lib/services/cart.service';
import { ok, err } from '@/lib/utils/response';

// GET /api/cart — return current cart with items, itemCount, subtotal
export async function GET() {
  try {
    const sessionId = await getSessionId();
    const cart = await getCartWithItems(sessionId);
    return ok({ cart: cart ?? { id: null, items: [], itemCount: 0, subtotal: 0 } });
  } catch {
    return err('Failed to load cart', 500);
  }
}

// DELETE /api/cart — clear all items (used after order is placed)
export async function DELETE() {
  try {
    const sessionId = await getSessionId();
    await clearCart(sessionId);
    return ok({ cleared: true });
  } catch {
    return err('Failed to clear cart', 500);
  }
}
