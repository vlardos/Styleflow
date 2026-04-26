import { z } from 'zod';

export const OrderRequestSchema = z.object({
  items: z.array(z.string()).min(1, 'At least one item required'),
  customerName: z.string().min(1, 'Customer name is required'),
});

export type OrderRequest = z.infer<typeof OrderRequestSchema>;
