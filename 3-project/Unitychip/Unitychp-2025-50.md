---
Project: ["Unitychip"]
cssclasses: ["hideProperties", "iotoTDL"]
createTime: 2025-12-10T10:32:19
status: TODO
tags:
  - project
---
## Input (LEARN)

- [ ] 适配gsim
	- 修改makefile.pdb
	- clang
- [ ] 完善picker pack命令
	- 优化原有解析函数
	- 封装dut
	- 实现例子 
	- 优化文件结构

```bash

pack_output/adder/
├── adder_trans_pkg/ # 自动生成的 SV Package
│ ├── adder_trans.py # Python DUT 包装类
│ ├── adder_trans_xagent.sv # UVM Agent
│ ├── adder_trans_xdriver.sv # UVM Driver 基类
│ ├── adder_trans_xmonitor.sv # UVM Monitor
│ ├── adder_trans_pkg.sv # SV Package 顶层
│ └── ... # 其他支持文件
├── example.sv # (复制的) UVM Testbench
├── example.py # (复制的) Python 测试
├── Makefile # (复制的) 编译脚本
└── filelist.txt # VCS 文件列表

```
## Output (THINK)

- [ ] [[pack DUT模式]]
- [ ] [[结构优化与时序处理]]
- [ ] [[多事物模式]]

## Outcome (DO)

- [ ]
