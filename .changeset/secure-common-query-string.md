---
'@cfxjs/sirius-next-compat': minor
'@cfxjs/sirius-next-common': patch
---

Introduce the framework-independent compatibility package with a self-contained ES2017 queryString entry, stable owned types, and bundled query-string 9.3.1 / decode-uri-component 0.5.1. Preserve legacy URL merge, fragment, empty segment and plus decoding behavior, with malformed-input and artifact isolation checks.

Common now depends on compat and imports queryString directly from it. Declare address component public props explicitly so consumers using the supported react-i18next 11.3.4 peer retain JSX prop types without leaking newer HOC helper types.
