---
Project:
  - UVM
title:
description:
source:
author:
tags:
  - UVM
created: 2025-08-11 | 15:35
parent: Resource
branch:
---
# 001-Video
“与lock操作一样,grab操作也用于暂时拥有sequencer的所有权,只是grab操作比lock操作优先级更高。lock请求是被插入 sequencer仲裁队列的最后面” ([pdf](zotero://open-pdf/library/items/BH7DPRKX?page=403&annotation=SQVRK7NY))

“grab请求则被放入sequencer仲裁队列的最前面,它几 乎是一发出就拥有了sequencer的所有权” ([pdf](zotero://open-pdf/library/items/BH7DPRKX?page=403&annotation=6DH43NCT))


“这样带来的一个最大的问题就是gen_pkt函数的重复定义,显然这样是不允许的。

为了避免重复定义,有两种策略:
- 第一种是 使用虚函数。将代码清单6-3中的gen_pkt定义为virtual类型,然后在建造CRC错误的测试用例时,从my_driver派生一个新的 crc_err_driver,并重载gen_pkt函数。但是这样新的问题又出现了,如何在这个测试用例中实例化这个新的driver呢?似乎只能重新 定义一个my_agent”
- 第二种解决方  式是使定义的函数的名字是不一样的但是在driver的main_phase中又无法执行这种具有不同名字的函数

为此，UVM引入sequence机制，
使用sequence机制之后,在不同的测试用例中,将不同的sequence设置  成sequencer的main_phase的default_sequence。当sequencer执行到main_phase时,发现有default_sequence,那么它就启动sequence

## two ways to start seq 


“当一个sequence启动后会自动执行sequence的body任务”

## 仲裁机制
“当使用uvm_do或者uvm_do_with宏时,产生的transaction的优先级是默认的 优先级,即-1。可以通过uvm_do_pri及uvm_do_pri_with改变所产生的transaction的优先级”

transaction

sequence 

## 宏
```
uvm_do

uvm_do_pri 

uvm_do_with

uvm_do_pri_with

uvm_do_on 

uvm_do_on_pri

uvm_do_on_with 

uvm_do_on_pri_with 

```
uvm_do_on 调用哪个sequencer来发送tr 

```
`uvm_do_on(tr, this.m_sequencer)
```

扩展`uvm_do 

```
pre_do 

mid_do

post_do

```
- pre_do是一个任务,在start_item中被调用,它是start_item返回前执行的最后一行代码,在它执行完毕后才对transaction进行随机化。
- mid_do是一个函数,位于finish_item的最开始。在执行完此函数后,finish_item才进行其他操作。
- post_do也是一个函数,也  位于finish_item中,它是finish_item返回前执行的最后一行代码。它们的执行顺序大致为