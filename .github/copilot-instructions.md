# Copilot instructions for sirius-next

Use this file only as a short Copilot entry point. Keep detailed facts in the
linked documents and update those sources before duplicating information here.

## Read first

- Rules: [AGENTS.md](../AGENTS.md); state: [PROJECT_CONTEXT.md](../docs/PROJECT_CONTEXT.md).
- Design: [ARCHITECTURE.md](../docs/ARCHITECTURE.md); backlog: [TODO.md](../docs/TODO.md).
- Onboarding and integration commands: [README.md](../README.md).

## Hard boundaries

- Keep reusable code in `packages/*`; keep scan pages, routing, and
  Space-specific orchestration in the sibling scan repositories unless explicitly
  authorized otherwise.
- `packages/common` exposes generated deep paths. Do not casually move or rename
  source files, change peer dependency ownership, or restore a root Vitest alias.
- Packages with tests own their `vitest.config.ts` and scripts. `common` uses
  Vitest 3.2.3/jsdom; `useSimulateTrace` remains EVM-only with no log indexing.
- Preserve documented cache, RPC, SDK client, Zustand merge, ABI fallback,
  request/abort, and pubsub semantics before changing shared infrastructure.

## Commands and delivery

- Daily: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`.
- Validation: `pnpm test:coverage`, `pnpm test:consumers`.
- Focused common test: `pnpm --filter @cfxjs/sirius-next-common exec vitest run src/utils/cache.test.ts`.
- The focused command uses a package-relative path; a `packages/common/...` path
  passed to root Turbo is resolved twice. Before every commit, sync affected docs,
  add a changeset for publishable changes, run checks, and use a ready PR.
