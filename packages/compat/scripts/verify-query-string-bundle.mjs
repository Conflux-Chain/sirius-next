import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const entry = new URL('../dist/queryString.js', import.meta.url);
const source = readFileSync(entry, 'utf8');
const declarations = readFileSync(new URL('./queryString.d.ts', entry), 'utf8');
// A data URL cannot resolve package or relative imports. Also reject dynamic
// imports and require calls, even on branches not exercised by this smoke test.
assert.doesNotMatch(
  source,
  /\bimport\s*(?:\(|["'{*])|\brequire\s*\(|\bfrom\s*["']/,
);
assert.doesNotMatch(declarations, /\b(?:import|require)\b|\bfrom\s*["']/);
const child = spawnSync(
  process.execPath,
  [
    '--input-type=module',
    '-e',
    `
  import assert from 'node:assert/strict';
  import { readFileSync } from 'node:fs';
  const source = readFileSync(${JSON.stringify(fileURLToPath(entry))}, 'utf8');
  const { default: qs } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  assert.deepEqual(qs.parse('x&x=&x=a').x, [null, '', 'a']);
  assert.equal(qs.stringifyUrl({url:'../x?a=old#raw%20hash', query:{a:'new'}}), '../x?a=new#raw%20hash');
  for (const malformed of ['%FF'.repeat(50000), '%EA'.repeat(50000), '%41%FF'.repeat(50000), '%E0%A4'.repeat(50000), '%'.repeat(150000)]) {
    for (const query of ['bad=' + malformed + '&ok=done', malformed + '=value&ok=done']) {
      assert.equal(qs.parse(query).ok, 'done');
      assert.equal(qs.parseUrl('/x?' + query).query.ok, 'done');
      assert.equal(qs.parseUrl(qs.stringifyUrl({url: '/x?' + query})).query.ok, 'done');
    }
  }
`,
  ],
  {
    timeout: 10000,
    killSignal: 'SIGKILL',
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  },
);
assert.ifError(child.error);
assert.equal(child.signal, null, `Bundle child killed: ${child.signal}`);
assert.equal(child.status, 0, child.stderr || child.stdout);
console.log(
  'Standalone query-string bundle and bounded malformed-input checks passed.',
);
