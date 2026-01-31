# XSPdb - XiangShan Processor Debugger

XSPdb 是一个功能强大的香山处理器调试器，提供交互式和批处理两种调试模式，支持指令级和周期级调试、断点、变量监视、内存操作、反汇编、汇编、ELF 符号支持、波形录制等丰富的调试功能。

## 功能特性

### 核心调试功能

- **交互式调试**：基于 Python PDB 的交互式调试器，支持标准调试命令
- **批处理模式**：自动化执行，支持周期限制和时间约束
- **指令级步进**：通过 `xistep` 命令逐指令执行
- **周期级步进**：通过 `xstep` 命令逐周期执行电路
- **断点设置**：在信号上设置断点（`xbreak`），支持多种条件（eq, ne, gt, lt, ge, le, ch）
- **变量监视**：监视内部信号值（`xwatch`）
- **提交 PC 监视**：监视提交的 PC 地址
- **调用栈分析**：查看函数调用栈（`xback_trace`）

### 内存操作

- **内存读写**：`xmem_read` 和 `xmem_write` 命令
- **内存复制**：`xmem_copy` 和 `xmem_copy_range_to` 命令
- **Flash 操作**：支持 Flash 内存读写和初始化
- **二进制文件导入导出**：`xload`、`xexport_bin`、`xexport_flash`、`xexport_ram`
- **寄存器文件解析**：支持解析和加载寄存器文件

### 代码分析

- **反汇编**：`xdasm`（内存）、`xdasmflash`（Flash）、`xdasmbytes`（字节数据）
- **汇编**：`xasm` 汇编 RISC-V 代码到段，`xasm_insert` 汇编并插入内存
- **指令编码/解码**：`xdecode_instr`、`xencode_instr` 支持 16 位压缩指令和 32 位指令
- **ELF 符号支持**：地址到符号转换、符号到地址转换
- **指令文件解析**：支持解析和加载指令文件

### Difftest 支持

- **参考模型加载**：加载参考 .so 文件
- **Difftest 比较**：启用/禁用差异检查
- **提交 PC 监控**：监控所有提交的 PC
- **Good Trap/Good Loop 检测**：自动检测正常退出和循环

### 用户界面

- **文本用户界面（TUI）**：基于 urwid 的文本界面
- **实时反汇编显示**：实时显示内存反汇编
- **寄存器状态面板**：显示整数寄存器、浮点寄存器、CSR、PC 等状态
- **命令历史**：支持上下箭头浏览历史命令
- **自动补全**：Tab 键自动补全命令和路径
- **ANSI 颜色支持**：语法高亮显示
- **可调整面板大小**：Ctrl+方向键调整面板尺寸

### 高级功能

- **波形录制**：`xwave_on`、`xwave_off`、`xwave_flush`
- **Trap 处理**：Trap 断点、Trap 信息显示、Good Trap 控制
- **批处理脚本**：支持执行 XSPdb 脚本文件
- **命令日志**：记录所有执行的命令
- **可配置日志级别**：支持 debug、info、warn、error 级别
- **路径验证**：安全功能，防止路径遍历攻击

## 快速开始

### 安装

```bash
# 使用 Makefile 安装（推荐用于开发）
make install

# 或使用 pip 安装（推荐用于生产环境）
pip install -e .

# 或使用虚拟环境安装（最安全）
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 使用方式

#### 方式一：直接运行脚本（推荐）

```bash
# 基本使用
./xspdb.py -i program.bin

# 带参数
./xspdb.py -i program.bin --log --log-file debug.log

# 批处理模式
./xspdb.py -i program.bin --batch -c 1000000

# 查看帮助
./xspdb.py --help
```

#### 方式二：使用 make 命令

```bash
# 使用 make xspdb
make xspdb IMAGE_FILE=program.bin

# 带参数
make xspdb PDB_ARGS="--log --log-file debug.log" IMAGE_FILE=program.bin
```

#### 方式三：使用 python 命令

```bash
# 使用 python3 运行
python3 xspdb.py -i program.bin

# 带参数
python3 xspdb.py -i program.bin --batch -c 1000000
```

## 命令行参数

| 参数 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `--image` | `-i` | 要加载和运行的镜像文件 | 无 |
| `--log` | `-l` | 启用日志输出 | False |
| `--log-file` | | 日志文件名 | ./XSPdb.log |
| `--log-level` | | 设置日志级别（debug/info/warn/error） | 无 |
| `--debug-level` | | 设置调试级别（debug/info/warn/error） | 无 |
| `--batch` | | 启用批处理模式 | False |
| `--max-cycles` | `-c` | 最大执行周期 | 0xFFFFFFFFFFFFFFFF |
| `--interact-at` | `-t` | 在指定周期进入交互模式 | -1 |
| `--script` | `-s` | 要执行的脚本文件 | 无 |
| `--max-run-time` | | 最大运行时间（如 10s, 1m, 1h） | 0 |
| `--mem-base-address` | | 内存基地址 | 0x80000000 |

## 主要命令

### 基础命令

- `xui` - 进入文本用户界面
- `xcmds` - 列出所有可用命令
- `help` - 显示帮助信息
- `quit` 或 `exit` - 退出

### 调试命令

- `xstep [cycles]` - 周期级步进
- `xistep [count]` - 指令级步进
- `xwatch <signal>` - 监视信号
- `xprint <signal>` - 打印信号值
- `xset <signal> <value>` - 设置信号值
- `xbreak <signal> <cond> <value>` - 设置断点
- `xback_trace [pc] [sp]` - 查看调用栈

### 内存命令

- `xmem_read <addr> <size>` - 读取内存
- `xmem_write <addr> <data>` - 写入内存
- `xmem_copy <src> <dst> <size>` - 复制内存
- `xload <file>` - 加载二进制文件到内存
- `xexport_bin <file>` - 导出 Flash + 内存到文件

### 反汇编/汇编命令

- `xdasm <addr> <size>` - 反汇编内存
- `xdasmflash <addr> <size>` - 反汇编 Flash
- `xasm <addr> [sections] <code>` - 汇编代码
- `xasm_insert <addr> <code>` - 汇编并插入内存

### Difftest 命令

- `xload_difftest_ref_so <file>` - 加载参考 .so 文件
- `xdifftest_reset` - 重置 difftest
- `xpc` - 打印提交的 PC
- `xwatch_commit_pc <pc>` - 监视提交 PC
- `xdifftest_display` - 显示 difftest 状态

### Trap 命令

- `xtrap_info` - 打印 trap 信息
- `xtrap_break_on` - 在 trap 上设置断点
- `xtrap_break_off` - 取消 trap 断点
- `xgood_trap_disable` - 禁用 good trap

### 寄存器命令

- `xset_ireg <reg> <value>` - 设置整数寄存器
- `xset_freg <reg> <value>` - 设置浮点寄存器
- `xlist_flash_iregs` - 列出 Flash 整数寄存器
- `xlist_flash_fregs` - 列出 Flash 浮点寄存器
- `xload_reg_file <file>` - 加载寄存器文件

### 波形命令

- `xwave_on <file>` - 开始波形录制
- `xwave_off` - 停止波形录制
- `xwave_flush` - 刷新波形

### 批处理命令

- `xload_script <file>` - 加载并执行脚本文件

## 配置

XSPdb 支持通过环境变量配置：

- `XSPDB_MEM_BASE` - 内存基地址
- `XSPDB_FLASH_BASE` - Flash 基地址
- `XSPDB_LOG_FILE` - 日志文件路径
- `XSPDB_LOG_LEVEL` - 日志级别
- `XSPDB_DEBUG_LEVEL` - 调试级别

## 依赖

### Python 依赖

- `capstone>=5.0.0` - 反汇编框架
- `urwid>=3.0.0` - 文本 UI 库

### 系统依赖

- `riscv64-unknown-elf-gcc` - RISC-V 工具链
- `riscv64-unknown-elf-objdump` - 目标文件转储工具
- `riscv64-unknown-elf-objcopy` - 目标文件复制工具
- `readelf` - ELF 文件读取工具
- `spike-dasm` - Spike 反汇编器（可选，回退到 capstone）

### C++ 扩展

- `libxspcomm.so.0.0.1` - XSP 通信库
- `_difftest.so` - Difftest 扩展
- `libUT_SimTop.so` - 仿真顶层库

## 项目结构

```
XSPdb/
├── xspdb.py              # CLI 入口点
├── pdb-run.py            # PDB 运行脚本
├── Makefile              # 构建配置
├── setup.py              # 包安装配置
├── xspdb/
│   ├── __init__.py       # 包初始化
│   ├── xspdb.py          # 核心调试器类
│   ├── cli_main.py       # CLI 入口函数
│   ├── cli_parser.py     # 参数解析器
│   ├── ui.py             # 用户界面实现
│   ├── config.py         # 配置管理
│   ├── requirements.txt  # Python 依赖
│   ├── xscmd/            # 命令模块
│   │   ├── cmd_asm.py    # 汇编操作
│   │   ├── cmd_dasm.py   # 反汇编操作
│   │   ├── cmd_com.py    # 命令补全
│   │   ├── cmd_difftest.py # Difftest 支持
│   │   ├── cmd_dut.py    # DUT 控制
│   │   ├── cmd_elf.py    # ELF 符号处理
│   │   ├── cmd_files.py  # 文件 I/O 操作
│   │   ├── cmd_flash.py  # Flash 操作
│   │   ├── cmd_info.py   # 信息显示
│   │   ├── cmd_instr.py  # 指令编码/解码
│   │   ├── cmd_mrw.py    # 内存读写
│   │   ├── cmd_regs.py   # 寄存器操作
│   │   ├── cmd_tools.py  # 工具函数
│   │   ├── cmd_trap.py   # Trap 处理
│   │   ├── cmd_wave.py   # 波形录制
│   │   ├── cmd_batch.py  # 批处理执行
│   │   └── util.py       # 工具函数
│   ├── pyxscore/         # Python 仿真接口
│   │   ├── xspcomm/      # XSP 通信
│   │   └── ...           # 其他仿真相关文件
│   └── pydifftest/       # Python Difftest 接口
│       └── ...           # Difftest 相关文件
└── README.md             # 本文档
```

## Makefile 目标

```bash
make pdb-run        # 使用 pdb-run.py 运行
make xspdb          # 使用 xspdb.py 运行
make install        # 安装到系统
make uninstall      # 从系统卸载
make clean          # 清理 Python 缓存
make check-deps     # 检查依赖
```

## 示例

### 基本调试

```bash
# 加载程序并进入交互模式
./xspdb.py -i program.bin

# 进入 TUI 界面
(XiangShan) xui

# 周期级步进
(XiangShan) xstep 1000

# 指令级步进
(XiangShan) xistep 10

# 查看调用栈
(XiangShan) xback_trace
```

### 批处理模式

```bash
# 运行指定周期
./xspdb.py -i program.bin --batch -c 1000000

# 在指定周期进入交互模式
./xspdb.py -i program.bin --batch -c 1000000 -t 500000

# 执行脚本
./xspdb.py -i program.bin --batch -s script.py

# 限制运行时间
./xspdb.py -i program.bin --batch --max-run-time 10s
```

### 内存操作

```bash
# 读取内存
(XiangShan) xmem_read 0x80000000 64

# 写入内存
(XiangShan) xmem_write 0x80000000 b'\x13\x05\x00\x00'

# 复制内存
(XiangShan) xmem_copy 0x80000000 0x80010000 1024
```

### 反汇编

```bash
# 反汇编内存
(XiangShan) xdasm 0x80000000 10

# 反汇编 Flash
(XiangShan) xdasmflash 0x10000000 20
```

### Difftest

```bash
# 加载参考模型
(XiangShan) xload_difftest_ref_so reference.so

# 启用 difftest
(XiangShan) xdifftest_turn_on_with_ref

# 查看提交 PC
(XiangShan) xpc
```

## 故障排除

### 找不到命令

```bash
# 检查安装
pip show xspdb

# 重新安装
pip install -e .
```

### 找不到共享库

```bash
# 检查 LD_LIBRARY_PATH
echo $LD_LIBRARY_PATH

# 添加到 .bashrc
echo 'export LD_LIBRARY_PATH=/path/to/xspdb/libs:$LD_LIBRARY_PATH' >> ~/.bashrc
```

### 权限问题

```bash
# 使用用户安装
pip install --user -e .
```

## 卸载

```bash
# 使用 pip 卸载
pip uninstall xspdb

# 如果使用虚拟环境，先激活虚拟环境
source .venv/bin/activate
pip uninstall xspdb
```

## 注意事项

1. **依赖库**：需要系统安装必要的依赖库，见 `xspdb/requirements.txt`
2. **共享库**：xspdb 依赖于 `libxspcomm.so` 等 C 扩展库
3. **权限**：如果安装到系统目录，可能需要 root 权限
4. **环境变量**：CLI 会自动设置必要的 LD_PRELOAD 等环境变量

## 开发模式

如果你需要修改代码，使用开发模式安装：

```bash
pip install -e .
```

这样修改代码后无需重新安装，直接生效。

## 许可证

本项目采用 Mulan PSL v2 许可证。详见 LICENSE 文件。

## 贡献

欢迎贡献！请阅读贡献指南了解详情。

## 联系方式

- 作者：北京开源芯片研究院 (BOSC)
- 邮箱：bosc@ict.ac.cn
- 主页：https://github.com/OpenXiangShan/XSPdb

## 致谢

感谢所有贡献者的支持！