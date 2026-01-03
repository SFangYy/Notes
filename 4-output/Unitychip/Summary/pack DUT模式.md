---
Project: ["XSPdb"]
Status: Ongoing
---
# 需求

  

# Picker Pack 功能增强任务说明

  

## 1. 背景与目标 (Background & Objective)

**当前状态**:

目前的 `picker pack` 命令可以解析 UVM transaction (`sequence_item`) 文件，并生成对应的 UVM Agent (SystemVerilog) 和 Python 类 (`Agent`)。

- Python 端的 `Agent` 类实现了类似 TLM (Transaction Level Modeling) 的通信功能。

- 用户需要手动实例化 `Agent`，创建 transaction 对象，赋值，然后调用 `send` 方法发送，并需手动管理驱动流程。

  

**目标**:

在现有功能基础上，增加生成一个更顶层的 Python 抽象类 (通常命名为 `DUT` 或类似)，将基于 Transaction 的通信封装为基于“引脚” (Pin) 和“步进” (Step) 的交互模式。

这使得 Python 端的测试代码看起来更像是在直接操作一个硬件 DUT 的引脚，而不是在处理复杂的 UVM 事务对象。

  

## 2. 详细需求 (Detailed Requirements)

  

### 2.1 新增生成文件

- 在执行 `picker pack` 时，除了现有的 `agent.py` 等文件外，需额外生成一个 `dut.py` (或在现有文件中增加该类)。

- **参考范例**:

- `template/python/dut_real.py`: 作为最终生成的 Python 类接口风格和结构的主要参考（特别是 `Step` 方法、`__init__` 结构、信号属性访问方式）。需注意 `dut_real.py` 是基于 `DutUnifiedBase` 的直接信号驱动，而本次任务是基于 UVM Agent 的 Transaction 驱动，底层实现不同但对外接口应尽量保持一致体验。

- `template/python/dut.py`: 现有的 Python 模板文件参考。

- **SystemVerilog 修改**: 如果为了支持此功能需要修改生成的 SV 代码（例如 UVM Agent 侧的逻辑），也是允许的。

  

### 2.2 DUT 类封装逻辑

生成的 `DUT` 类需包含以下特性：

  

1. **组合/代理模式**: `DUT` 类内部应实例化或持有原有的 `Agent` 对象 (即 `picker pack` 现有的输出产物)。

2. **属性映射 (Pin Mapping)**:

- 将 Transaction 中的字段 (如 `a`, `b`) 映射为 `DUT` 类的属性 (Properties/Attributes)。

- **统一属性 (Unified Property)**: 目前不强制区分 Input/Output 方向，统一封装为属性。

- **Set (写)**: 当用户给 `dut.a = 1` 赋值时，不应立即发送 transaction，而是暂存该状态，或者准备好待发送的数据。

- **Get (读)**: 当用户读取 `dut.a` 时，应返回当前从 UVM 环境同步回来的值 (monitor 监测到的值)，反映当前仿真时间点的状态。

3. **Step(n) 方法**:

- **语义**: `Step(n)` 表示仿真时间向前推进 `n` 个单位（通常默认为时钟周期）。

- **参数**: 接受一个整数参数 `n` (默认值为 1)，表示步进的周期数。

- **发送逻辑**: 在调用 `Step` 时，如果之前的属性（引脚）被赋予了新值，应将这些值打包成 transaction 并通过 `Agent.send()` 发送到 UVM 环境。

- **驱动与同步**: 驱动底层 UVM 环境运行 `n` 个周期。

- **状态更新**: 步进完成后，`DUT` 实例的属性（如 `dut.a`, `dut.b`）应自动更新为当前时刻 UVM 环境中的数值（基于 monitor 接收到的 transaction）。

  

### 3. 输入与输出示例 (Input & Output Examples)

  

#### 3.1 输入 (SystemVerilog Transaction)

假设文件 `adder_trans.sv`:

```systemverilog

class adder_trans extends uvm_sequence_item;

rand bit [7:0] a;

rand bit [7:0] b;

// potentially output fields as well

endclass

```

  

#### 3.2 期望生成的 Python 代码结构 (伪代码)

生成的 Python 类应支持如下逻辑：

  

```python

class DUT:

def __init__(self, agent_name="adder_trans", *args, **kwargs):

self.agent = Agent(agent_name) # 原有的 Agent 类

self._current_trans = adder_trans() # 内部维护的一个 transaction 对象

# ... 初始化逻辑 ...

  

@property

def a(self):

# 返回当前仿真时刻的值 (monitor 更新后的值)

return self._current_trans.a.value

  

@a.setter

def a(self, value):

# 更新待发送的 transaction 值

self._current_trans.a.value = value

# 标记数据变更，待 Step 时处理

  

# ... 其他字段同理 ...

  

def Step(self, cycles=1):

"""

推进仿真时间 cycles 个周期

"""

# 1. 如果有数据变更，发送 Transaction (Driver)

# self._current_trans.send(self.agent)

# 2. 推进仿真 (Run)

# 传递 cycles 参数给底层，使其运行指定时长

# self.agent.step(cycles)

# 3. 接收并更新状态 (Monitor)

# 从 agent 获取最新的监测数据来更新本地状态

# rcv_trans = self.agent.get_monitored_item()

# if rcv_trans:

# self._current_trans = rcv_trans

```

  

#### 3.3 用户使用代码 (User Usage)

用户代码更加直观，类似于操作硬件寄存器：

  

```python

# 初始化

dut = DUT("adder_trans")

  

# 像操作引脚一样赋值

dut.a = 10

dut.b = 20

  

# 步进：推进 100 个周期

# 在此过程中，底层会自动完成 组包 -> 发送 -> 仿真 -> 拆包 -> 更新状态

dut.Step(100)

  

# 读取结果 (访问当前时刻 UVM 环境中的值)

print(f"Current a: {dut.a}")

```

  

## 4. 参考与上下文 (References & Context)

- **核心参考**: `template/python/dut_real.py` (接口风格参考), `example/Pack` (现有功能参考).

- **模板位置**: `template/uvm` (Pack SV, Python模板), `template/python` (export Python 模板).

- **实现位置**: 预计在 `src/codegen/python.cpp` 或相关 Python 生成逻辑中实现 `DUT` 类的生成。

  

## 5. 待确认与补充 (Notes)

- **底层支持**: 需要确保 Python 端的 `Agent` 类或底层的 C++ 通信层支持带参数的步进 `Step(n)` 以及数据的非阻塞/同步接收。如果现有 `Agent` 仅支持阻塞 `recv()`，可能需要扩展其 API。

- **多 Transaction 处理**: 如果在一个 `Step(100)` 周期内 UVM 环境产生了多个 Transaction，目前的逻辑主要关注最新的状态（类似于采样）。如果需要处理中间的所有 Transaction，可能需要提供额外的 API (如 `get_history()` 或回调)，但对于 `DUT` 抽象层，只保留最新状态是合理的默认行为。

  

---

  

## 6. 实现前需要确认的问题 (Questions Before Implementation)

  

### 6.1 DUT 类的生成位置

**问题**: 当前 `picker pack` 生成的 Agent 类在 `<transaction_name>_xagent.py` 文件中。新的 DUT 类应该：

- [x] **选项 A**: 生成在单独的文件中（如 `<transaction_name>_dut.py`）

- [ ] **选项 B**: 直接追加到现有的 `_xagent.py` 文件里

  

**您的选择**: ___可以实现为DUT<transaction_name>.py这种_____

  

---

  

### 6.2 Monitor 数据接收机制

**问题**: 当前的 `Agent` 类有 `run(nums)` 方法来驱动时钟周期，但从现有代码看：

- 只有在构造函数中指定 `receive_function` 回调时才能接收数据

- 没有主动获取 monitor 数据的方法（如 `get_monitored_item()`）

  

您期望的 `Step(n)` 后自动更新状态功能，需要底层支持。请确认：

  

1. **UVM 侧 monitor 是否已实现**？

- [ ] 是，已有 monitor 实现

- [x] 否，需要在本次任务中实现

- 补充：原来的版本中，UVM端会生成一个UVM的monitor，Python端会根据需要，由用户实现receive_function，现在的需求是在模板文件中实现默认的receive_function，用于更新dut

  

2. **Monitor 数据发送机制**：

- [ ] Monitor 会在每个周期自动发送 transaction 回 Python

- [ ] Monitor 只在特定条件下发送（请说明条件：__________）

- [x] 需要 Python 主动请求才会返回数据，在Step结束后更新，例如当前cycle x Step(10)，读取x+10周期的值

- [ ] 其他机制（请说明：__________）

  

3. **是否需要修改 UVM 端代码（SystemVerilog）**？

- [x] 是，需要修改/增强 UVM Agent 的实现

- [ ] 否，现有 UVM 实现已足够

  

**补充说明**: _________

  

---

  

### 6.3 属性读写的双状态管理

**问题**: 从需求文档理解，DUT 类需要维护两种状态：

  

1. **待发送状态**（Pending State）：

- 用户通过 `dut.a = 10` 设置的值

- 在 `Step()` 调用时打包成 transaction 发送

  

2. **当前状态**（Current State）：

- Monitor 从 UVM 环境中监测到的最新值

- 用户读取 `dut.a` 时返回的值

  

**确认问题**：

- [x] 是的，需要维护两个独立的状态（待发送 & 当前状态）

- [ ] 不需要，简化为单一状态即可

- [ ] 其他方案（请说明：__________）

  

**行为确认**：

```python

dut.a = 10 # 设置待发送值

print(dut.a) # 此时应该返回什么？

# [x] 返回 10（刚设置的值）

# [ ] 返回上次 Step 后 monitor 的值

# [ ] 其他：__________

  

dut.Step(1) # 发送 a=10，并接收 monitor 数据

print(dut.a) # 此时返回 monitor 监测到的值

```

  

**您的期望**: _________

  

---

  

### 6.4 命令行参数控制

**问题**: 新增的 DUT 类生成功能，是否需要命令行参数控制？

  

- [ ] **选项 A**: 默认生成，无需额外参数

- [x] **选项 B**: 增加可选参数（如 `picker pack --generate-dut`）

- [ ] **选项 C**: 增加配置文件选项

- [ ] **选项 D**: 其他方式（请说明：__________）

  

**您的选择**: ___选项 B______

  

---

  

### 6.5 模板文件组织

**问题**: 建议创建新的模板文件以保持代码清晰：

  

**建议方案**：

- 创建 `template/uvm/xdut.py` 作为 DUT 类的模板

- 保持 `template/uvm/xagent.py` 不变（或最小改动）

- 在 `src/codegen/uvm.cpp` 中增加生成逻辑

  

**确认**：

- [x] 同意，创建独立的 `xdut.py` 模板文件

- [ ] 不同意，建议方案：__________

  

---

  

### 6.6 示例代码生成

**问题**: 是否需要生成 DUT 类的使用示例？

  

- [x] 是，生成示例文件（如 `example/example_dut.py`）

- [ ] 否，不需要

- [ ] 更新现有的 `example_python.py` 展示 DUT 用法

  

**您的选择**: _________

  

---

  

### 6.7 向后兼容性

**问题**: 新功能对现有代码的影响：

  

- [ ] 保持完全向后兼容，现有的 Agent 使用方式不变

- [x] 可以对 Agent 类做小幅改动（需要用户更新代码）

- [ ] 可以进行较大重构

  

**您的期望**: ___若需要有较大重构，可以提前找我确认______

  

---

  
  

## 7. 请在上述问题中标记您的选择，并补充说明，然后告知我可以开始实现。

  

另外的补充，现在export功能中，使用了xpin，xdata，xdata等已经封装好的数据类型，如果可以，你可以结合到pack这边的dut中，例如存在多个事物封装到一个dut中时，xdata对应所有事物的属性，xport对应某个事物

Plan: Pack DUT 类功能增强（集成 xspcomm 架构）

基于您的需求和对 xspcomm 架构的研究，我为 picker pack 功能设计了一个修订后的实现方案。

  

核心设计理念

借鉴 export 的成熟架构，将 pack 的 DUT 类升级为基于 xspcomm 的实现，实现统一的 API 体验。

  

架构映射

```

UVM Transaction ←→ XPort (信号集合)

└─ Field ←→ XData (单个信号)

```

关键特性

每个 transaction 对应一个 XPort

  

多 transaction 场景下，每个创建独立的 XPort

通过 XPort 实现分组管理

每个字段映射到 XData/XPin

  

统一使用 dut.field_name.value 访问

与 export DUT 保持一致的使用体验

双状态管理

  

待发送状态: 存储在 Python transaction 对象中

当前状态: 存储在 XData 中（monitor 更新）

用户设置值时修改待发送状态，读取时返回待发送值（Step 前）或当前状态（Step 后）

Step() 方法实现

```

def Step(self, cycles=1):

# 1. 发送待发送的 transaction (通过 TLM)

if self._dirty:

self._pending_trans.send(self.agent)

# 2. 推进仿真

self.agent.run(cycles)

# 3. Monitor 回调自动更新 XData

```

Steps

创建 template/uvm/xdut.py 模板 - 参考 dut.py 的结构，生成基于 xspcomm 的 DUT 类，包含 XData/XPin 初始化、XPort 组织、Agent 集成

  

修改 type.hpp - 在 pack_opts 结构体中添加 bool generate_dut 字段，支持 --generate-dut 命令行参数

  

更新 uvm.cpp - 在 gen_uvm_param() 函数中添加条件判断，当 opts.generate_dut 为 true 时调用模板生成 DUT 类文件

  

增强 xagent.sv - 修改 UVM monitor，确保能够将监测到的 transaction 序列化并通过 TLM 发送回 Python 端

  

创建 template/uvm/example_dut.py - 生成使用示例，展示如何使用 DUT 类进行 pin-level 的操作

  

处理 CLI 参数 - 在 picker.cpp 中添加 --generate-dut 选项的解析逻辑

Further Considerations

XData 不绑定硬件 - pack 使用 TLM 通信，XData 仅作为数据容器，不需要 BindDPIPtr/BindNativeData，这与 export 不同

  

Monitor 回调机制 - 需要在 Agent 初始化时注册 receive_function，将接收到的数据自动更新到 XData 中。可以在 DUT 类的 __init__ 中实现默认回调

  

多 Transaction 支持 - 未来如果需要支持多个 transaction，可以为每个创建独立的 XPort 和 Agent，通过 transaction 名称区分

  

向后兼容 - 不影响现有的 Agent 直接使用方式，DUT 类作为可选的更高层抽象

  

Phase 1 实现范围 - 建议先实现单 transaction 的基本功能（属性映射 + Step），验证可行性后再扩展到多 transaction 和高级特性

  

这个方案结合了 export 的成熟架构和 pack 的 TLM 通信特点，既保持了 API 的一致性，又满足了您的需求。请确认是否同意此方案，我将开始实现

  
  
  

# Picker Pack DUT Class Implementation Summary

  

## 1. Overview

This document summarizes the work done to implement the DUT class generation for `picker pack`, enabling a pin-level abstraction for UVM-based verification environments.

  

## 2. Implemented Features

  

### 2.1 CLI Argument

- Added `--generate-dut` (or `-d`) flag to the `pack` subcommand.

- **File**: `src/picker.cpp`

- **Logic**: Parses the flag and sets `opts.generate_dut` to true.

  

### 2.2 DUT Class Template

- Created a new Python template for the DUT class.

- **File**: `template/uvm/xdut.py`

- **Functionality**:

- Wraps the generated UVM Agent.

- Provides `Step(cycles)` method for simulation time advancement.

- Maps transaction fields to properties (getters/setters).

- Uses `xspcomm` concepts (implied by `example_dut.py` usage and `release-pack.sh` updates).

  

### 2.3 Code Generation Logic

- Updated the UVM code generator to conditionally render the DUT class and examples.

- **File**: `src/codegen/uvm.cpp`

- **Output**: Generates `DUT<filename>.py` when the `-d` flag is used.

  

### 2.4 Examples & Testing

- **Python Example**: `template/uvm/example_dut.py` created to demonstrate usage.

- **UVM Example**: `template/uvm/example_uvm_dut.sv` created for the UVM side.

- **Integration Test**: Updated `example/Pack/release-pack.sh` with a `dut` test case to verify the flow.

  

### 2.5 Data Structures

- Updated `include/type.hpp` to include `generate_dut` in `pack_opts`.

  

## 3. Usage

To generate the DUT class:

```bash

picker pack <transaction_file.sv> -d -e

```

This generates:

- Standard Agent files.

- `DUT<transaction_name>.py`.

- `example/example_dut.py` (if `-e` is used).

  

## 4. Pending/Next Steps

- Detailed verification of the `Step()` method's synchronization logic (Pending user feedback).

- Review of the `monitor` implementation in the generated SV code to ensure it correctly feeds data back to Python for the `get` operations.

  
  

## 3. 额外的优化机会 (建议)

  

### 3.1. 增强的类型支持

- **当前状态:** 解析器 (`src/parser/uvm.cpp`) 主要支持基本的整数类型 (`int`, `byte`, `shortint`, `longint`) 和简单的压缩数组 (packed arrays)，且仅针对标记为 `rand` 的字段。

- **优化建议:**

- 支持 **非 `rand` 字段**（例如 `bit [7:0] cmd;`），如果它们对接口很重要。

- 支持 **枚举 (`enum`)**: 将它们映射到 Python `IntEnum` 或整数常量，以提高可读性。

- 支持 **结构体 (`struct`)**: 将其扁平化或映射到嵌套的 Python 对象。

  

### 3.2. 动态数据结构

- **当前状态:** 仅稳健地处理固定宽度的信号。

- **优化建议:** 添加对 `string`、动态数组 `[]` 和队列 `[$]` 的支持。这需要更复杂的 `uvmc` 打包/解包逻辑，但将极大地扩展工具在基于包（packet-based）协议中的实用性。

  

## 4. 实施计划

1. **解析器更新:** 修改 `src/parser/uvm.cpp` 以查找输入/输出注解（或启发式方法），并可能扩展类型解析。

2. **模板更新:** 修改 `template/uvm/xdut.py` 以支持用户回调，并在适用的情况下实施方向性检查。

3. **生成器更新:** 修改 `src/codegen/uvm.cpp` 以实现新的文件夹结构并调整 `Makefile` 生成。