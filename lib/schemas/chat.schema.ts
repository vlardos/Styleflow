import { z } from 'zod';

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000),
  coords: z.object({ lat: z.number(), lon: z.number() }).optional(),
  city: z.string().max(100).optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(4000),
  })).max(20).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
