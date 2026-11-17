# Chart wrapper compatibility

Common publishes ESM. In Webpack 5, importing the UMD build of
`highcharts-react-official` from strict ESM can return an exports object whose
`default` is the React component. Passing the exports object to React causes
`Element type is invalid` (production error #130). This is reproducible with
both wrapper 3.1.0 and 3.2.1; upgrading from 3.1.0 to 3.2.1 alone does not fix it.
Webpack 4 can instead return the component directly for common's published
`.js` files.

`src/components/Charts/HighchartsReact.ts` handles both import shapes and returns
the original memo/forwardRef component. Both `PreviewChartTemplate` and
`StockChartTemplate` use it. Template import paths and props remain unchanged;
React stays external and consumer-owned. Do not detect compatibility by checking
for a function: React memo/forwardRef components can be valid objects.

## Regression checks

- `pnpm test:consumers` builds and packs common, then uses each scan's installed
  Webpack in development and production mode to render the packed adapter in
  jsdom. It checks regular and stock charts, SVG output, chart refs, updates,
  loading, CSV export and unmount. The scan's top-level wrapper and the wrapper
  resolved by its installed common package are both exercised when available.
  The chart probe uses `--openssl-legacy-provider` only in its child process to
  support Webpack 4 on Node 22+.

Consumer fixtures read the sibling repositories without changing them. Override
their paths with `SIRIUS_CORE_PATH` and `SIRIUS_EVM_PATH`. Unit tests run in normal
workspace CI; consumer checks additionally require the sibling repositories and
their installed dependencies. They test the packed adapter, not complete scan
pages or an actual dependency installation.

## Consumer release checklist

After publishing the patch, update `@cfxjs/sirius-next-common` in the affected
scan's `package.json` and `yarn.lock`, install, rebuild and deploy. This fix does
not require changing scan page imports, props, or Webpack module rules.

Before deploying, verify the homepage transaction-count and account-growth
previews, plus chart detail pages: initial render, loading/empty responses,
time-range changes and CSV export. Verify development and production builds.
The package fix does not address unrelated wallet-detection or font warnings.
