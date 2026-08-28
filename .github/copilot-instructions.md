# Copilot instructions for sirius-next

Sirius-next is a pnpm + Turborepo monorepo for the ConfluxScan frontend. It
publishes shared UI / util packages to npm (`@cfxjs/sirius-next-*`) and hosts
Vite-based apps that consume them.

## Toolchain

- Package manager: `pnpm@9.5.0` (enforced via `packageManager`). Node `>=18`
  locally; CI uses Node 24.
- Orchestration: `turbo` (root scripts `build`, `dev`, `lint` just delegate).
- Always install from the repo root: `pnpm install`.

## Common commands

- Build everything: `pnpm build` (Turbo: `^build` first, outputs to `dist/**`).
- Dev (all apps/packages in watch): `pnpm dev`.
- Lint everything: `pnpm lint`.
- Test all packages (Turbo, Vitest + jsdom): `pnpm test`.
- Run one common test file with its package-local config, e.g.
  `pnpm --filter @cfxjs/sirius-next-common exec vitest run src/utils/cache.test.ts`.
  Do not pass `packages/common/...` to the root `pnpm test`: Turbo runs the
  package task with `packages/common` as its working directory, so that path is
  resolved twice and produces `No test files found`.
- Run common coverage: `pnpm test:coverage`; run consumer smoke probes with
  `pnpm test:consumers`.
- Filter other package commands with pnpm, e.g.
  `pnpm --filter @cfxjs/sirius-next-common build`. A package with tests owns its
  own `vitest.config.ts` and test scripts; there is no root test alias.
- Add a changeset before any publishable change: `pnpm changeset add`, then
  commit the generated file. Publishing is automated by `.github/workflows/release.yml`
  (changesets/action) on push to `main`; do not hand-edit versions.

## Repo layout

- `apps/core`, `apps/evm` — Vite + React 18 + Tailwind applications. They are
  `private` and not published. Entry: `src/main.tsx`, build: `tsc && vite build`.
- `packages/common` (`@cfxjs/sirius-next-common`) — shared React components,
  hooks, and utils. Built with **tsup** (ESM only) and CSS built separately
  with **UnoCSS** (`pnpm build:lib && pnpm build:css`).
- `packages/i18n` (`@cfxjs/sirius-next-i18n`) — translation JSON bundles split
  by space: `cspace/{en,zh_cn}` and `evm/{base,bspace,espace}`. Built with `tsc`.
- `packages/eslint-config` (`@cfxjs/sirius-next-eslint-config`) — `library.js`
  and `react-internal.js` presets consumed by workspace packages.
- `packages/typescript-config` — shared `base.json` / `react-library.json`.

## Architecture notes that require multi-file context

- **tsup entry generation (`packages/common/tsup.config.ts`)**: every `.ts/.tsx`
  file under `src/` becomes its own entry point (recursively), preserving the
  source tree in `dist/`. This is why consumers import subpaths like
  `@cfxjs/sirius-next-common/dist/components/Button`. When adding files under
  `src/`, no config update is needed, but renaming/moving changes the public
  subpath. `images/`, `test/`, and `*.test.*` are excluded.
- **Externals/noExternal**: `react`, `react-dom`, `i18next`, `react-i18next`,
  and `react-router-dom` are external peer dependencies. UI libs
  (`@cfx-kit/ui-components`, `@radix-ui/react-select`, `@radix-ui/react-radio-group`,
  `@rc-component/table`, `viem`, `cive`) are bundled in via `noExternal` — do
  not assume they'll be peer-resolved at runtime.
- **CSS pipeline**: styles come from UnoCSS (`packages/common/uno.config.ts`);
  there is no Tailwind in `common`, but the apps use Tailwind independently via
  their own `tailwind.config.js` / `postcss.config.js`. Don't mix the two.
- **Local linking for the legacy monorepos**: the old `sirius` / `sirius-eth`
  repos consume these packages via symlinks into their `node_modules` (see
  README). When debugging integration issues, rebuild `packages/common` first
  (tsup is watched via `pnpm --filter @cfxjs/sirius-next-common dev`), then the
  consumer picks up `dist/`.
- **Chain utilities**: `packages/common/src/utils` mixes Conflux Core Space
  (`js-conflux-sdk`, `cive`) and eSpace/EVM (`ethers@5.7.0`, `viem`) helpers.
  Pick the correct stack per space; `address.ts` and `sdk.ts` are the
  translation layer.
- **Caching**: `utils/cache.ts` `fetchWithCache` memoizes fetcher return values
  (often Promises) in an in-memory `Map`, keyed by `key + JSON.stringify(args)`,
  with optional `maxAge`. It evicts the entry on Promise rejection so callers
  still receive the rejected Promise but a retry won't hit a poisoned cache.

## Conventions

- TypeScript + ESM everywhere (`"type": "module"` at root and in packages).
- Prettier: single quotes, semicolons, `trailingComma: all`, `arrowParens: avoid`,
  `printWidth: 80`. Runs via lint-staged / Husky on commit; do not fight it.
- Root `.eslintrc.cjs` ignores `apps/**` and `packages/**`; each workspace owns
  its own ESLint config. Lint rules are enforced with `--max-warnings 0` —
  warnings fail the build.
- Tests live next to source as `*.test.ts(x)` and run under Vitest 3.2.3 with a
  jsdom environment. `packages/common/vitest.config.ts` is authoritative;
  the former common Jest config and direct Jest test dependencies were removed.
- Do not commit to `dist/`; it's rebuilt by CI and in `.gitignore`-equivalent
  workflow.
- Translation keys: add to both `cspace/en` and `cspace/zh_cn` (and relevant
  `evm/*` folders) together; missing locales are a common review blocker.
