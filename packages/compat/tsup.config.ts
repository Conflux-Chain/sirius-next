import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entry: { queryString: 'src/queryString.ts' },
  format: ['esm'],
  target: 'es2017',
  splitting: false,
  clean: !options.watch,
  dts: true,
  sourcemap: true,
  noExternal: [
    'query-string',
    'decode-uri-component',
    'filter-obj',
    'split-on-first',
  ],
}));
