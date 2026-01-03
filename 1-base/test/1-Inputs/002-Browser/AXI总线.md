---
Project:
  - 面试
description:
tags:
  - 面试
created: 2025-08-12 | 20:22
parent: Resource
url: https://blog.csdn.net/shu_ben/article/details/147965213
---
# 002-Browser
3、AXI4的工作模式

AXI4和AXI4 Lite都包含五个不同的通道：

（1）读地址通道（AR channel）：包含ARVALID，ARADDR，ARREADY信号；
（2）读数据通道（R channel）：包含RVALID， RDATA，RREADY，RRESP信号；
（3）写地址通道（AW channel）：包含AWVALID，AWADDR，AWREADY信号；
（4）写数据通道（W channel）：包含WVALID，WDATA，WSTRB， WREADY信号；
（5）写应答通道（B channel）：包含BVALID，BRESP，BREADY信号；

事务（Transaction）

在AXI4协议中，事务定义为一次完整的读或写操作流程。这一过程涵盖了地址信息的传递、控制信号的交换以及可能的数据传输。
   - 组成结构：单个事务可由一个或多个数据传输（transfer）构成。例如，在执行读取操作时，事务通常会包含至少一次地址信息的发送及随后的一个或多个数据包接收；而对于写入操作，则除了地址与数据的传送外，还需完成写确认信号的返回。
   - 传输模式：根据具体需求，事务既可以设计为单一传输形式，也可以配置为突发（burst）模式下的多地址连续访问。其中，突发传输机制允许在发起的一次请求下对一系列相邻存储单元进行高效的数据交互。

突发传输（Burst）
- 一次突发传输中可以包含一至多个数据（Transfer）
