import z from "zod";
import { protectedProcedure } from "../..";
import { db } from "@acontia/db";

const inputSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
})

const outputSchema = z.object({
  data: z.object({
    id: z.string(),
    provider: z.enum(['plaid', 'stripe', 'gmail', 'gov']),
    providerAccountId: z.string(),
    organizationId: z.string(),
    lastSync: z.date().nullable(),
    status: z.enum(["pending", "processed", "flagged", "error"]).nullable(),
  })
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

export const getConnectionById = protectedProcedure
  .route({ path: "/:id", method: "GET", inputStructure: "detailed", description: "Get a connection by its ID", summary: "Get Connection", tags: ["Connections"] })
  .input(inputSchema)
  .output(outputSchema)
  .errors(errors)
  .handler(async ({ input, context, errors }) => {
    const { organization } = context;
    const { params: { id } } = input;

    const conn = await db.query.connection.findFirst({
      where: (table, { and, eq }) => and(
        eq(table.id, id),
        eq(table.organizationId, organization.id)
      ),
    });

    if (!conn) {
      throw errors.CONNECTION_NOT_FOUND({ data: { connectionId: id } });
    }

    return {
      data: conn,
    };
  });