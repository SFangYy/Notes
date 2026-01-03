---
Project:
  - Formal
title:
description:
source:
author:
tags:
  - formal
  - riscv
created: 2025-06-11 | 09:17
parent: Resource
branch:
cssclasses:
  - show-property
---
## 分支预测
*分支预测单元采用一种多级混合预测的架构，其主要组成部分包括*
- [下一行预测器](https://docs.xiangshan.cc/zh-cn/latest/frontend/bp/#nlp)（Next Line Predictor，以下简称 NLP）和
	- FTB
	- TageSc
	- iTTage
	- RAS
- [精确预测器](https://docs.xiangshan.cc/zh-cn/latest/frontend/bp/#apd)（Accurate Predictor，以下简称 APD, 在预测请求的下一拍就可以得到预测结果,组成为[uBTB](https://docs.xiangshan.cc/zh-cn/latest/frontend/bp/#ubtb) (micro BTB)

# BPU
BPU 的各个流水级都会连接 [[FTQ]]，一旦第**一个预测流水级存在**有效预测结果，或者**后续预测流水级产生不同**的预测结果，和 [[FTQ]] 的握手信号有效位都会置高
