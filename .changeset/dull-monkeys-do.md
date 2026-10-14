---
'@cfxjs/sirius-next-common': patch
---

Support maxPriorityFeePerGas in simulation parameters. When a priority fee is
provided without a fee cap or legacy gas price, use the larger of
22 Gdrip and the priority fee as the fallback cap for simulation.
