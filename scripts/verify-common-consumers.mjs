import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const commonDir = join(repoRoot, 'packages/common');
const commonPackage = JSON.parse(
  readFileSync(join(commonDir, 'package.json'), 'utf8'),
);

const consumers = [
  {
    name: 'core',
    root: process.env.SIRIUS_CORE_PATH || resolve(repoRoot, '..', 'sirius'),
  },
  {
    name: 'evm',
    root: process.env.SIRIUS_EVM_PATH || resolve(repoRoot, '..', 'sirius-eth'),
  },
];

const peerDependencies = Object.keys(commonPackage.peerDependencies);
const fixtureDependencies = ['clsx', 'query-string'];
const probeSource = `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { AbiWarning } from '@cfxjs/sirius-next-common/dist/components/InputData/AbiWarning.js';
import { useSearchParams } from '@cfxjs/sirius-next-common/dist/utils/hooks/useSearchParams.js';

const require = createRequire(import.meta.url);
const commonPackagePath = require.resolve(
  '@cfxjs/sirius-next-common/package.json',
);
const commonPackageRoot = dirname(commonPackagePath);

for (const dependency of ${JSON.stringify(peerDependencies)}) {
  const consumerPath = require.resolve(dependency);
  const commonPath = require.resolve(dependency, {
    paths: [commonPackageRoot],
  });
  assert.equal(
    commonPath,
    consumerPath,
    'common and consumer must resolve one ' + dependency + ' instance',
  );
}

function RouterProbe() {
  const params = useSearchParams();
  return React.createElement('span', null, params.foo || 'missing');
}

const routerMarkup = ReactDOMServer.renderToStaticMarkup(
  React.createElement(
    MemoryRouter,
    { initialEntries: ['/transactions?foo=from-consumer-router'] },
    React.createElement(RouterProbe),
  ),
);
assert.match(routerMarkup, /from-consumer-router/);

const i18n = i18next.createInstance();
await i18n.init({
  lng: 'en',
  fallbackLng: false,
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: {
        warning: 'Translated warning from consumer provider',
      },
    },
  },
});

const i18nMarkup = ReactDOMServer.renderToStaticMarkup(
  React.createElement(
    I18nextProvider,
    { i18n },
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(AbiWarning, { tip: 'warning' }),
    ),
  ),
);
assert.match(i18nMarkup, /Translated warning from consumer provider/);

console.log('router and i18n consumer checks passed');
`;

const linkPackage = (nodeModulesDir, packageName, sourceRoot) => {
  const source = join(sourceRoot, 'node_modules', ...packageName.split('/'));
  if (!existsSync(source)) {
    throw new Error(`Missing ${packageName} in ${sourceRoot}/node_modules`);
  }

  const destination = join(nodeModulesDir, ...packageName.split('/'));
  mkdirSync(dirname(destination), { recursive: true });
  symlinkSync(source, destination, 'dir');
};

const createPackedConsumer = (consumer, packageTarball, fixtureRoot) => {
  const consumerRoot = join(fixtureRoot, consumer.name);
  const nodeModulesDir = join(consumerRoot, 'node_modules');
  mkdirSync(nodeModulesDir, { recursive: true });

  execFileSync('tar', ['-xzf', packageTarball, '-C', consumerRoot]);
  const packageDestination = join(nodeModulesDir, '@cfxjs/sirius-next-common');
  mkdirSync(dirname(packageDestination), { recursive: true });
  renameSync(join(consumerRoot, 'package'), packageDestination);

  for (const dependency of peerDependencies) {
    linkPackage(nodeModulesDir, dependency, consumer.root);
  }
  for (const dependency of fixtureDependencies) {
    linkPackage(nodeModulesDir, dependency, commonDir);
  }

  const probePath = join(consumerRoot, 'probe.mjs');
  writeFileSync(probePath, probeSource);
  execFileSync(process.execPath, [probePath], {
    cwd: consumerRoot,
    stdio: 'inherit',
  });
};

const fixtureRoot = mkdtempSync(join(tmpdir(), 'sirius-next-consumers-'));
let packageTarball;

try {
  for (const consumer of consumers) {
    if (!existsSync(join(consumer.root, 'node_modules'))) {
      throw new Error(
        `${consumer.name} consumer is unavailable: ${consumer.root}/node_modules does not exist`,
      );
    }
  }

  const packDir = join(fixtureRoot, 'pack');
  mkdirSync(packDir, { recursive: true });
  execFileSync('pnpm', ['pack', '--pack-destination', packDir], {
    cwd: commonDir,
    stdio: 'inherit',
  });
  const packedFiles = readdirSync(packDir).filter(file =>
    file.endsWith('.tgz'),
  );
  assert.equal(packedFiles.length, 1, 'expected one common package tarball');
  packageTarball = join(packDir, packedFiles[0]);

  for (const consumer of consumers) {
    createPackedConsumer(consumer, packageTarball, fixtureRoot);
    console.log(`${consumer.name} consumer passed`);
  }
} finally {
  if (process.env.KEEP_CONSUMER_FIXTURE !== '1') {
    rmSync(fixtureRoot, { recursive: true, force: true });
  } else {
    console.log(`consumer fixtures kept at ${fixtureRoot}`);
  }
}
