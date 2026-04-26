import { z } from 'zod';

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  coords: z.object({ lat: z.number(), lon: z.number() }).optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
