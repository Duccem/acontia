import { db } from "@acontia/db";
import { protectedProcedure } from "../../index";
import z from "zod";
import { connection } from "@acontia/db/schema/connection";
import { and, count, eq, inArray } from "drizzle-orm";

const listConnectionsFilters = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  providers: z.array(z.enum(['plaid', 'stripe', 'gmail', 'gov'])).optional(),
  status: z.enum(["pending", "processed", "flagged", "error"]).optional(),
});

const listConnectionsOutput = z.object({
  items: z.array(z.object({
    id: z.string(),
    provider: z.enum(['plaid', 'stripe', 'gmail', 'gov']),
    providerAccountId: z.string(),
    organizationId: z.string(),
    lastSync: z.date().nullable(),
    status: z.enum(["pending", "processed", "flagged", "error"]).nullable(),
  })),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
  }),
});

export const listConnections = protectedProcedure
  .route({ path: "/", method: "GET", inputStructure: "detailed", description: "List connections with pagination and optional filters", summary: "List Connections", tags: ["Connections"] })
  .input(z.object({
    query: listConnectionsFilters,
  }))
  .output(listConnectionsOutput)
  .handler(async ({ context, input: { query } }) => {
    const { organization } = context;

    const { page = 1, pageSize = 20, providers, status } = query || {};

    const whereClause = [
      eq(connection.organizationId, organization.id),
    ]

    if (providers && providers.length > 0) {
      whereClause.push(inArray(connection.provider, providers));
    }

    if (status) {
      whereClause.push(eq(connection.status, status));
    }

    const [items, total] = await Promise.all([
      db.select().from(connection).where(and(...whereClause)).limit(pageSize).offset((page - 1) * pageSize),
      db.select({ count: count(connection.id) }).from(connection).where(and(...whereClause))
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        nextPage: (page * pageSize) < (total[0]?.count || 0) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        total: total[0]?.count || 0,
      },
    };
  }); 