import z from "zod";
import { protectedProcedure } from "../..";
import { db } from "@acontia/db";
import { connection } from "@acontia/db/schema/connection";
import { and, eq } from "drizzle-orm";

const inputSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    provider: z.enum(['plaid', 'stripe', 'gmail', 'gov']).default('plaid'),
    providerAccountId: z.string().min(1),
    credentials: z.record(z.any(), z.any()).optional(),
  }).partial(),
});

const outputSchema = z.object({
  success: z.boolean(),
});

const errors = {
  CONNECTION_NOT_FOUND: {
    status: 404,
    message: "CONNECTION_NOT_FOUND",
    data: z.object({
      connectionId: z.string(),
    }),
  },
}

export const updateConnection = protectedProcedure
  .route({ path: "/:id", method: "PUT", inputStructure: "detailed", description: "Update a connection by its ID", summary: "Update Connection", tags: ["Connections"] })
  .input(inputSchema)
  .output(outputSchema)
  .errors(errors)
  .handler(async ({ input, context, errors }) => {
    const { organization } = context;
    const { params: { id }, body } = input;

    const existingConn = await db.query.connection.findFirst({
      where: (table, { and, eq }) => and(
        eq(table.id, id),
        eq(table.organizationId, organization.id)
      ),
    });

    if (!existingConn) {
      throw errors.CONNECTION_NOT_FOUND({ data: { connectionId: id } });
    }

    await db.update(connection)
      .set({
        provider: body.provider,
        providerAccountId: body.providerAccountId,
        credentials: body.credentials,
      })
      .where(and(
        eq(connection.id, id),
        eq(connection.organizationId, organization.id)
      ));

    return { success: true };

  });