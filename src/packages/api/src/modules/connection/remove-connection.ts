import z from "zod";
import { protectedProcedure } from "../..";
import { db } from "@acontia/db";
import { connection } from "@acontia/db/schema/connection";
import { and, eq } from "drizzle-orm";

const inputSchema = z.object({
  params: z.object({
    id: z.uuid(),
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
export const deleteConnection = protectedProcedure
  .route({ path: "/:id", method: "DELETE", inputStructure: "detailed" })
  .input(inputSchema)
  .errors(errors)
  .handler(async ({ input, context, errors }) => {
    const { organization } = context;
    const { params: { id } } = input;

    const existingConn = await db.query.connection.findFirst({
      where: (table, { and, eq }) => and(
        eq(table.id, id),
        eq(table.organizationId, organization.id)
      ),
    });

    if (!existingConn) {
      throw errors.CONNECTION_NOT_FOUND({ data: { connectionId: id } });
    }

    await db.delete(connection)
      .where(and(
        eq(connection.id, id),
        eq(connection.organizationId, organization.id)
      ));
  });