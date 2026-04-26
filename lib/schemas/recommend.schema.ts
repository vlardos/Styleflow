import { z } from 'zod';

export const RecommendRequestSchema = z.object({
  style: z.string().max(100).optional(),
  maxPrice: z.number().positive().optional(),
  season: z.enum(["spring", "summer", "autumn", "winter"]).optional(),
});

export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;
