import { prisma } from '../prisma';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItemData = {
  id: string;        // CartItem row ID — used for update / remove
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;   // first image, parsed from JSON
    category: string;
  };
};

export type CartData = {
  id: string;
  items: CartItemData[];
  itemCount: number; // total units across all items
  subtotal: number;  // price × quantity sum
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseImage(imagesJson: string): string {
  try {
    const arr = JSON.parse(imagesJson) as string[];
    return arr[0] ?? '';
  } catch {
    return '';
  }
}

// ─── Core operations ──────────────────────────────────────────────────────────

export async function getOrCreateCart(sessionId: string) {
  return prisma.cart.upsert({
    where: { sessionId },
    create: { sessionId },
    update: {},
  });
}

export async function getCartWithItems(sessionId: string): Promise<CartData | null> {
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, images: true, category: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) return null;

  const items: CartItemData[] = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: parseImage(item.product.images),
      category: item.product.category,
    },
  }));

  return {
    id: cart.id,
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  };
}

export async function addToCart(
  sessionId: string,
  productId: string,
  quantity = 1,
): Promise<void> {
  // Validate product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  const cart = await getOrCreateCart(sessionId);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
  });
}

export async function updateCartItem(
  sessionId: string,
  itemId: string,
  quantity: number,
): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) throw new Error('Cart not found');

  if (quantity <= 0) {
    const { count } = await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });
    if (count === 0) throw new Error('Item not found in cart');
  } else {
    const { count } = await prisma.cartItem.updateMany({
      where: { id: itemId, cartId: cart.id },
      data: { quantity },
    });
    if (count === 0) throw new Error('Item not found in cart');
  }
}

export async function removeCartItem(sessionId: string, itemId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) throw new Error('Cart not found');

  const { count } = await prisma.cartItem.deleteMany({
    where: { id: itemId, cartId: cart.id },
  });
  if (count === 0) throw new Error('Item not found in cart');
}

export async function clearCart(sessionId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}
