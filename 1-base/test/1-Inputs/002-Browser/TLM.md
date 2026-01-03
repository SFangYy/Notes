---
Project:
  - UVM
description:
tags:
  - UVM
created: 2025-06-30 | 20:01
parent: Resource
---
# Resources
TLM often has two orient function like put get
- put A send transaction to B
- get A ask a transaction from B 
in up function A both is initial and B is object
- transaction: A put tr to B first and then A get tr from B

only initial can connect object