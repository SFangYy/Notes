---
Project:
  - UVM
description:
tags:
  - UVM
created: 2025-08-11 | 16:33
parent: Resource
---
# 001-Video
在一个sequence的body中,除了可以使用uvm_do宏产生transaction外,其实还可以启动其他的sequence,即一个sequence内启动另  外一个sequence

“嵌套sequence的前提是,在套里面的所有sequence产生的transaction都可以被同一个sequencer所接受。”