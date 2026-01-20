---
applyTo: "src/packages/db/**"
---

# @acontia/db authoring guidelines

These rules describe the current style inside `src/packages/db`. Follow them whenever you add or change schema so the API layer can rely on consistent types.

## Core stack

- Use TypeScript with Drizzle ORM for PostgreSQL exclusively. Import column helpers from `drizzle-orm/pg-core` and the `relations` helper from `drizzle-orm`.
- Instantiate the database through `drizzle(process.env.DATABASE_URL || "", { schema })` (see `src/packages/db/src/index.ts`). Only expose the shared `db` and schema exports—no ad-hoc clients per file.
- Prefer `uuid` primary keys with `v7` defaults. Reuse `uuid("id").$defaultFn(v7).primaryKey()` pattern everywhere unless there is a strong reason to diverge.

## File layout & naming

- Each logical resource gets its own file under `src/packages/db/src/schema`. Keep file names lowercase with dashes/underscores avoided (e.g., `appointment.ts`).
- Group enums, tables, and helper types per file. Export them with descriptive camelCase identifiers (`appointment_type`, `appointment`).
- Column identifiers should mirror database snake_case (`doctor_id`, `created_at`). The TypeScript property stays camelCase (`doctorId`, `createdAt`).

## Schema construction

- Declare enums via `pgEnum` before tables. Reuse them instead of string columns for constrained values.
- Always mark foreign keys with `.references(() => target.id)` and include `onDelete` only when the business rules require cascades.
- Include `createdAt`/`updatedAt` timestamps on every mutable table with `defaultNow()` and `.$onUpdate(() => new Date())` respectively.
- For numeric counters or scores, pick the smallest fitting type (`integer`, `real`) and set safe defaults.
- When working with JSON payloads, set an explicit TypeScript shape via `.$type<YourType>()` to keep consumers strongly typed.

## Relations & naming

- Capture relations in `schema/relations.ts`. Export one `*_relations` object per table, named `<table>_relations` (e.g., `doctor_relations`).
- Use `relationName` whenever the same tables connect in multiple ways so Drizzle can disambiguate joins. Match the existing naming style (`'doctor_schedule'`, `'patient_prescriptions'`).
- Prefer `many()` / `one()` helpers over manual join definitions. Only include relations that are actually queried to avoid unnecessary cascade loading.

## Modularity & reuse

- Import related schemas from sibling files instead of redefining constants. Circular imports are OK because Drizzle only needs references to column builders.
- Extract shared helper types (e.g., `type Drug = { ... }`) near the tables that use them so consumers can import them.

## Style & hygiene

- Keep import order consistent: third-party -> local schema modules. Use double quotes for module specifiers.
- Avoid `any`. When Drizzle typing is insufficient, narrow via `.$type` or exported TypeScript types.
- Use trailing commas inside object literals for clean diffs, and leave a blank line between table declarations.
- When you introduce new columns or enums, double-check that corresponding API validation and seed/migration scripts are updated; leave TODO comments only if immediate follow-up work is required.

Following these guardrails keeps the database package predictable and lets application packages depend on strongly typed entities without surprises.

