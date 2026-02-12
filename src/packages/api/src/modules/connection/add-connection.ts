import z from "zod";
import { protectedProcedure } from "../../index";
import { connection } from "@acontia/db/schema/connection";
import { db } from "@acontia/db";

const inputSchema = z.object({
  body: z.object({
    provider: z.enum(['plaid', 'stripe', 'gmail', 'gov']).default('plaid'),
    providerAccountId: z.string().min(1),
    credentials: z.record(z.any(), z.any()).optional(),
  })
});

const outputSchema = z.object({
  success: z.boolean(),
});

export const addConnection = protectedProcedure
  .route({ path: "/", method: "POST", inputStructure: "detailed", description: "Add a new connection to the organization", summary: "Add Connection", tags: ["Connections"] })
  .input(inputSchema)
  .output(outputSchema)
  .handler(async ({ input, context }) => {
    const { organization } = context;
    const { body } = input;

    await db.insert(connection).values({
      organizationId: organization.id,
      provider: body.provider,
      providerAccountId: body.providerAccountId,
      credentials: body.credentials || {},
    });

    return { success: true };
  });