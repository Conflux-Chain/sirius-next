# @cfxjs/sirius-next-common

## 0.7.1

### Patch Changes

- 89651af: Fix the contract viewer crashing when a strict ESM consumer loads the CommonJS export of react-ace.

## 0.7.0

### Minor Changes

- d4020c9: Remove the unused CookieTip component, its CookieIcon, and the cookie utility,
  including the incomplete regular expression escaping reported by CodeQL.

  The `dist/components/CookieTip/index`, `dist/components/CookieTip/CookieIcon`,
  and `dist/utils/cookie` entry points are no longer available. Consumers must
  remove any remaining imports before upgrading. The current Core Space and
  eSpace scan sources have no active imports of these modules.

### Patch Changes

- 0c75d71: Update react-use to resolve a cookie attribute injection advisory in its js-cookie dependency.
- 892e4a4: Fix exponential regular expression backtracking in validURL when checking long
  invalid domains, while preserving the existing accepted URL syntax.
- 2203dbd: Require lodash ^4.18.1 and refresh lodash-es to 4.18.1 in the workspace lockfile
  to address template imports code injection and prototype property deletion.
  Scan consumers must also refresh their transitive lodash-es resolution.
- 535f619: Upgrade ethers to 5.8.0 and refresh elliptic to 6.6.1 in the workspace lockfile. Consumers must refresh their SDK transitive dependency; GHSA-848j-6mx2-7j84 remains unresolved.
- fa5de41: Match Google Analytics targets only for confluxscan.org, confluxnetwork.org,
  and their dot-delimited subdomains. Unrelated hosts containing either domain
  name now use the development target. The confluxscan.org family uses the
  production target (including testnet.confluxscan.org), and the
  confluxnetwork.org family uses the test target.
- ec3c1f1: Build the common package with tsup 8.5.1 while preserving its ESM and declaration entry points.
- dc7189d: Upgrade Vite to the 6.4 line and align the UnoCSS toolchain with Vite 6.

## 0.6.1

### Patch Changes

- c6ee602: Fix chart rendering in strict ESM consumers by normalizing the Highcharts React UMD default export while preserving chart refs.

## 0.6.0

### Minor Changes

- 8586b4b: Require Node.js 22 and upgrade query-string to 10.0.0 to remove GHSA-qr28-fpjm-wq7f; replace react-utils with the internal click-away hook.

  Breaking changes: invalid UTF-8 query bytes now decode to U+FFFD, and unsupported
  query values such as objects and Date instances throw TypeError instead of being
  implicitly stringified. Format these values explicitly before passing them to
  common request helpers. Dropdown and Tooltip preserve their existing document
  click, multi-ref, and portal behavior without pulling in WalletConnect.

## 0.5.0

### Minor Changes

- 3aaa56b: Support access and signed authorization lists in EVM simulation and gas estimation, Core access-list and legacy/EIP-1559 fee estimation, and translated URL validation errors.

  Use viem’s high-level EVM gas estimator for access lists, fees, and block context; reserve direct RPC requests for exact authorization-list quantities.

  Support Core gas estimation epoch tags and hex epoch numbers, mapping epoch zero to earliest and rejecting unsupported tags before RPC submission.

## 0.4.1

### Patch Changes

- fa15f5b: Support maxPriorityFeePerGas in simulation parameters. When a priority fee is
  provided without a fee cap or legacy gas price, use the larger of
  22 Gdrip and the priority fee as the fallback cap for simulation.

## 0.4.0

### Minor Changes

- d3a9b0c: Declare React, Router, and i18n runtime packages as peer dependencies and add packed-consumer smoke tests for Core and EVM scan dependency versions.

  Prevent timeout-triggered aborts from emitting a duplicate request error notification and add timeout/abort regression coverage.

  Fix pubsub unsubscription ordering and self-unsubscription behavior without changing its public API.

## 0.3.7

### Patch Changes

- feat: check label valid

## 0.3.6

### Patch Changes

- 3edd5b2: feat: add verified contracts statistics

## 0.3.5

### Patch Changes

- fix: tooltip click event

## 0.3.4

### Patch Changes

- fix: useDecodeFunctionData return abiItem

## 0.3.3

### Patch Changes

- 7e41fe0: feat: encode calldata

## 0.3.2

### Patch Changes

- feat: add ExternalLink icon

## 0.3.1

### Patch Changes

- feat: support no ENV_WALLET_CONFIG env

## 0.3.0

### Minor Changes

- feat: add simulate trace

## 0.2.29

### Patch Changes

- fix: general decode error

## 0.2.28

### Patch Changes

- fix: tooltip ui

## 0.2.27

### Patch Changes

- fix: tree trace table support scroll

## 0.2.26

### Patch Changes

- feat: support error abi

## 0.2.25

### Patch Changes

- 2e5449f: fix nft ipfs gateway

## 0.2.24

### Patch Changes

- 3f92a28: fix: error report

## 0.2.23

### Patch Changes

- 3b91823: feat: add unit test

## 0.2.22

### Patch Changes

- ed41781: feat: aa tx detail

## 0.2.21

### Patch Changes

- 9222b26: fix: transaction action token symbol display

## 0.2.20

### Patch Changes

- 8b39e0e: fix: address nameMap

## 0.2.19

### Patch Changes

- dcfcf2e: fix: verificationName tooltip

## 0.2.18

### Patch Changes

- 6c1bafd: feat: support nameMap

## 0.2.17

### Patch Changes

- 0f39df0: fix: function name

## 0.2.16

### Patch Changes

- e2207e7: fix: proxy address alias

## 0.2.15

### Patch Changes

- 475e973: fix: tx trace ui

## 0.2.14

### Patch Changes

- becb994: fix: tx trace decode error

## 0.2.13

### Patch Changes

- b4779d5: fix: output display error

## 0.2.12

### Patch Changes

- feat: optimize ui

## 0.2.11

### Patch Changes

- feat: tx trace

## 0.2.10

### Patch Changes

- feat: token holder filter

## 0.2.9

### Patch Changes

- fix: search input style

## 0.2.8

### Patch Changes

- fix: focus on input after click next/prev button

## 0.2.7

### Patch Changes

- feat: enhance ace editor

## 0.2.6

### Patch Changes

- feat: optimize DecimalsSelect UI

## 0.2.5

### Patch Changes

- optimize DecimalsSelect UI

## 0.2.4

### Patch Changes

- fix: Popover support 'auto' placement

## 0.2.3

### Patch Changes

- feat: add DecimalsSelect

## 0.2.2

### Patch Changes

- optimize modal

## 0.2.1

### Patch Changes

- add github action for publish

## 0.2.0

### Minor Changes

- eb01671: add github action for publish
