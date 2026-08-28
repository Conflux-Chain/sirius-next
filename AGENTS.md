# Repository Guidelines

## Project Structure & Module Organization

This pnpm workspace contains ConfluxScan’s next-generation frontend. Applications
live in `apps/`: `apps/core` targets Core Space and `apps/evm` targets EVM
surfaces. Shared React components, utilities, ABI definitions, images, and styles
are in `packages/common/src`; reusable translations are in `packages/i18n`.
Tooling presets live in `packages/eslint-config` and
`packages/typescript-config`. Keep app-specific code in its app and move code
used by both apps into an appropriate shared package.

## Cross-Repository Migration

The current Codex workspace also exposes two independent scan repositories:

- `/Users/mac/Desktop/code/sirius` — Core Space scan;
- `/Users/mac/Desktop/code/sirius-eth` — eSpace scan.

Read [docs/CROSS_REPO_CONTEXT.md](docs/CROSS_REPO_CONTEXT.md) before handling a
cross-repository migration. Treat the two scan repositories as read-only source
and consumer references by default. Modify them only when the user explicitly
asks for scan-side import replacement or fixes. The current migration pattern
is to extract reusable logic into `sirius-next/packages/*`, validate it here,
and then replace the old implementation in the corresponding scan project.
The packed consumer check described below only validates the published package
against the currently installed scan runtime paths; it does not replace a real
scan dependency upgrade, build, page regression check, or deployment check.

## Build, Test, and Development Commands

- `pnpm install` installs workspace dependencies (Node.js 18 or later; pnpm 9.5).
- `pnpm dev` starts all development tasks through Turborepo.
- `pnpm --filter core start` or `pnpm --filter evm start` runs one Vite app.
- `pnpm build` builds every workspace package and app.
- `pnpm lint` runs each package’s ESLint task with zero warnings allowed.
- `pnpm test` dispatches each package’s test script through Turborepo and passes
  `--run`; use `pnpm --filter @cfxjs/sirius-next-common test` for focused
  watch-mode tests.
- `pnpm test:coverage` dispatches each package’s coverage script through
  Turborepo; common uses V8 coverage and writes reports under
  `coverage/common/`.
- Vitest `3.2.3` is the workspace test runner. Keep a package-local
  `vitest.config.ts` for each package that has tests; the former Jest config and
  direct Jest test dependencies were removed. Jest packages that arrive
  indirectly through lint presets are not a test configuration.
- `pnpm test:consumers` builds and packs `common`, then runs Core/EVM consumer
  smoke probes. Use `SIRIUS_CORE_PATH` and `SIRIUS_EVM_PATH` when the adjacent
  scan repositories are not at their documented paths.

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
smallest relevant test command (for example, the request/pubsub tests) plus
`pnpm test` when feasible.

## Areas Requiring Explicit Validation

- Do not move scan pages, scan routing, or Core/eSpace-specific orchestration into
  `apps/*` during the package-first migration. Keep the two scan repositories
  independently buildable and deployable.
- Do not change `common` peer dependency ranges or move React, Router, or i18n
  runtime ownership back into the bundle without testing both scan consumers.
- `fetchWithAbort` notification codes and `pubsub` subscription behavior are
  shared infrastructure. Changes must preserve timeout/abort semantics and add
  focused regression coverage.
- `fetchWithCache`, `rpcRequest`, `sdk.ts` client caching, and Zustand stores are
  shared infrastructure. Preserve cache expiry and rejected-Promise retry,
  `window.CFX` error publication/rethrow, per-space client reuse, environment
  fallback, and nested-map merge behavior when changing them.
- `useDecodeFunctionData` / `useDecodeFunctionError` ABI fallback and loading/error
  priority are public hook behavior. `useSimulateTrace` is currently EVM-only;
  its nested/proxy/creation/revert/gas-failure behavior is covered, but real log
  indexing is not supported by the current interface and must not be invented.
- `packages/common` is currently consumed through generated deep paths. Moving
  or renaming source files can break scan imports even when the package builds.
- Do not restore a root Vitest config with a `src -> packages/common/src` alias.
  A package that gains tests must add its own `vitest.config.ts`, `test`, and
  optional `test:coverage` scripts so Turbo can run it without cross-package
  alias collisions.

## Commit & Pull Request Guidelines

Use Conventional Commit-style subjects seen in history, such as
`feat: support error abi` or `fix: tree trace table support scroll`. Keep commits
focused. For publishable package changes, create a changeset with
`pnpm changeset add`. Pull requests should clearly state the user-facing change,
testing performed, related issue(s), and screenshots for visible UI changes.
Open a ready-for-review PR rather than a draft.

Before every commit, review the code diff against `README.md` and the relevant
documents under `docs/`. Synchronize any changed behavior, public API, command,
test baseline, architecture, migration status, risk, or TODO before committing;
keep `.github/copilot-instructions.md` as a concise index instead of a duplicate
architecture document.

## Configuration & Security

Keep local secrets only in ignored `.env.*.local` files. Do not commit API keys,
private keys, or environment-specific endpoints.
