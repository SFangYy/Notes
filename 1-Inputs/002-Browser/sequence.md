---
Project: ["UVM"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-06 | 19:56
parent: Resource
branch: 
---
# Resources
“与lock操作一样,grab操作也用于暂时拥有sequencer的所有权,只是grab操作比lock操作优先级更高。lock请求是被插入 sequencer仲裁队列的最后面” ([pdf](zotero://open-pdf/library/items/BH7DPRKX?page=403&annotation=SQVRK7NY))

“grab请求则被放入sequencer仲裁队列的最前面,它几 乎是一发出就拥有了sequencer的所有权” ([pdf](zotero://open-pdf/library/items/BH7DPRKX?page=403&annotation=6DH43NCT))