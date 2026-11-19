---
'@cfxjs/sirius-next-common': patch
---

Fix exponential regular expression backtracking in validURL when checking long
invalid domains, while preserving the existing accepted URL syntax.
