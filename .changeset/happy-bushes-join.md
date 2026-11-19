---
'@cfxjs/sirius-next-common': patch
---

Match Google Analytics targets only for confluxscan.org, confluxnetwork.org,
and their dot-delimited subdomains. Unrelated hosts containing either domain
name now use the development target. The confluxscan.org family uses the
production target (including testnet.confluxscan.org), and the
confluxnetwork.org family uses the test target.
