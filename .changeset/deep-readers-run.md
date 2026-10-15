---
'@cfxjs/sirius-next-common': minor
'@cfxjs/sirius-next-i18n': patch
---

Support access and signed authorization lists in EVM simulation and gas estimation, Core access-list and legacy/EIP-1559 fee estimation, and translated URL validation errors.

Use viem’s high-level EVM gas estimator for access lists, fees, and block context; reserve direct RPC requests for exact authorization-list quantities.

Support Core gas estimation epoch tags and hex epoch numbers, mapping epoch zero to earliest and rejecting unsupported tags before RPC submission.
