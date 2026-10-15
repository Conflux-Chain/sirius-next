# Simulate transaction lists

`SimulateTraceTxParams` accepts optional `accessList` and `authorizationList`.
Simulation remains EVM-only. The request is sent to `/traceCallView`, which must
support these fields and the target node's EIP-2930/EIP-7702 behavior.

## Data contract

- `accessList`: viem `AccessList`; each entry contains a 20-byte hex `address`
  and an array of 32-byte hex `storageKeys`. An empty list is allowed.
- `authorizationList`: viem `RpcAuthorizationList`; a non-empty array of signed
  entries containing `address`, `chainId`, `nonce`, `yParity`, `r`, and `s`.
  All numeric fields are hex strings. `chainId`, `r`, and `s` fit uint256;
  `nonce` fits uint64; `yParity` is zero or one. Padded hex quantities are
  normalized to minimal hex without passing through JavaScript numbers.
- Authorization lists require a valid transaction `to` address. Authorization
  `chainId = 0` is allowed. The frontend does not sign, check current on-chain
  nonces, or establish signature/execution validity. Nodes may skip individual
  authorizations according to protocol rules; a successful trace alone does not
  prove that all authorizations were applied.
- List order, duplicate entries, and duplicate storage keys are preserved.
  Inputs are not mutated. Invalid fields fail before gas estimation or tracing.

The helpers are available at `dist/utils/transactionLists`:
`normalizeTransactionLists`, `parseTransactionListsFromUrl`, and
`TransactionListError` (with an `accessList` or `authorizationList` field).

## Gas estimation

`querySimulateTrace` first normalizes the lists and fills the existing default
fee cap. If `gas` is absent, estimation receives both lists, the effective fee
fields, calldata, sender, recipient, value, and the same block tag as tracing.
The EVM SDK uses the cached viem client's high-level `estimateGas` whenever
`authorizationList` is absent, including requests with access lists, fees, and
block context. Fee strings become bigint; hex block numbers become `blockNumber`
bigints (including zero), while named tags become `blockTag`. viem retains its
request validation (e.g. an oversized fee cap or a tip above a nonzero cap);
mixed legacy/EIP-1559 fees still reach the node for validation. Only requests with
`authorizationList` use `client.request` for `eth_estimateGas`, preserving RPC
authorization quantities without number conversion; those fee constraints
remain subject to node validation.

An explicit `gas` bypasses estimation. If estimation fails, tracing still runs
without a supplied gas limit and retains both lists. This preserves the existing
fallback; a node lacking authorization-aware estimation may still support the
trace endpoint. No authorization is removed to force a successful estimate.

`sdk.estimateGas` also accepts `accessList`, `gasPrice`, `maxFeePerGas`, and
`maxPriorityFeePerGas` for Core Space. Fee inputs accept decimal or hex strings,
convert through bigint, and reach the RPC as hex quantities without precision
loss. Explicit zero is preserved; omitted fees stay omitted. Core fee
combinations and relationships are left for node validation; no
fee fields are silently removed or defaulted. Neither SDK estimate wrapper
currently accepts a `gas` input (the Simulate hook bypasses estimation when gas
is supplied). Core addresses retain
their native base32 representation and cive forwards the list to
`cfx_estimateGasAndCollateral`; the helper still returns `gasLimit`. Core
`authorizationList` is excluded by the TypeScript API and rejected at runtime
before a client request. This does not enable Core Simulate Trace.

Core estimation also accepts `tag`: `latest_state` (the default),
`latest_confirmed`, `latest_checkpoint`, `earliest`, or a hex epoch number.
Named tags map to cive's `epochTag`; nonzero hex values map to `epochNumber`
via bigint. Zero (`0x0`, including padded zero) maps to `earliest` because this
cive version treats `epochNumber: 0n` as absent. Unsupported labels (including
EVM `latest`/`safe`/`pending` and Core `latest_mined`/`latest_finalized`) and
malformed numbers fail before RPC submission. The exported `CoreEstimateGasTag`
and the space-specific parameter union keep the two tag vocabularies separate.
Historical state availability still depends on the selected node.

```ts
await estimateGas({
  space: 'core',
  to: coreAddress,
  data: calldata,
  maxFeePerGas: '2000000000',
  tag: 'latest_confirmed', // or a hex epoch such as '0x123'
});
```

## Scan URL integration

The `sirius-eth` Simulate page reads both parameters directly from the parsed
query, before tab-query filtering. Each must be one JSON array; duplicate query
keys, blank values, invalid JSON/schema, and decoded values longer than
`MAX_TRANSACTION_LIST_URL_LENGTH` (128 Ki characters per field) are rejected.
Invalid lists display a translated field error and disable simulation. Valid
parameters survive Trace/Logs tab navigation.

```ts
const url = new URL('/simulate', window.location.origin);
url.searchParams.set('to', recipient);
url.searchParams.set('data', calldata);
url.searchParams.set('accessList', JSON.stringify(accessList));
url.searchParams.set('authorizationList', JSON.stringify(signedAuthorizations));
```

The page continues to use the calldata URL codec independently. The authorization
list contains already-signed data; this feature adds no wallet signing flow.

## Validation and release boundary

Regression tests cover validation, URL decoding, ordering/duplicates, large
quantities, Core rejection, Core fee serialization (including zeros and node
errors), both SDKs' actual RPC serialization, and trace gas
fallback. Scan tests cover URL retention and disabling simulation on invalid
lists. Consumer checks must use a common/i18n build containing this change; the
scan's previously pinned published packages do not include the new helper/keys.

The scan source integration references `sirius-eth` commit
`67565bfe4bb18240b006f4cc615a1128cbbd148f` plus the existing uncommitted page changes.
Before release, upgrade the consumer dependencies and verify the deployed
`/traceCallView` service, target nodes, authorization execution, and corresponding
`authMap`/ABI enrichment. Local serialization and mocked tests do not establish
those backend capabilities. No real log-index behavior was added.

Validation on 2026-10-15:

- `pnpm test`: 417 tests passed; `pnpm lint` and common TypeScript checks passed.
- common and i18n builds passed; packed Core/EVM runtime consumer probes passed.
- The eSpace page/query suites passed 22 tests using the new local packages.
  Its existing Jest setup needs a compatibility workaround: expose the nested
  `react-scripts/node_modules/babel-jest` through `NODE_PATH`, transform common's
  ESM files, and replace the global setup for this focused run to avoid the old
  `jest-styled-components` setup failing against styled-components 6. These
  test-environment changes were confined to a temporary validation copy.
- eSpace TypeScript and focused ESLint checks passed. A temporary consumer copy
  passed the production build with dynamic-require dependency warnings; loader
  include paths were adjusted only in that copy to resolve its symlinked
  dependencies as they resolve in the original checkout.
- The local eSpace checkout now links common/i18n to this workspace for
  development, with the original installed directories backed up in the system
  temporary directory. Published dependency versions and lockfiles are unchanged.
