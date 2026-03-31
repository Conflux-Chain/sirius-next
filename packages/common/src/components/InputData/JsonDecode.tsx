import { useMemo } from 'react';

import { AceEditor } from '../AceEditor';
// import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { formatABI } from 'src/utils';
import { parseArgs } from './utils';
import type { AbiFunctionWithoutGas } from 'src/utils/hooks/useTxTrace';

interface Props {
  decodedParams: {
    args?: readonly unknown[];
    functionName: string;
  };
  decodedResults?: unknown[];
  abiItem: AbiFunctionWithoutGas;
  input: string;
  success?: boolean;
}

const AceEditorStyle = {
  width: 'initial',
  opacity: 0.62,
  margin: '0.3571rem 0',
};

export const JsonDecode = ({
  decodedParams,
  decodedResults,
  abiItem,
  input,
  success,
}: Props) => {
  const json = useMemo(() => {
    try {
      const signature = input.slice(0, 10);
      const fullName = formatABI([abiItem])[0];
      const minimalName = formatABI([abiItem], { minimal: true })[0];
      const params =
        decodedParams.args && parseArgs(decodedParams.args, abiItem.inputs);
      const returns = success
        ? decodedResults && parseArgs(decodedResults, abiItem.outputs)
        : decodedResults?.[0];

      const json = {
        name: abiItem.name,
        fullName: fullName,
        type: minimalName,
        signature: signature,
        params,
        returns,
      };
      return JSON.stringify(json, null, 4);
    } catch (error) {
      return '';
    }
  }, [decodedParams, decodedResults, abiItem, success]);

  return (
    <AceEditor
      style={AceEditorStyle}
      mode="json"
      theme="tomorrow"
      name="inputdata_json"
      fontSize="1rem"
      showGutter={false}
      showPrintMargin={false}
      value={json}
      readOnly={true}
      height="11.1429rem"
      wrapEnabled={true}
    />
  );
};
