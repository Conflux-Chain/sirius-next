# Repository Guidelines

## Project Structure & Module Organization

This pnpm workspace contains ConfluxScan’s next-generation frontend. Applications
live in `apps/`: `apps/core` targets Core Space and `apps/evm` targets EVM
surfaces. Shared React components, utilities, ABI definitions, images, and styles
are in `packages/common/src`; reusable translations are in `packages/i18n`.
Tooling presets live in `packages/eslint-config` and
`packages/typescript-config`. Keep app-specific code in its app and move code
used by both apps into an appropriate shared package.

## Build, Test, and Development Commands

- `pnpm install` installs workspace dependencies (Node.js 18 or later; pnpm 9.5).
- `pnpm dev` starts all development tasks through Turborepo.
- `pnpm --filter core start` or `pnpm --filter evm start` runs one Vite app.
- `pnpm build` builds every workspace package and app.
- `pnpm lint` runs each package’s ESLint task with zero warnings allowed.
- `pnpm test` runs Vitest once in a jsdom environment; use
  `pnpm --filter @cfxjs/sirius-next-common test` for focused watch-mode tests.

## Coding Style & Naming Conventions

Write TypeScript and React components using the repository’s Prettier settings:
two spaces, single quotes, semicolons, trailing commas, and an 80-column target.
Run `pnpm format` on staged supported files before committing. Follow ESLint’s
shared configuration; do not introduce unused disables. Use PascalCase component
directories and files (for example, `components/Modal/index.tsx`), camelCase for
utilities and hooks (`useHighCharts.ts`), and colocate styles/assets with the
feature when practical.

## Testing Guidelines

Use Vitest with jsdom. Place unit tests beside the implementation and name them
`*.test.ts` or `*.test.tsx`; describe behavior in `describe`/`test` blocks, as in
`packages/common/src/components/AddressContainer/utils.test.ts`. Add regression
coverage for changed parsing, formatting, request, or UI logic, then run the
smallest relevant test command plus `pnpm test` when feasible.

## Commit & Pull Request Guidelines

Use Conventional Commit-style subjects seen in history, such as
`feat: support error abi` or `fix: tree trace table support scroll`. Keep commits
focused. For publishable package changes, create a changeset with
`pnpm changeset add`. Pull requests should clearly state the user-facing change,
testing performed, related issue(s), and screenshots for visible UI changes.
Open a ready-for-review PR rather than a draft.

## Configuration & Security

Keep local secrets only in ignored `.env.*.local` files. Do not commit API keys,
private keys, or environment-specific endpoints.
