---
applyTo: "src/apps/web/**"
---

# acontia Web Application Instructions

This document provides specific instructions and guidelines for developing and maintaining the acontia web application. It is intended to ensure consistency, code quality, and adherence to best practices within the web application codebase.

## General Guidelines

- Use Next.js with the App Router for building the web application.
- Use the architecture and design patterns outlined in the main project documentation.
- Follow the coding standards and conventions specified in the main project documentation.

## File Structure

- Organize components, pages, and utilities in a clear and logical manner.
- Use feature-based or domain-based folder structures where appropriate.
- Use kebab-case for file and folder names.
- Keep styles and assets organized in dedicated folders.
- Follow the established naming conventions for files and folders.
- Use the folder `modules` for store each of the features of the application.
- Each feature should have its own directory containing all related components, hooks, styles, store, lib.
  - For example, a `user-profile` feature might have the following structure:
    ```
    modules/
      user-profile/
        components/
        hooks/
        styles/
        store/
        lib/
    ```
- Use kebab-case for components and files inside each feature folder.
- Maintain a clear separation of concerns by organizing code based on functionality.
- Ensure that each module is self-contained and can be easily maintained or updated independently.

## Component Development

- Create reusable and modular components.
- Use functional components and React hooks.
- For components with interactions or state management, prefer using client components by adding `"use client";` at the top of the file.
- For page routes components, use server components by default unless client-side interactivity is required.
- Ensure each component its responsive and accessible.

## Data Fetching

- Use `@tanstack/react-query` for data fetching and state management.
- Follow best practices for caching, error handling, and loading states.
- Don`t use server components for data fetching directly; instead, use client components with React Query to handle data operations.
- Use the `@tanstack/react-query` hooks such as `useQuery` and `useMutation` for fetching and mutating data.
- Use the hooks inside the components itself
- Ensure proper error handling and loading states in the UI.

## UI

- Follow the design system and UI guidelines specified in the main project documentation.
- Use consistent styling and theming across the application.
- Ensure the application is responsive and works well on various devices and screen sizes.
- Use the component library `@acontia/ui` for building UI components.
- Avoid using custom CSS or styles unless absolutely necessary; prefer using the design system's styling solutions.
- Ensure accessibility standards are met throughout the application.
