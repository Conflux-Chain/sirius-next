import { defineConfig } from 'tsup';
import { readdirSync, statSync } from 'fs';
import { queryStringCompat } from './scripts/query-string-compat.mjs';

const getFilesEntry = (
  filePath: string,
  allComponents: Record<string, string>,
) => {
  readdirSync(filePath).forEach(component => {
    if (
      component === 'images' ||
      component === 'test' ||
      component.includes('.test.')
    ) {
      return;
    }
    try {
      if (statSync(`${filePath}/${component}`).isDirectory()) {
        getFilesEntry(`${filePath}/${component}`, allComponents);
      } else {
        allComponents[
          `${filePath}/${component}`.replace('./src/', '').replace(/\.tsx?/, '')
        ] = `${filePath}/${component}`;
      }
    } catch (_) {
      /* empty */
    }
  }, {});
  return allComponents;
};

export const allComponentsEntry = getFilesEntry('./src', {});

export default defineConfig({
  entry: allComponentsEntry,
  format: ['esm'],
  clean: false,
  publicDir: './public',
  loader: {
    '.png': 'copy',
    '.svg': 'copy',
  },
  target: 'es2020',
  dts: true,
  sourcemap: true,
  esbuildPlugins: [queryStringCompat],
  external: [
    'react',
    'react-dom',
    'i18next',
    'react-i18next',
    'react-router-dom',
  ],
  noExternal: [
    'query-string',
    'filter-obj',
    'split-on-first',
    /^core-js-pure(?:\/|$)/,
    '@cfx-kit/ui-components',
    '@radix-ui/react-select',
    '@radix-ui/react-radio-group',
    '@rc-component/table',
    'viem',
    'cive',
  ],
});
