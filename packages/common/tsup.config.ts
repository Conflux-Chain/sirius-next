import { defineConfig } from 'tsup';
import { readdirSync, statSync } from 'fs';

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
  publicDir: './public',
  loader: {
    '.png': 'copy',
    '.svg': 'copy',
  },
  dts: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  noExternal: [
    '@cfx-kit/ui-components',
    '@radix-ui/react-select',
    '@radix-ui/react-radio-group',
  ],
});
