# @cfxjs/sirius-next-compat

Small compatibility utilities shared by the scan applications. The first module
contains only the supported query-string 6 default-format surface. It has no
React peers or runtime package dependencies.

## API

```ts
import queryString, {
  parse,
  stringify,
  extract,
  parseUrl,
  stringifyUrl,
  type ParsedQuery,
} from '@cfxjs/sirius-next-compat/dist/queryString.js';
```

The default export contains those same five functions. Public types also include
`ParseOptions`, `StringifyOptions`, `QueryValue`, `StringifiableRecord`,
`ParseUrlOptions`, `ParsedUrl`, and `UrlObject`. Common and scan consumers import
these functions and types directly from the compat entry above.

Parsing retains strings, repeated values, bare flags as null, empty values, and
null-prototype objects. Keys sort by default; `sort: false` preserves encounter
order. Empty ampersand segments remain bare empty keys. Plus signs decode to
spaces, including in fragments when fragment parsing is requested. Stringifying
uses repeated keys for arrays, omits undefined values, and supports the declared
encoding, sorting, null, and empty-string options. URL helpers accept relative
URLs, merge query overrides (undefined removes a value), preserve existing raw
hashes, and only replace a hash when the supplied fragment is truthy.

This is a deliberately limited API, not all query-string 6 or 9 options. It does
not expose alternate array formats, automatic number/boolean parsing, or upstream
pick/exclude helpers. The adapter intentionally restores empty segments and
legacy fragment behavior that differ from query-string 9 defaults. Malformed
percent sequences use the maintained decoder's bounded handling; exact malformed
byte replacement is not promised to match the old decoder.

## Build and browser contract

`pnpm build` emits standalone ESM `dist/queryString.js`, declarations, and a source
map. Splitting is disabled and query-string plus its decoder, filter-obj, and
split-on-first dependencies are bundled. The upstream query-string version is
pinned to 9.3.1, and the workspace override must retain
`query-string@9.3.1>decode-uri-component: 0.5.1`. The workspace lockfile also fixes
filter-obj and split-on-first resolutions. These choices are intentional: changing
them requires rerunning compatibility tests and the malformed-input bundle check.

The ES2017 target controls JavaScript syntax only. No global polyfills are
installed or injected. Consumers must supply runtime APIs required by their
browser targets, including String.prototype.replaceAll, Array.prototype.flat,
and standard ES2017 APIs such as Object.entries/Object.values. Load any required
polyfills before this module. ESM support or a consumer bundler is also required.

The initial manifest version is 0.0.0; the minor changeset prepares first release
0.1.0. Use `pnpm dev` at the workspace root to start Turbo's development tasks.
Turbo starts the development tasks in parallel, with no separate compat build
prerequisite. Compat's `tsup --watch` performs an initial build, then rebuilds on
source changes without clearing the previous output. Turbo does not wait for
that initial build before starting common's watcher.

Run `pnpm test --run` for the colocated behavior tests and, after building,
`pnpm test:query-string-bundle` for standalone JS/declaration checks and bounded
malformed-input checks. The latter resolves output relative to its own script,
independent of the caller's working directory. At the workspace root, `pnpm build`
uses Turbo to build compat before common. `pnpm test:consumers` runs that workspace
build before the packed consumer probes. Direct common builds do not build compat;
run `pnpm --filter @cfxjs/sirius-next-compat build` first when using them. Workspace
tests also use Turbo to build package dependencies before testing common's use of
compat.
