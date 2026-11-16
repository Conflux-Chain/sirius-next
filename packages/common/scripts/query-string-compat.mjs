import { transformAsync } from '@babel/core';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const commonDir = fileURLToPath(new URL('../', import.meta.url));

export const queryStringCompat = {
  name: 'query-string-browser-compat',
  setup(build) {
    build.onLoad(
      { filter: /[/\\]query-string[/\\].*\.js$/ },
      async ({ path }) => {
        const result = await transformAsync(await readFile(path, 'utf8'), {
          filename: path,
          babelrc: false,
          configFile: false,
          sourceMaps: 'inline',
          // ES2020-era browsers lack toSorted/replaceAll even after syntax lowering.
          targets: { chrome: '80', firefox: '74', safari: '13.1' },
          plugins: [
            require.resolve('@babel/plugin-transform-unicode-sets-regex'),
            [
              require.resolve('babel-plugin-polyfill-corejs3'),
              {
                method: 'usage-pure',
                version: require('core-js-pure/package.json').version,
                // Resolve from common, not query-string's isolated pnpm directory.
                absoluteImports: commonDir,
              },
            ],
          ],
        });
        if (!result?.code) {
          throw new Error(`No compatible query-string output for ${path}`);
        }
        return {
          contents: result.code,
          loader: 'js',
          resolveDir: dirname(path),
          watchFiles: [path],
        };
      },
    );
  },
};
