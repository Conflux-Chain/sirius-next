import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Run in a child process: Webpack 4 needs the legacy OpenSSL provider on Node 22.
const [consumerRoot, fixtureRoot] = process.argv.slice(2);
const require = createRequire(join(consumerRoot, 'package.json'));
const webpack = require('webpack');
const { JSDOM, VirtualConsole } = require('jsdom');
const wrapper = 'highcharts-react-official';
const dependencyResolvers = new Map([[require.resolve(wrapper), require]]);

// Yarn can install a different wrapper version under the existing common package.
// Exercise both the scan's direct dependency and common's resolved dependency.
try {
  const commonRequire = createRequire(
    require.resolve('@cfxjs/sirius-next-common/package.json'),
  );
  dependencyResolvers.set(commonRequire.resolve(wrapper), commonRequire);
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
}

const probeSource = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import HighchartsReact from '@cfxjs/sirius-next-common/dist/components/Charts/HighchartsReact.js';

Exporting(Highcharts);
ExportData(Highcharts);
window.chartProbe = [];
for (const constructorType of ['chart', 'stockChart']) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const ref = React.createRef();
  const render = data => flushSync(() => root.render(
    React.createElement(HighchartsReact, {
      highcharts: Highcharts,
      constructorType,
      ref,
      options: {
        chart: { animation: false },
        title: { text: 'Chart consumer regression' },
        series: [{ data }],
      },
    }),
  ));
  render([[1, 2], [2, 3]]);
  const chart = ref.current.chart;
  const result = {
    constructorType,
    rendered: !!container.querySelector('svg.highcharts-root'),
    initialValue: chart.series[0].yData[0],
    exportWorks: chart.getCSV().includes('2'),
  };
  chart.showLoading();
  result.loadingShown = chart.loadingShown;
  chart.hideLoading();
  result.loadingHidden = !chart.loadingShown;
  render([[1, 5], [2, 8]]);
  result.updatedValue = ref.current.chart.series[0].yData[0];
  result.reusedChart = ref.current.chart === chart;
  root.unmount();
  result.unmounted = ref.current === null && container.childElementCount === 0;
  window.chartProbe.push(result);
}
`;

for (const [wrapperPath, dependencies] of dependencyResolvers) {
  const version = dependencies(`${wrapper}/package.json`).version;
  for (const mode of ['development', 'production']) {
    const outputDir = join(fixtureRoot, `charts-${version}-${mode}`);
    mkdirSync(outputDir, { recursive: true });
    // .js in a type:module package matches common's published ESM boundary.
    // Webpack 4 treats it as auto; Webpack 5 applies strict ESM interop.
    writeFileSync(join(outputDir, 'package.json'), '{"type":"module"}');
    writeFileSync(join(outputDir, 'entry.js'), probeSource);
    const compiler = webpack({
      mode,
      target: 'web',
      entry: join(outputDir, 'entry.js'),
      output: {
        path: outputDir,
        filename: 'bundle.js',
        hashFunction: 'sha256',
      },
      resolve: {
        alias: {
          react$: require.resolve('react'),
          'react-dom$': require.resolve('react-dom'),
          'react-dom/client$': require.resolve('react-dom/client'),
          'highcharts/highstock$': dependencies.resolve('highcharts/highstock'),
          'highcharts/modules/exporting$': dependencies.resolve(
            'highcharts/modules/exporting',
          ),
          'highcharts/modules/export-data$': dependencies.resolve(
            'highcharts/modules/export-data',
          ),
          [`${wrapper}$`]: wrapperPath,
        },
      },
      performance: { hints: false },
    });
    try {
      await new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
          if (error) return reject(error);
          if (stats.hasErrors()) {
            return reject(
              new Error(stats.toString({ all: false, errors: true })),
            );
          }
          resolve();
        });
      });
    } finally {
      if (compiler.close) {
        await new Promise((resolve, reject) => {
          compiler.close(error => (error ? reject(error) : resolve()));
        });
      }
    }

    const virtualConsole = new VirtualConsole();
    const errors = [];
    virtualConsole.on('jsdomError', error => errors.push(error.message));
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      runScripts: 'outside-only',
      pretendToBeVisual: true,
      url: 'https://example.test',
      virtualConsole,
    });
    try {
      dom.window.eval(readFileSync(join(outputDir, 'bundle.js'), 'utf8'));
      assert.deepEqual(errors, []);
      assert.deepEqual(
        JSON.parse(JSON.stringify(dom.window.chartProbe)),
        ['chart', 'stockChart'].map(constructorType => ({
          constructorType,
          rendered: true,
          initialValue: 2,
          exportWorks: true,
          loadingShown: true,
          loadingHidden: true,
          updatedValue: 5,
          reusedChart: true,
          unmounted: true,
        })),
      );
    } finally {
      dom.window.close();
    }
    console.log(
      `charts passed: Webpack ${webpack.version}, wrapper ${version}, ${mode}`,
    );
  }
}
