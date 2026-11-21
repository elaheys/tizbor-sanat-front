# Tizbor Sanat — Frontend

React + TypeScript + Vite frontend for Tizbor Sanat.

## Stack

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- React Query
- React Router
- Zustand
- React Hook Form + Zod
- pnpm

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Environment variables

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

## Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `pnpm dev`          | Start dev server                 |
| `pnpm build`        | Type-check and build             |
| `pnpm preview`      | Preview production build         |
| `pnpm lint`         | Run oxlint                       |
| `pnpm format`       | Format all files with Prettier   |
| `pnpm format:check` | Check formatting without writing |

## Linting & formatting

- Lint rules: [.oxlintrc.json](.oxlintrc.json)
- Format rules: [.prettierrc.json](.prettierrc.json)
- A pre-commit hook (Husky + lint-staged) lints and formats staged files automatically.

## CI

GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint, format check, type-check, and build on every push/PR to `main`.
