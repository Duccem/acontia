---
agent: 'database-designer-agent'
description: 'Generate a Drizzle ORM aggregate schema that matches Helsa standards on @helsa/db.'
---

Generate a Drizzle ORM schema file for Helsa's database that adheres to the established coding standards and best practices. Before producing the schema, gather the following inputs:

- Entity name: ${input:entity:What is the name of the database entity (e.g., appointment, user, report)?}
- Attributes: ${input:attributes:List the attributes/columns required for this entity, including their data types and any constraints (e.g., not null, unique).}
- Relationships: ${input:relationships:Describe any relationships this entity has with other entities (e.g., foreign keys, one-to-many, many-to-many).}
- Business rules: ${input:businessRules:Summarize any specific business rules or validations that must be enforced at the database level.}

Follow these guidelines:

1. **Confirm context** – restate the entity name, attributes, relationships, and business rules. Flag any missing info that blocks implementation.
2. **Design the schema** – outline the Drizzle ORM table definition, including column types, constraints, and relationships based on the provided inputs.
3. **Implement the schema** – produce a complete TypeScript file that defines the Drizzle ORM schema using Helsa's coding standards. Ensure the code is runnable and adheres to best practices.
4. **Document next steps** – list any follow-up tasks such as adding migrations, updating related API routes, or integrating with other services.