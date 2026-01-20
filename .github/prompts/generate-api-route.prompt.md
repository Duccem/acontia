---
agent: 'api-designer-agent'
description: 'Generate an @helsa/api controller route that follows repo conventions.'
---
Generate a controller file for Helsa's API that adheres to the established coding standards and best practices. Before producing the route, gather the following inputs:

- Controller resource: ${input:resource:What is the resource this route will manage (e.g., appointment, user, report)?}
- Actions to implement: ${input:actions:List the CRUD actions or specific operations required (e.g., create, read, update, delete).}
- Business requirements: ${input:requirements:Summarize the key business rules or validations that must be enforced.}


Follow these guidelines:

1. **Confirm context** – restate the resource, actions, and business requirements. Flag any missing info that blocks implementation.
2. **Design input/output contracts** – outline the Zod schemas for request inputs and response outputs based on the business requirements.
3. **Implement the route** – produce a complete TypeScript file that defines the controller route using ORPC, includes necessary middlewares, input validation, and error handling. Ensure the code is runnable and adheres to Helsa's best practices.
4. **Document next steps** – list any follow-up tasks such as adding tests, updating documentation, or integrating with other services.
