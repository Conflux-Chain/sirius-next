import queryString from 'query-string';

/** The supported query-string 6 default-format surface, owned by compat. */
export interface ParsedQuery<T = string> {
  [key: string]: T | null | undefined | Array<T | null>;
}

export interface ParseOptions {
  decode?: boolean;
  sort?: false | ((a: string, b: string) => number);
}

export interface StringifyOptions {
  encode?: boolean;
  strict?: boolean;
  sort?: false | ((a: string, b: string) => number);
  skipNull?: boolean;
  skipEmptyString?: boolean;
}

export type QueryValue = string | number | boolean | null | undefined;
export interface StringifiableRecord {
  [key: string]: QueryValue | readonly QueryValue[];
}
export interface ParseUrlOptions extends ParseOptions {
  parseFragmentIdentifier?: boolean;
}
export interface ParsedUrl {
  url: string;
  query: ParsedQuery;
  fragmentIdentifier?: string;
}
export interface UrlObject {
  url: string;
  query?: StringifiableRecord;
  fragmentIdentifier?: string;
}

export function parse(input: string, options?: ParseOptions): ParsedQuery {
  const result = queryString.parse(input, options);
  const normalized = input.trim().replace(/^[?#&]/, '');
  if (!normalized) return result;
  const segments = normalized.split('&');
  if (!segments.includes('')) return result;

  // Version 6 counts empty segments as bare empty keys. Give those keys a
  // collision-free name while delegating decoding and duplicate aggregation.
  let marker = '__sirius_empty_key__';
  while (Object.prototype.hasOwnProperty.call(result, marker)) marker += '_';
  const encoded = segments.map(segment =>
    segment === '' || segment.startsWith('=') ? marker + segment : segment,
  );
  const parsed = queryString.parse(encoded.join('&'), {
    ...options,
    sort: false,
  });
  const restored: ParsedQuery = Object.create(null);
  for (const key of Object.keys(parsed))
    restored[key === marker ? '' : key] = parsed[key];
  if (options?.sort === false) return restored;
  const sorted: ParsedQuery = Object.create(null);
  for (const key of Object.keys(restored).sort(options?.sort))
    sorted[key] = restored[key];
  return sorted;
}

export function stringify(
  input: StringifiableRecord,
  options?: StringifyOptions,
): string {
  return queryString.stringify(input, options);
}

export function extract(input: string): string {
  return queryString.extract(input);
}

export function parseUrl(input: string, options?: ParseUrlOptions): ParsedUrl {
  const hashIndex = input.indexOf('#');
  // The old decoder treats literal plus as space, including in fragments.
  const compatibleInput =
    hashIndex >= 0 && options?.decode !== false
      ? input.slice(0, hashIndex + 1) +
        input.slice(hashIndex + 1).replace(/\+/g, '%20')
      : input;
  const result: ParsedUrl = queryString.parseUrl(compatibleInput, options);
  result.query = parse(extract(input), options);
  return result;
}

export function stringifyUrl(
  input: UrlObject,
  options?: StringifyOptions,
): string {
  const hashIndex = input.url.indexOf('#');
  const base = hashIndex < 0 ? input.url : input.url.slice(0, hashIndex);
  const url = base.split('?')[0] || '';
  const query = Object.assign(
    parse(extract(input.url), { sort: false }),
    input.query,
  );
  const search = stringify(query, options);
  let hash = hashIndex < 0 ? '' : input.url.slice(hashIndex);
  // Keep the legacy truthy override and strict URI encoding of new fragments.
  if (input.fragmentIdentifier) {
    const encoded = stringify({ fragment: input.fragmentIdentifier }, options);
    hash = `#${encoded.slice('fragment='.length)}`;
  }
  return `${url}${search ? `?${search}` : ''}${hash}`;
}

export default { parse, stringify, extract, parseUrl, stringifyUrl };
