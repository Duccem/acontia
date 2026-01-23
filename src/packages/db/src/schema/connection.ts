import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization } from "./auth";

export const connection_provider_enum = pgEnum("connection_provider_enum", ['plaid', 'stripe', 'gmail', 'gov']);
export const connection_status_enum = pgEnum("connection_status_enum", ["pending", "processed", "flagged", "error"])

export const connection = pgTable(
  "connection",
  {
    id: uuid('id').primaryKey().$defaultFn(v7),
    organizationId: uuid('organization_id').notNull().references(() => organization.id),
    provider: connection_provider_enum('provider').notNull().default('plaid'),
    providerAccountId: text('provider_account_id').notNull(),
    credentials: jsonb('credentials').default({}),
    lastSync: timestamp('last_sync').defaultNow(),
    status: connection_status_enum('status').default('pending')
  }
);