---
applyTo: "src/packages/workflows/**"
---

# @acontia/workflows authoring guidelines

These conventions keep `src/packages/workflows` consistent. Follow them whenever you add new background jobs or event handlers.

## Core stack & scope

- Use Inngest exclusively for workflows. Import the shared client from `src/packages/workflows/src/index.ts` (`export const inngest = new Inngest({ id: "acontia" });`).
- Long-running logic belongs in `src/packages/workflows/src/workflows/*`. Keep `index.ts` minimal (only exports the Inngest client and composed functions when needed).
- All persistence goes through the shared `@acontia/db` Drizzle client and typed schema modules (e.g., `@acontia/db/schema/schedule`). Never instantiate ad-hoc connections.
- Date math uses `date-fns`. Prefer pure helpers (`addMinutes`, `startOfDay`, etc.) over manual arithmetic.

## File layout & naming

- Each workflow domain sits in its own file under `workflows/` (e.g., `availability.ts`, `medications.ts`). Name the exported functions after their behavior (`generateAvailability`, `reminderForgottenMedications`).
- Keep helper utilities (like `getNextMonthRange`, `computeNextDoseTime`) in the same file unless reused elsewhere. If multiple files need them, extract to `workflows/utils.ts` and document the shared behavior.

## Inngest function pattern

```
export const exampleWorkflow = inngest.createFunction(
	{ id: "example", name: "Example" },
	trigger, // { event: "foo" } or { cron: "*/5 * * * *" }
	async ({ step, event, ctx }) => {
		const result = await step.run("meaningful-name", async () => { /* work */ });
		await step.sendEvent("description", eventsArray);
		return { message: "Done" };
	}
);
```

- Always provide stable `id` and human-readable `name`. IDs are kebab-case, names are sentence case.
- Use `event` triggers for reactive flows and `cron` for schedulers. Document cron cadence with a short comment.
- Wrap every asynchronous block in `step.run("action-name", async () => { ... })` for observability. Pick descriptive kebab/phrase names (`'get-next-reminders'`, `'prepare-new-reminders'`).
- When emitting downstream events, gather them into arrays and call `step.sendEvent` once per batch.

## Data handling

- Fetch data via `db.query.<table>.findFirst/findMany` helpers and compose predicates with Drizzle utilities (`eq`, `and`, `between`, `inArray`).
- When generating records in bulk, build arrays in memory first, then insert them in batches (see `generateAvailability`). Use `BATCH_SIZE` constants and slice loops to avoid large single inserts.
- Log or return concise status objects (`{ message: 'Availability generation completed' }`). Avoid leaking large payloads.
- Extract deterministic helper functions for parsing/formatting (e.g., `parseTime`, `formatTime`). Keep them pure so they’re testable.

## Date & time conventions

- Normalize dates at the start using `startOfDay`, `startOfMonth`, etc. Always operate in UTC unless there is a domain reason otherwise.
- When comparing ranges, derive the boundary once and reuse (e.g., `const inFifteenMinutes = addMinutes(new Date(), 15);`).
- Favor ISO strings for map keys (`formatISO(startOfDay(dt), { representation: "date" })`).

## Idempotency & safety

- Before inserting generated data, delete or dedupe existing records for the same range/state (see availability workflow). Track taken entries with `Set`/`Map` objects to prevent duplicates.
- Guard cron jobs to no-op when there is nothing to do (e.g., return early with an explanatory message if query results are empty).
- Wrap external integrations (notifications, etc.) in their own `step.run` blocks even if currently `console.log` placeholders, so they can be replaced with real services later.

## Coding style

- Import order: third-party modules (date-fns, inngest), shared packages (`@acontia/db`), Drizzle helpers, then relative modules.
- Use double quotes for module paths and single quotes for string literals when aligning with existing files.
- Keep comments short and purposeful (cron cadence, TODO for future notification integration).
- Avoid `any`; type helper functions explicitly when they return complex structures (`Map<string, number>`).

Following these guidelines ensures new workflows are observable, predictable, and easy to maintain alongside the existing availability and medication jobs.

