---
'@cfxjs/sirius-next-common': patch
---

Require lodash ^4.18.1 and refresh lodash-es to 4.18.1 in the workspace lockfile
to address template imports code injection and prototype property deletion.
Scan consumers must also refresh their transitive lodash-es resolution.
