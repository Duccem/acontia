import z from "zod";

export const addConnectionInputSchema = z.object({
  provider: z.enum(['plaid', 'stripe', 'gmail', 'gov']).default('plaid'),
  providerAccountId: z.string().min(1),
  credentials: z.record(z.any(), z.any()).optional(),
});