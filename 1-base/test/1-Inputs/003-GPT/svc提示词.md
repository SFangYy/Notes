---
Project:
title: 
description: 
source: 
author: 
tags: 
created: 2025-08-19 | 16:29
parent: Resource
branch: 
---
# 003-GPT

## 提示词

你是一位非常优秀的软硬件开发工程师，你现在需要开发一个sv和c++通信的项目，具体的需求在function_need 下面，请你阅读function_need/1-overview和function_need/2-message文档，并实现该项目 ，若该项目运行报错，请尝试修复

## function need

```
// 1-overview

你是一个芯片验证领域使用vcs进行c++和systemverilog联合仿真的专家，我想实现一个类似Protocol Buffer和TLM结合起来的项目，来实现sv和c++的双向通信
请你参考后续的文档如2-message.md 帮我生成这个项目
目前优先实现通信部分生产者消费者的功能，可以先不考虑protocol buffer即解析消息，进行文件生成的功能，请你帮我实现这个项目，并运行，若报错，请你修改 

```

```
//2-message

请你结合UVM中TLM的用法，实现sv和c++的通信，要求具有如下功能，
1. 需要在sv和c侧分别创建生产者和消费者，
2. 生产者和消费者需要进行连接，只有互相连接上的生产者和消费者可以发送数据
3. 生产者中有一个push方法可以发送消息，通过回调函数调用消费者的get方法处理消息，
```
