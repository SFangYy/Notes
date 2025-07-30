---
Project: ["Formal"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-09 | 15:34
parent: Resource
branch: 
---
# Resources
## 1.1 概述
断言是**设计的属性的描述**，主要用于验证设计的行为。此外，断言可以用来提供功能覆盖，并标记输入激励，用于验证不符合假设的要求。
-  如果一个在模拟中被检查的属性不像我们期望的那样表现，那么这个断言失败。
- 如果一个被禁止在设计中出现的属性在模拟过程中发生，那么这个断言失败。

## 1.2 SVA简介
断言作为声明被执行的验证函数的断言语句出现。
### 1.2.1 断言语句的类型
- `assert`: 它是一种描述，*期望*你的设计的某些属性*一直为真*。
- `assume`: 将*属性指定为环境的一个假设*，当形式化工具使用信息生成输入激励时，仿真软件*检查属性*是否保持。是对验证环境的约束，**意味着是条件，这些条件在环境中永远为真**。
- `cover`: 监测属性计算的*覆盖范围*，覆盖点被期望偶尔是对的。
-  `restrict`: 指定该属性作为形式化验证计算的约束。仿真软件不检查属性。

- assert、assumption和cover point的关系：
	- 在递进式的验证过程中它们的关系是可以相互转换的，例如顶层模块的asserts就是底层模块的assumptions。
### 1.2.2 断言的种类
断言有两种：并发断言和即时断言。
1. 即时断言（immediate assertions）：基于模拟事件的语义。
    测试表达式的求值就像在过程块中的其他Verilog的表达式一样。
    它们本质不是时序相关的，而且立即被求值。
    必须放在过程块的定义中。
    只能用于动态模拟。

当语句在过程块中被执行时，
- 即时断言语句是对**被执行表达式的测试**。该表达式是非时态的，
- 可以理解为与程序中**if语句的条件下的表达式相同**。换句话说，如果表达式计算结果是*X、Z或0*，那么它被解释为错误，断言语句被认为失败。否则，表达式将被解释为真，断言语句被认为通过，或者等效地，成功。

一个即时断言例子如下：
```
    always_comb
    begin
      a_ia: assert (a && b);  //当信号a或信号b发生变化时，always块被执行
	  
    end
```

- 并发断言（concurrent assertions）：
```

```
    基于时钟语义。
    在时钟边缘根据调用的变量的采样值计算测试表达式。
    变量的采样在预备阶段完成，而表达式的计算在调度器的观察阶段完成。
    可以被放到过程块（procedural block）、模块（module）、接口（interface），或者一个程序（program）的定义中。
    可以在静态（形式的）验证和动态验证（模拟）工具中使用。

a_cc: assert property(@(posedge clk) not(a && b));

SystemVerilog断言的目标之一是为*断言提供一个通用语义*， 以便它们可以用于驱动各种设计和验证工具。例如形式化验证工具，
- 使用基于周期的语义来计算电路描述，通常依赖于一个或多个时钟信号来驱动电路的计算。
- 任何时钟边沿之间的计时或事件行为都被提取出来。并发断言包含这个时钟语义。虽然这种方法通常简化了电路描述的计算，但在许多场景中，这种基于周期的计算提供了不同于SystemVerilog基于事件计算标准的行为。

- 在形式化验证中，一般只采用并发断言，因此以下内容只介绍并发断言。

### 1.3 SVA组成
- 一条SVA并发断言可以看成是由四种不同层次的结构组成：
	- 布尔表达式（booleans）
	- 序列（sequence）
	- 属性（property）
	- 断言声明（assertion statements）

**布尔表达式是构成SVA的最基本单元**。
- 其一般形式为标准的SystemVerilog的布尔表达式，它由信号及其逻辑关系运算符构成，用以表示某个逻辑事件的发生。
- 在任何设计模型中，*功能总是由多个逻辑事件的组合来表示的*。
- 这些事件可以是简单的同一个时钟边缘被求值的布尔表达式，或者是经过几个时钟周期的求值的事件。

**序列是布尔表达式在时间上的组合**

- SVA用关键词“sequence”来表示这些事件。序列（sequence）的基本语法是:
```
sequence name_of_sequence;
      <test expression>;
endsequence

  
例：

    sequence s1
      @(posedge clk) a;
    endsequence
```

- 序列s1检查信号“a”在每个时钟上升沿都为高电平。如果信号“a”在任何一个时钟上升沿不为高电平，断言将失败。这相当于“a==1'b1”。

- 属性是在仿真或者形式验证中被验证的单元。属性将序列通过逻辑或者有序地组合起来生成更复杂的序列，SVA提供关键词“property”来表达这些复杂的有序行为。

**在属性中，可以使用“|->”、“|=>”来表达不同序列间的逻辑关系。**
```
    property name_of_property;
      <test expression>;or
      <complex sequence expressions>;
    endproperty
```


属性要在断言声明中被调用才能发挥作用，否则它们会被编译器忽略掉。
断言的声明由下面任一一种关键字进行：assert，assume，cover。
```
assertion_name: assert property (property_name);
```

### 1.4 SVA形式

写法一：
```
    sequence s2;
      @(posedge clk) a ##2 b;  //a为高电平，2个时钟周期之后b为高电平
    endsequence
    property p2;
      not s2;
    endproperty
    ast_2:assert property(p2)

```

写法二：（在序列、属性、断言语句中都可以定义时钟）
```
    sequence s2;
      a ##2 b; 
    endsequence
    property p2;
      @(posedge clk) not s2;
    endproperty
    ast_2:assert property(p2)

```

写法三：
```
    property p2;
      @(posedge clk) not(a ##2 b);
    endproperty
    ast_2:assert property(p2)

```

写法四：（常用）
```
    ast_2: assert property(
    @(posedge clk) not(a ##2 b));

```

### 1.5 SVA与设计连接

有两种方法可以将SVA检验器连接到设计中。

- 在模块定义中内建或者内联检验器。
- 将检验器与模块、模块的实例或者一个模块的多个实例绑定。

1. **在一个.v文件的设计中插入断言的位置：**
```
    module ABC();
      rtl 代码
      SVA 断言
    endmodule

```

2. 如果用户决定将SVA检验器与设计代码分离，
	- 那么就需要建立一个独立的检验器模块。定义独立的检验器模块，增强了检验器的可重用性。
	- 定义检验器模块时，它是一个独立的实体。检验器用来检验一组通用的信号，检验器可以与设计中任何的模块（module）或者实例（instance）绑定（bind）。

```
    module chk(
    input clk,    //所有在test module中用到的信号全部来自dut且都是作为test module的input
    input a,
    input b);
    //或module chk(input a,b,clk);  
    ast_2: assert property(
    @(posedge clk) a ##2 b);
    endmodule

```
使用bind语句：
```
bind <module_name or instance_name> <checker_name> <checker_instance_name> <design_signals>;
```

- bind声明可以将设计代码和验证代码分在不同的文件中，保证了在不接触设计代码的情况下，完成进行验证任务。
- bind的本质上是在一个模块中将另一个模块例化，比如在文件A中定义了顶层模块的设计代码，在文件B中定义了模块chk，里面有关于验证顶层模块的SVA断言，那么在文件B中可以使用bind声明：
```
bind top chk chk_inst(a,b,clk);      //bind SVA module to top
```

与检验器绑定的设计信号可以包含绑定实例中的任何信号的跨模块引用。

1.6 SVA语法
1.6.1 运算符、操作符

SVA是SystemVerilog的一个子集，所以SVA中所有的运算符都符合SystemVerilog的标准，例如：

- 算术运算符：+ - * / %
- 关系运算符：> < >= <= == !=
- 逻辑运算符：! && ||
- 位运算符：~ & | ^
- 移位运算符：>> <<

1.6.2 常用系统函数
- $rose(boolean expression or signal_name)
	- 当信号/表达式由上一个时钟周期的‘0’变成当前周期的‘1’时返回真。
- $fell(boolean expression or signal_name)
	- 当信号/表达式由上一个时钟周期的‘1’变成当前周期的‘0’返回真。
- $stable(boolean expression or signal_name)
	- 当信号/表达式的值和上一个时钟周期相同返回真。
- $changed(boolean expression or signal_name)
	- 当信号/表达式的值改变返回真。（=== ~$stable()）
- $past(signal_name，number of clock cycles)
	- 可以得到信号在几个时钟周期之前的值。在默认情况下，它提供信号在前一个时钟周期的值。
- $isunknown(expression)
	- 检验表达式的任何位是否是X或者Z。
- $onehot(expression)
	- 在任意给定的时钟沿，表达式只有一位为高。
- safe_gnts = $onehot(gnt)
$onehot0(expression)

- 在任意给定的时钟沿，表达式只有一位为高或者没有任何位为高。
- safe_or_no_gnts = $onehot0(gnt)
- $countones(expression)
- 计数等于1的位。

num_gnts = $countones(gnt)

    $countbits(expression, val1, val2,...)

计数指定位的出现次数。

    num_gnts = $countbits(gnt, 1'b1)

    expression inside list

当且仅当表达式在列表中返回真。

safe_opcode = opcode inside {ADD,SUB,MUL}

1.6.3 在“时序逻辑”中判断多个序列/信号的行为关系

（1）表示序列间的关系：

    s1 and s2 当两个序列都成功时整个属性才成功。两个序列必须具有相同的起始点，但是可以有不同的结束点。检验的起始点是第一个序列的成功时的起始点，而检验的结束点是使得属性最终成功的另一个序列成功时的点。
    s1 or s2 只要其中一个序列成功，整个属性就成功。
    s1 intersect s2 断定两个序列在相同时刻开始，且结束于同一时刻。（两个序列的长度必须相等）
    s1 within s2 表示在s2的整个序列内出现过s1。
    s1 throughout s2 表示在s2整个序列内，s1一直成立。（蕴含只在时钟边沿检验前提条件一次，然后就开始检验后续算子部分，因此它不检测先行算子是否一直保持为真。为了保证某些条件在整个序列的验证过程中一直为真，可以使用“throughout”运算符。）

（2）延迟的用法：

    a ##2 b 断定a事件发生后2个单位时间内b事件一定会发生。
    a ##[1:3] b 断定a事件发生后1~3个单位时间内b事件一定会发生。
    a ##[1:$] b $表示无穷大。断定a事件发生后b事件一定会发生。

（3）重复运算符：

    连续重复运算符：

a[*n]：信号a在连续n个时钟周期内都成立。

a[*n:m]：表示a连续出现n到m次，这里n,m为常数。

    跟随重复运算符：

a[->3] a连续或间断地出现3次为高，在最后一个a结束的时间点。

    非连续重复运算符：

a[=3]表示在信号a出现了3次之后的任意时间点。

非连续重复与跟随重复相似，除了它并不要求信号的最后一次重复匹配发生在整个序列匹配前的那个时钟周期。

（4）蕴含操作符：

蕴含等效于一个if-then结构。蕴含的左边叫作“先行算子”（antecedent），右边叫作“后续算子”（consequent）。先行算子是约束条件。当先行算子成功时，后续算子才会被计算。如果先行算子不成功，那么整个属性就默认地被认为成功。这叫作“空成功”（vacuous success）。蕴含结构只能被用在属性定义中，不能在序列中使用。

蕴含可以分为两类：交叠蕴含（Overlapped implication）和非交叠蕴含（Non-overlapped implication）。

    交叠蕴含：

|->: s1 |-> s2 表示s1为真的同一时刻，s2必须为真，s1为假的时候，s2可真可假。

相当于：

    if a
      b;
    else
      succeed;

    非交叠蕴含：

|=>: s1 |=> s2 表示在s1为真的下一个时钟周期s2必须为真，s1为假的下一个时钟周期，s2可真可假。

等价于：s1 |-> ##1 s2

1.6.4“disable iff”构造

在某些设计情况中，如果一些条件为真，则我们不想执行检验。换句话说，这就像是一个异步的复位，使得检验在当前时刻不工作。SVA提供了关键词“disable iff”来实现这种检验器的异步复位。

“disable iff”的基本语法如下：

disable iff(expression)<property definition0>

1.7 简单SVA举例

FIFO的验证：

1.检查FIFO满时不再写：

    check_enqueue_no_wr: assert property (@posedge clk) disable iff(!rst_n) 
    full |-> !wr);

2.检查FIFO空时不再读：

    check_dequeue_no_rd: assert property (@posedge clk) disable iff(!rst_n) 
    empty |-> !rd);

1.8 实用技巧

（不知道实践中会不会用到，先翻译了一下）

    使用并发断言而不是即时断言，除非是在一个真正的未锁定的环境中，比如一个函数，或者正在专门编写假设来帮助状态匹配FEV工具。
    如果必须使用一个即时断言，通过使用assert final使它成为一个延迟的即时断言，或者如果你的工具还不支持p1800-2012标准，使用assert #0。
    在需要使用即时断言的情况下，将其放在计算其关键值的程序或函数的末尾。
    并发断言最好放在过程代码之外（也就是说，在always块之外），以避免对检查哪些值产生混淆。
    如果在一些EDA工具中并发断言失败时间的报告似乎比导致失败的值晚一个周期，不要担心。这是SVA抽样定义的结果。
    仔细考虑断言的合适时钟，如果适用的话，确保包含posedge或negedge限定符。
    在SVA断言的复位（disable iff）中，只使用实际的复位：信号全局关闭模型的主要部分很长一段周期。由于异步行为，在复位项中使用杂项逻辑可能会导致混乱的结果。
    当你编写许多使用相同时钟和复位的断言语句时，请确保使用默认时钟和默认disable iff语句来声明一次时钟和复位，而不是将它们包含在每个单独的断言中。
    使用触发属性（|->，|=>）在可能的情况下优先于其他形式的属性。这使得许多EDA工具能够提供专门的可视化和debug特性。
    如果你在任何断言语句中包含了大量的逻辑，考虑定义命名序列和属性以使代码更清晰、更模块化。
    在规范/需求阶段开始考虑潜在的断言，并在RTL开发之前在创建的文档中标记潜在的断言。
    当你在开发RTL时，无论何时你准备写一个关于期望值或信号行为的注解，考虑它是否可以被声明为一个SVA断言。如果是这样，请编写断言，将其视为一个可执行的注解，以便更好地长期执行你的预期。
    当你在开发RTL时，无论何时你要写关于需要完成的测试类型的注解，考虑它是否可以被表述为SVA覆盖语句。如果是这样，那么编写覆盖语句，将其视为一个可执行的注解，以便更好地长期执行你的预期。
    编写嵌入式SVA语句时，使用断言而不是假设。如果一个语句确实需要作为一个假设，那么之后可以在你的形式化验证工具中动态更改它。
    为了进行验证，根据你的规范编写高级的“end-to-end”断言，说明输出将如何根据输入表现。
    在根据你的规范编写高级断言时，一定要在适当的时候添加建模代码。然而，也要注意仿真分析报告，以发现复杂建模开始具有明显的仿真成本的情况，并考虑限制此类建模和相关断言仅用于FPV。
    在编写end to end断言进行验证时，可以编写模拟设计中某些计算的工具代码。如果这样做，我们建议将验证代码保存在一个单独的文件中，并在所有形式验证对象之前使用一些命名约定，比如fv_前缀，以避免真正的设计和工具逻辑之间的混淆。
    当你写基于规范的验证断言时，也要考虑高层未声明的安全条件，这些条件可能是设计意图的隐式部分。
    如果你想在不修改原始RTL代码的情况下添加验证断言，可以利用SystemVerilog的bind语句。