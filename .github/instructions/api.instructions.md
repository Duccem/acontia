---
applyTo: "src/packages/api/**"
---

# @acontia/api authoring guidelines

These rules capture the current conventions inside `src/packages/api`. Follow them whenever you add or edit routes so the package stays consistent and predictable.

## Core stack & scope

- The package is ESM/TypeScript-first. Use modern syntax (`const`, `async/await`, top-level `export const`).
- Routes are built with `@orpc/server` helpers defined in `src/packages/api/src/middlewares.ts` (`base`, `authenticated`, `premium`). Do **not** bypass these unless you intentionally need a public route.
- Input validation always uses `zod/v4`. Import it as `import { z } from "zod/v4";` (default import is discouraged going forward).
- All persistence goes through the shared Drizzle client exported by `@acontia/db` and the typed schema modules under `@acontia/db/schema/*`.
- Keep third-party SDK configuration (Polar, etc.) colocated inside the router that uses it, and pull secrets from `process.env` only.

## File layout & naming

- Each resource gets its own file under `src/packages/api/src/routers`. File names mirror the resource (`appointment.ts`, `billing.ts`, ...).
- Export a single `const <resource>Router = authenticated.prefix("/<resource>").router({ ... });` per file and register it inside `src/packages/api/src/index.ts`.
- Name individual route handlers in camelCase that starts with a verb (`createAppointment`, `listDiagnoses`). Keep handlers small; extract helpers (e.g., `buildTherapistSearchQuery`) when logic grows.

## Route construction pattern

```typescript
const exampleRoute = authenticated
	.route({ path: "/", method: "GET", inputStructure: "detailed" })
	.input(z.object({ /* body | query | params */ }))
	.errors({ /* optional typed errors */ })
	.handler(async ({ input, context, errors }) => { /* business logic */ });
```

- Always start from `authenticated` (or `.use(premium)` when a subscription is required). Use `base` only for public routes.
- Choose `inputStructure: "detailed"` when you need `params`, `query`, or `body` objects; rely on the default compact shape when a single payload object is enough.
- Handlers receive `{ input, context, errors }`. Destructure only what you need to keep signatures lightweight.

## Validation & data shaping

- Build request DTOs with Zod. Document intent via `.describe()` or by naming fields clearly.
- For dates, accept strings and convert to `Date` as soon as the handler runs (`new Date(date)` or `z.coerce.date()` for query params).
- Use enums for constrained values (`z.enum([...])`). Prefer `.refine` for business rules (e.g., validating HH:mm strings).
- When exposing pagination, include `page`/`pageSize` query parameters with sane defaults and leverage `buildNextPagination(parsedQuery, totalCount)` for the response metadata.

## Database access

- Use the shared `db` instance and schema objects (`appointment`, `diagnosis`, etc.).
- Compose predicates with Drizzle helpers (`eq`, `and`, `between`, `gte`, `lte`, `desc`, `count`). Keep them in small helper functions when reused.
- When checking for record existence, short-circuit early and throw the corresponding typed error.

## Error handling

- Prefer the `.errors({ ... })` builder to describe domain errors. Each entry should declare `message`, `status`, and optional `data` schema. Throw them via the generated helper (`throw PatientNotFound({ data: { patientId } });`).
- Use `ORPCError` for framework-level failures (e.g., `throw new ORPCError("UNAUTHORIZED")`).
- Keep error names descriptive and in PascalCase (`SlotNotAvailable`, `AppointmentNotFound`). Reuse existing names before creating new ones.

## Responses & pagination

- For list endpoints, return `{ items, pagination }` where `pagination` comes from `buildNextPagination`. Keep payloads minimal—only return fields the client needs.
- For mutation endpoints, return nothing or a small acknowledgment object unless the client expects created data.

## Context & auth data

- The `authenticated` middleware injects `{ session, user, organization, role }` in `context`. Use these instead of re-fetching auth data.
- The `premium` middleware enriches the context with `subscription`. Chain it only when the route genuinely requires an active subscription.

## External services

- Instantiate SDK clients once per router file when possible (e.g., the shared `polarClient` in `billing.ts`). Only create per-request instances when the client requires user-specific configuration (ordering endpoints currently do this).
- Wrap outbound requests (`fetch`, SDK calls) in try/catch or guard with status checks. Convert third-party failures into `ORPCError` or typed errors instead of leaking raw exceptions.

## Coding style

- Keep imports ordered: built-ins/third-party, workspace packages (`@acontia/*`), then relative paths.
- Use single quotes for route paths but double quotes for module specifiers, matching the current formatting.
- Avoid `any`. When Drizzle types are too broad, narrow with specific generics or helper types before falling back to casting.
- Add brief comments only when the intent is non-obvious (e.g., describing why an external service call behaves a certain way). Do not annotate straightforward code.
- Prefer `Promise.all` when running independent queries concurrently (see `searchAppointments`), but sequence operations when they depend on each other.

Adhering to these guardrails will keep new APIs aligned with the existing ones and reduce friction when the web app consumes them.

