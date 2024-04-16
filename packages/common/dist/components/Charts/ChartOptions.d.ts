import * as react_jsx_runtime from 'react/jsx-runtime';
import { ChartOptionsProps } from './config.js';
import 'highcharts/highstock';

declare const ChartOptions: ({ intervalScope, intervalType, limit, onCombination, }: ChartOptionsProps) => react_jsx_runtime.JSX.Element;

export { ChartOptions as default };
