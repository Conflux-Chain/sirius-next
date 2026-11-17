import HighchartsReactImport from 'highcharts-react-official';

type HighchartsReactComponent = typeof HighchartsReactImport;

// Strict ESM consumers can receive the UMD exports object instead of its default.
// Keep the original memo/forwardRef component so chart refs continue to work.
const HighchartsReact: HighchartsReactComponent =
  (
    HighchartsReactImport as HighchartsReactComponent & {
      default?: HighchartsReactComponent;
    }
  ).default || HighchartsReactImport;

export type HighchartsReactRef = HighchartsReactImport.RefObject;
export default HighchartsReact;
