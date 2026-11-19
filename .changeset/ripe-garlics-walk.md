---
'@cfxjs/sirius-next-common': minor
---

Remove the unused CookieTip component, its CookieIcon, and the cookie utility,
including the incomplete regular expression escaping reported by CodeQL.

The `dist/components/CookieTip/index`, `dist/components/CookieTip/CookieIcon`,
and `dist/utils/cookie` entry points are no longer available. Consumers must
remove any remaining imports before upgrading. The current Core Space and
eSpace scan sources have no active imports of these modules.
