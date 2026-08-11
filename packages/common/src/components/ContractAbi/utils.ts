import JSONBigint from 'json-bigint';
import {
  convertBigNumbersToStrings,
  convertObjBigNumbersToStrings,
  fromCfxToDrip,
} from 'src/utils';

interface ParsedValue {
  type: string;
  val: unknown;
}

export const formatValuesToArgs = (
  values: Record<string, unknown>,
  hasValue: boolean,
  forJSSDK = true,
) => {
  // {type: 'string', val: ''} Only string has no set check, it can be '', undefined is an unfilled string,See getValidator type === 'string'.
  const newValues: Record<string, ParsedValue> = JSONBigint.parse(
    JSONBigint.stringify(values, (key, value) =>
      value === undefined
        ? { type: 'string', val: '' }
        : value['type'] === 'tuple'
          ? {
              type: 'string',
              val: convertObjBigNumbersToStrings(
                JSONBigint.parse(value['val']),
              ),
            }
          : /u?int[\d]{2,3}\[/.test(value['type'])
            ? {
                type: 'string',
                val: convertObjBigNumbersToStrings(
                  JSONBigint.parse(value['val']),
                ),
              }
            : value,
    ),
  );
  const items = Object.values(newValues);
  const objValues: any[] = [];
  // Special convert for various types before call sdk
  items.forEach(function (value, index) {
    const val = value['val'];
    if (value['type'] === 'bool') {
      if (val === 'true' || val === '1') {
        value['val'] = true;
      } else if (val === 'false' || val === '0') {
        value['val'] = false;
      }
    } else if (value['type'].startsWith('tuple')) {
      value['val'] = JSON.parse(value['val'] as string);
    } else if (value['type'].endsWith(']')) {
      // array: convert to array
      value['val'] = Array.from(JSON.parse(value['val'] as string));
      // jssdk need buffer type
    } else if (value['type'].startsWith('byte') && forJSSDK) {
      value['val'] = Buffer.from((value['val'] as string).substr(2), 'hex');
    }
    objValues.push(value['val']);
  });

  const args = convertBigNumbersToStrings(objValues);
  // change cfx input to value in payable function
  if (hasValue) {
    return {
      args: args.slice(1),
      value: `0x${fromCfxToDrip(args[0]).toString(16)}`,
    };
  }

  return {
    args,
  };
};
