import { boolean, date, decimal, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization } from "./auth";
import { connection } from "./connection";

export const document_type_enum = pgEnum("document_type_enum", ["income", "expense", "ticket"]);
export const document_status_enum = pgEnum("document_status_enum", ["pending", "processed", "flagged", "error"])

export const document = pgTable(
  "document",
  {
    id: uuid('id').primaryKey().$defaultFn(v7),
    organizationId: uuid('organization_id').notNull().references(() => organization.id),
    fileUrl: text('file_url').notNull(),
    docType: document_type_enum('doc_type').default('income'),
    status: document_status_enum('status').default('pending'),
    ocrData: jsonb('ocr_data'),
    isDeductible: boolean('is_deductible').default(true),
    aiReasoning: text('ai_reasoning'),
    createdAt: timestamp('created_at').defaultNow().notNull()
  }
);

export const transaction = pgTable(
  "transaction",
  {
    id: uuid('id').primaryKey().$defaultFn(v7),
    organizationId: uuid('organization_id').notNull().references(() => organization.id),
    connectionId: uuid('connection_id').notNull().references(() => connection.id),
    documentId: uuid('document_id').notNull().references(() => document.id),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    taxAmount: decimal('tax_decimal', { precision: 12, scale: 2 }),
    categoryId: text("category_id"),
    descriptionAi: text("description_ai"),
    transactionDate: date("transaction_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
)