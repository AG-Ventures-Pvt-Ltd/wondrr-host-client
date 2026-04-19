## Tech Stack
- Use TypeScript strictly (no `any`)
- Framework: Next.js (App Router)

## Components Rule (IMPORTANT)
- ALWAYS use existing custom components instead of native HTML
- Never use raw tags directly for common UI

## Imports
- Prefer importing from "@/components/ui/*" (or your actual path)
- Do not create duplicate components if one already exists

## Project Structure (Feature-Based)
- Follow modular, feature-wise structure
- Each feature should have its own:
  - types
  - constants
  - utils
  - hooks
  - components/

- Do NOT mix feature logic across folders

### Common Shared Code
- Shared code must go inside:
  src/common/
- Only truly reusable logic goes here

## Constants Usage (IMPORTANT)
- Avoid hardcoded strings in JSX or logic
- Store reusable/static values in constants/
- Use constants instead of inline text wherever possible

## API & Data Fetching
- ALWAYS use custom hooks for API calls
  - useGet*
  - usePost*
- Do NOT call fetch/axios directly inside components

## Clean Code Rules
- No magic strings
- Keep logic separated from UI
- Reuse utilities instead of duplicating logic


## Types (STRICT)

- Do NOT create duplicate or similar types across features
- Prefer reusing existing types from shared/base definitions

### Base Types
- Define common/base types in a central place (e.g. src/common/types/)
- Examples: BaseResponse, Pagination, UserBase, etc.

### Extending Types
- Always extend base types instead of redefining
- Use:
  - `extends` (interfaces)
  - `&` (type composition)

### Rules
- No repeated shape definitions
- No slight variations of same type
- Keep types DRY and scalable
- Follow system design principles for reusability

### Example Pattern
- Base → Extended → Feature-specific