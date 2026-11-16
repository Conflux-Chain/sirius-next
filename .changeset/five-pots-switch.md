---
'@cfxjs/sirius-next-common': minor
---

Require Node.js 22 and upgrade query-string to 10.0.0 to remove GHSA-qr28-fpjm-wq7f; replace react-utils with the internal click-away hook.

Breaking changes: invalid UTF-8 query bytes now decode to U+FFFD, and unsupported
query values such as objects and Date instances throw TypeError instead of being
implicitly stringified. Format these values explicitly before passing them to
common request helpers. Dropdown and Tooltip preserve their existing document
click, multi-ref, and portal behavior without pulling in WalletConnect.
