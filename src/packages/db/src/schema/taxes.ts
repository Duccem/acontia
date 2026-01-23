import { date, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization } from "./auth";

export const tax_status_enum = pgEnum("tax_status_enum", ["open", "calculating", "filed", "closed"])

export const tax_period = pgTable(
  "tax_period",
  {
    id: uuid("id").primaryKey().$defaultFn(v7),
    organizationId: uuid("organization_id").references(() => organization.id),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: tax_status_enum("status").default("open"),
  }
);

export const tax_submission = pgTable(
  "tax_submission",
  {
    id: uuid("id").primaryKey().$defaultFn(v7),
    taxPeriodId: uuid("tax_period_id").references(() => tax_period.id),
    formType: text("form_type"),
    filingReceiptUrl: text("filing_receipt_url"),
    filedAt: timestamp("filed_at"),
  }
);

export const gov_notification = pgTable(
  "gov_notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organization.id),
    originalContent: text("original_content"),
    aiSummary: text("ai_summary"),
    responseDraft: text("response_draft"),
    receivedAt: timestamp("received_at").defaultNow(),
  }
);