import z from "zod";
import { protectedProcedure } from "../..";
import { addConnectionInputSchema } from "./schemas";
import { db } from "@acontia/db";
import { connection } from "@acontia/db/schema/connection";
import { eq, and } from "drizzle-orm";

const addConnection = protectedProcedure
  .route({ path: "/", method: "POST", inputStructure: "detailed" })
  .input(z.object({
    body: addConnectionInputSchema
  }))
  .handler(async ({ input, context }) => {
    const { organization } = context;
    const { body } = input;

    await db.insert(connection).values({
      organizationId: organization.id,
      provider: body.provider,
      providerAccountId: body.providerAccountId,
      credentials: body.credentials || {},
    })
  });

const listConnections = protectedProcedure
  .route({ path: "/", method: "GET" })
  .handler(async ({ context }) => {
    const { organization } = context;

    const connections = await db.query.connection.findMany({
      where: (table, { eq }) => eq(table.organizationId, organization.id),
    });

    return connections;
  });

const getConnectionById = protectedProcedure
  .route({ path: "/:id", method: "GET" })
  .input(z.object({
    params: z.object({
      id: z.uuid(),
    }),
  }))
  .handler(async ({ input, context }) => {
    const { organization } = context;
    const { params: { id } } = input;

    const conn = await db.query.connection.findFirst({
      where: (table, { and, eq }) => and(
        eq(table.id, id),
        eq(table.organizationId, organization.id)
      ),
    });

    return conn;
  });

const updateConnection = protectedProcedure
  .route({ path: "/:id", method: "PUT" })
  .input(z.object({
    params: z.object({
      id: z.uuid(),
    }),
    body: addConnectionInputSchema.partial(),
  }))
  .handler(async ({ input, context }) => {
    const { organization } = context;
    const { params: { id }, body } = input;
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
  });

const deleteConnection = protectedProcedure
  .route({ path: "/:id", method: "DELETE" })
  .input(z.object({
    params: z.object({
      id: z.uuid(),
    }),
  }))
  .handler(async ({ input, context }) => {
    const { organization } = context;
    const { params: { id } } = input;

    await db.delete(connection)
      .where(and(
        eq(connection.id, id),
        eq(connection.organizationId, organization.id)
      ));
  });

export const connectionRouter = protectedProcedure.prefix("/connection").router({
  addConnection,
  listConnections,
  getConnectionById,
  updateConnection,
  deleteConnection,
})