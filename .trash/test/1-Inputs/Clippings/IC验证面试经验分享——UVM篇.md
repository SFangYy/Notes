---
title: "IC验证面试经验分享——UVM篇"
source: "https://blog.csdn.net/m0_62972188/article/details/141304397?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7Ebaidujs_utm_term%7ECtr-2-141304397-blog-144509767.235%5Ev43%5Epc_blog_bottom_relevance_base6&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7Ebaidujs_utm_term%7ECtr-2-141304397-blog-144509767.235%5Ev43%5Epc_blog_bottom_relevance_base6&utm_relevant_index=5"
author:
  - "[[m0_62972188]]"
published: 2024-08-18
created: 2025-08-26
description: "文章浏览阅读5k次，点赞32次，收藏138次。本文主要分享一些IC验证面试中UVM相关的常问知识面经，希望能帮到你！_uvm"
tags:
  - "clippings"
---
> 验证最需要会的技能树是什么？！那肯定是非UVM莫属了，趁着校招之际，准备IC面试的ICer赶快码住！

---

## UVM篇

UVM是一个库，在这个库中，几乎所有的东西都是使用类（class）来实现的，当要实现一个功能时，首先应该想到的是从UVM的某个类派生出一个新的类，在这个新的类中实现所期望的功能。所以，使用UVM的第一条原则是：验证平台中所有的组件应该派生自UVM中的类。———摘自《 [UVM实战](https://so.csdn.net/so/search?q=UVM%E5%AE%9E%E6%88%98&spm=1001.2101.3001.7020) 》白皮书

UVM是 `基于SV语言` 开发的框架，这个是验证er的常识哦。

---

## 一、UVM验证平台组件

1. **driver**: 给dut添加各种激励，激励的实现就是通过driver；
2. **scoreboard**: 根据DUT的输出来判断DUT的行为是否与预期相符合，也被称为checker；
3. **monitor** ：收集接口信号并转换为事务转送给scb和refm；
4. **reference model**: 模拟dut的行为得到参考输出作为scb的评判标准。

此外，uvm中还引入了 agent ，sequencer的概念。

- agent：封装容器；
- sequencer：连接管道，串联driver和sequence，组织并管理sequence。  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ea5aec21c1e5417392ea94cebe469e3b.png)

## 二、UVM\_component和uvm\_object

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8616279ff0cb44fa8320159a7204c255.png)  
根据 [白皮书](https://so.csdn.net/so/search?q=%E7%99%BD%E7%9A%AE%E4%B9%A6&spm=1001.2101.3001.7020) ，uvm\_component其实是继承自uvm\_object，但是学过面向对象的都知道面向对象的三大特性之一就是多态，那么子类可能拥有一些父类没有的特性。 `uvm_component有两大特性` 是uvm\_object所没有的：

- 一是通过在new的时候指定parent参数来形成一种树形的组织结构；
- 二是有phase的自动执行特点。  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/629dbef6fcce45f4aca3b1c9dcef9c3e.png)

## 三、sequence启动方式

- 直接用my\_seq.start(sequencer);  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8e03d22ece43478e8d9c0b580407dbbe.png)
- 通过default sequence启动，有两种方式
	- `通过wrapper，直接调用start`  
		![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8f63e6782ebd4b3b89a003d271a57302.png)
	- `先实例化要启动的sequence，之后再通过default_sequence启动`  
		![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a401108fdbae46f48002bf4a2d0fb496.png)  
		**所以从上面也可以看到，uvm\_config\_db机制将sequence送到agen.sqr的main\_phase中** 。

## 四、seqence是怎么给到dut的？

这里先说sequence和sequencer的区别？

- 按照白皮书的比喻不难理解， `sqr是弹夹，sequence是子弹` ：
	- 只有在sequencer的帮助下，sequence产生出的transaction才能最终送给driver；同样，sequencer只有在sequence出现的情况下才能体现其价值，如果没有sequence，sequencer就几乎没有任何作用。sequence就像是一个弹夹，里面的子弹是transaction，而sequencer是一把枪。——摘自《UVM实战卷I》白皮书

因此，从sqr中获取transaction，按照dut的行为模块驱动transaction至interface，返回响应到sqr，再转给seq。

## 五、p\_sequencer和m\_sequencer的区别

### 1）含义

- `m_sequencer ` 是一个定义在用户构建的 sequence/sequence\_item 基类里的 sequencer 基类句柄，通过这种方式，建立起 sequence - sequencer 之间的连接，使 sequence 有通过 m\_sequencer 句柄来访问 sequencer 变量的能力。
- `p_sequencer` 是一个 uvm\_sequencer 类型 (通常情况) 的句柄，由用户在调用宏 \`uvm\_declare\_p\_sequencer(SEQUENCER) 时指定。

### 2）区别

- **m\_sequencer 的局限性** ：m\_sequencer 的存在建立了 sequencer-sequence 之间的桥梁，但是由于 m\_sequencer 句柄类型相较于实际用户构建的 sequencer 来说都是 `基于更底层的 uvm_sequencer_base 类型` 。虽然可以保证 m\_sequencer 句柄可以指向用户构建的 sequencer，但是 `m_sequencer 能访问到的变量和方法仍具有局限性` (**基类句柄指向扩展类对象，但只能访问扩展类中属于基类的变量和方法**)。
- **p\_sequencer的引入** ：基于以上问题，需要引入一个类型 `与用户构建的 sequencer 一致的扩展类句柄 p_sequencer` ，通过动态类型转化，让 p\_sequencer 与 m\_sequencer 都指向用户构建的 sequencer 对象，并且由于 p\_sequencer 是扩展类类型的句柄，可以通过 p\_sequencer 句柄，在 sequence 中访问到属于 sequencer 的内容。最终 m\_sequencer 与 p\_sequencer 指向对象都为用户构建的 sequencer， `只是可访问的范围不一致` 。

## 六、UVM\_do系列宏

### 1）uvm\_do和uvm\_do\_on的区别

uvm\_do\_on系列用于 `显式地指定使用哪个sequencer发送此transaction` ，第一个参数是transaction的指针，第二个参数是sequencer的指针。

### 2）系列宏的含义

```
//uvm_do
    uvm_do(seq or item)
    uvm_do_pri（seq or item,优先级数）一般默认的tr优先级是-1，所以数一般要更大      uvm_do_with(seq or item, 约束)
    uvm_do_pri_with(seq or item, 优先级数，约束)

    //uvm_do_on
    uvm_do_on（seq or item，seqr）
    uvm_do_on_pri（seq or item，seqr，优先级）
    uvm_do_on_with（seq or item，seqr，约束）
    uvm_do_on_pri_with（seq or item，seqr，优先级，约束）
12345678910
```

## 七、UVM phase机制

首先，uvm中分为两类phase，这些phase自上而下执行：

- `function phase` 不消耗仿真时间，
- `task phase` 消耗仿真时间（下图灰色部分）；  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c9441672ce5a4b7fbf2bc64cd6c503eb.png)

### 1）运行情况

#### function phase

对于function phase来说，，在 `同一时间只有一个phase在执行` ；

#### task phase

但是task phase中， `run_phase和pre_reset_phase等12个小的phase并行运行` ，称为动态运行；4个核心phase，这四个phase通常模拟DUT的正常工作方式：

- **reset\_phase** ：对DUT进行复位、初始化等操作；
- **configure\_phase** ：进行DUT的配置；
- **main\_phase** ：完成DUT的运行；
- **shutdown\_phase** ：做一些与DUT断电相关的操作。

### 2）main\_phase和run\_phase之间关系

包含关系，run\_phase中包含main\_phase，run\_phase和main\_phase都是task phase，是并行运行的。

### 3）执行顺序

Build phase `自顶向下` （因为要实例化，比如driver是agent的成员变量，必须先实例化agent才有driver，否则就报错）， 其他 function phase `自底向上` ，task phase `自顶向下` ，同时运行（类似run\_phase、main\_phase等task\_phase也都是按照自下而上的顺序执行的）

此外，对于component来说， `12个run-time的phase是顺序执行的` ，但是它们也仅仅是顺序执行，并不是说前面一个phase执行完就立即执行后一个phase。 **一般是等所有component的同一个phase执行完才会执行下一个phase，所以对于component来说会存在空白等待的时间，但是对于整个验证平台来说，是没有空白时间，是连续完成的** 。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7c4400eb02fe45d7a85f4efc722dd57b.png)

## 八、objection机制

`UVM通过objection机制来控制验证平台的关闭` 。

- 在每个phase中，UVM会检查是否有objection被提起（raise\_objection），如果有，那么等待这个objection被撤销（drop\_objection）后停止仿真，如果没有则马上结束当前phase。
- raise\_objection和drop\_objection要 `成双成对` 出现。raise\_objection必须放在main\_phase第一个消耗仿真时间的语句之前。
- 在UVM中，objection一般伴随着sequence，通常只在sequence出现的地方raise\_objection和drop\_objection，sequence产生transaction，产生tr发送完毕后就可以结束仿真了。

如果想执行一些耗费时间的代码，就要在此phase下的任意一个component中至少提起一次objection。值得一提的是，如果12个动态phase有objection提起，那么run\_phase根本不需要raise\_objection就可以自动执行。反过来则不行。

## 九、UVM factory机制

factory的重载是一大特点： `将父类的函数/任务定义为virtual，虚函数可以重载` ，重载的最大优势是使得一个子类的指针以父类的类型传递时，其表现出的行为依然是子类的行为。

### 1）super关键字

super关键字，父类成员被重载，那么再访问就必须用super。

**super.new()**

- 在new中使用super，super.new是执行的第一条语句。
- 在uvm中，super.new()是一个特殊的构造函数，它用于在子类构造函数中调用父类的构造函数，这是因为在uvm中，一般情况下他们都是继承来扩展已有的类，当我们在子类中创建对象时，需要先调用父类的构造函数，以 `初始化父类的成员变量和方法` ；
- 因此，super.new()的作用就是确保在子类构造函数中先调用父类的构造函数，以便完成父类的初始化工作，需要注意的时， `super.new()必须放在子类构造函数的第一行` ，否则会出现编译错误。
- 此外， `如果父类的构造函数需要参数，也需要传递参数的` 。

**super.phase()**

- super.phase其实就是继承在uvm\_compoent中已经定义好的变量/方法，建议有的可以写有的可不写,但是个人建议写上去，以免后续uvm库有更新，自己还要更改代码风格。

### 2）使用factory机制的重载的前提

1. 第一，无论是重载的类（parrot）还是被重载的类（bird），都要在定义时 `注册` 到factory机制中。
2. 第二，被重载的类（bird）在实例化时，要使用factory机制式的实例化方式（ `create创建对象`)，而不能使用传统的new方式。
3. 第三，最重要的是， `重载的类（parrot）要与被重载的类（bird）有派生关系` 。重载的类必须派生自被重载的类，被重载的类必须是重载类的父类。
4. 第四， `component与object之间互相不能重载` 。虽然uvm\_component是派生自uvm\_object，但是这两者的血缘关系太远了，远到根本不能重载。从两者的new参数的函数就可以看出来，二者互相重载时，多出来的一个parent参数会使factory机制无所适从。

---

## 总结

以上就是面试过程中被问的比较多的一些问题，也算是IC验证的必背八股文了吧，创作不易，都是博主精心整理的笔记，如有问题或者错误欢迎大家指正，一起学习！

实付 元

[使用余额支付](https://blog.csdn.net/m0_62972188/article/details/)

点击重新获取

扫码支付

钱包余额 0

抵扣说明：

1.余额是钱包充值的虚拟货币，按照1:1的比例进行支付金额的抵扣。  
2.余额无法直接购买下载，可以购买VIP、付费专栏及课程。

[余额充值](https://i.csdn.net/#/wallet/balance/recharge)

举报

[AI 搜索](https://ai.csdn.net/?utm_source=cknow_pc_blog_right_hover) [智能体](https://ai.csdn.net/cmd?utm_source=cknow_pc_blog_right_hover) [AI 编程](https://ai.csdn.net/coding?utm_source=cknow_pc_blog_right_hover) [AI 作业助手](https://ai.csdn.net/homework?utm_source=cknow_pc_blog_right_hover)

隐藏侧栏 ![程序员都在用的中文IT技术交流社区](https://g.csdnimg.cn/side-toolbar/3.6/images/qr_app.png)

程序员都在用的中文IT技术交流社区

![专业的中文 IT 技术社区，与千万技术人共成长](https://g.csdnimg.cn/side-toolbar/3.6/images/qr_wechat.png)

专业的中文 IT 技术社区，与千万技术人共成长

![关注【CSDN】视频号，行业资讯、技术分享精彩不断，直播好礼送不停！](https://g.csdnimg.cn/side-toolbar/3.6/images/qr_video.png)

关注【CSDN】视频号，行业资讯、技术分享精彩不断，直播好礼送不停！

客服 返回顶部

![](https://i-blog.csdnimg.cn/direct/ea5aec21c1e5417392ea94cebe469e3b.png) ![](https://i-blog.csdnimg.cn/direct/8616279ff0cb44fa8320159a7204c255.png) ![](https://i-blog.csdnimg.cn/direct/629dbef6fcce45f4aca3b1c9dcef9c3e.png) ![](https://i-blog.csdnimg.cn/direct/8e03d22ece43478e8d9c0b580407dbbe.png) ![](https://i-blog.csdnimg.cn/direct/8f63e6782ebd4b3b89a003d271a57302.png) ![](https://i-blog.csdnimg.cn/direct/a401108fdbae46f48002bf4a2d0fb496.png) ![](https://i-blog.csdnimg.cn/direct/c9441672ce5a4b7fbf2bc64cd6c503eb.png) ![](https://i-blog.csdnimg.cn/direct/7c4400eb02fe45d7a85f4efc722dd57b.png)