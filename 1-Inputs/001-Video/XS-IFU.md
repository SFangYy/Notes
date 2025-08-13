---
Project:
title: 
description: 
source: 
author: 
tags: 
created: 2025-08-13 | 15:30
parent: Resource
branch: 
---
# 001-Video

## mmio状态机
- 在chisel中，状态机的定义形式如下：
`val m_idle :: m_waitLastCmt :: m_sendReq :: m_waitResp :: m_sendTLB :: m_tlbResp :: m_sendPMP :: m_resendReq :: m_waitResendResp :: m_waitCommit :: m_commited :: Nil = Enum(11)`

| 状态变量               | 值    | 二进制表示 (4位) |
| ------------------ | ---- | ---------- |
| `m_idle`           | 0.U  | 0000       |
| `m_waitLastCmt`    | 1.U  | 0001       |
| `m_sendReq`        | 2.U  | 0010       |
| `m_waitResp`       | 3.U  | 0011       |
| `m_sendTLB`        | 4.U  | 0100       |
| `m_tlbResp`        | 5.U  | 0101       |
| `m_sendPMP`        | 6.U  | 0110       |
| `m_resendReq`      | 7.U  | 0111       |
| `m_waitResendResp` | 8.U  | 1000       |
| `m_waitCommit`     | 9.U  | 1001       |
| `m_commited`       | 10.U | 1010       |