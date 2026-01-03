---
Project:
  - UVM
title: 
description: 
source: 
author: 
tags:
  - UVM
created: 2025-08-11 | 19:34
parent: Resource
branch:
---
# 001-Video
“esponse机制的原理是driver将rsp推送给sequencer,而sequencer内部维持一个队列,当有新的response进入时,就推入此队 列”

“当在sequence中启动get_response时,进程就会阻塞在那里,一直到 response_queue中被放入新的记录”

“发生上述情况的主要原因为sequence中发送transaction与get_response是在同一个进程中执行的,假如将二者分离开来,在不同 的进程中运行将会得到不同的结果。在这种情况下需要使用**response_handler**”