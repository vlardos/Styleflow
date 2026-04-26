import { randomUUID } from 'crypto';
import { getProductById } from './product.service';

export type Order = {
  orderId: string;
  items: string[];
  customerName: string;
  total: number;
  createdAt: string;
};

export function createOrder(items: string[], customerName: string): Order {
  const total = items.reduce((sum, id) => {
    const product = getProductById(id);
    return sum + (product?.price ?? 0);
  }, 0);

  return {
    orderId: randomUUID(),
    items,
    customerName,
    total: Math.round(total * 100) / 100,
    createdAt: new Date().toISOString(),
  };
}
