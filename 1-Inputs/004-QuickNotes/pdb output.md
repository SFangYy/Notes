---
Project:
  - BuildPdb
description:
source:
tags:
  - xspdb
created: 2025-08-21 | 10:03
parent: Resource
---
# 004-QuickNotes---

```
[Info] reset dut complete
[Info] Loaded 206 functions from XSPdb.cmd
> /nfs/home/songfangyuan/work/pdb/XSPdb/example/test.py(9)test_sim_top()
-> while True:
(XiangShan) xload ready-to-run/
ready-to-run/copy_and_run.bin             ready-to-run/linux.bin                    ready-to-run/riscv64-spike-so             
ready-to-run/coremark-2-iteration.bin     ready-to-run/microbench.bin               ready-to-run/spike-dasm                   
ready-to-run/flash_recursion_test.bin     ready-to-run/riscv64-nemu-interpreter-so  ready-to-run/xspdb_flash_init.bin         
(XiangShan) xload ready-to-run/microbench.bin
Using simulated 1024MB RAM
The image is ready-to-run/microbench.bin
(XiangShan) xwatch_commit_pc 0x80000004
watch commit pc: 0x80000004
(XiangShan) xistep 10
[Info] Find break point (Inst commit), break (step 2107 cycles) at cycle: 2207 (0x89f)
[Info] Find break point (Inst commit), break (step 49 cycles) at cycle: 2256 (0x8d0)
[Info] Find break point (Inst commit), break (step 52 cycles) at cycle: 2308 (0x904)
[Info] Find break point (Inst commit,Target commit), break (step 6051 cycles) at cycle: 8359 (0x20a7)
[Info] Find break point (Inst commit,Target commit), break (step 1 cycles) at cycle: 8360 (0x20a8)
[Info] Find break point (Inst commit,Target commit), break (step 1 cycles) at cycle: 8361 (0x20a9)
[Info] Find break point (Inst commit,Target commit), break (step 1 cycles) at cycle: 8362 (0x20aa)
[Info] Find break point (Inst commit,Target commit), break (step 1 cycles) at cycle: 8363 (0x20ab)
[Info] Find break point (Inst commit,Target commit), break (step 1 cycles) at cycle: 8364 (0x20ac)
[Info] Find break point (Inst commit,Target commit), break (step 1 cycles) at cycle: 8365 (0x20ad)


[Info] Set PMEM_BASE to 0x80000000 (Current: 0x80000000)
[Info] Set FIRST_INST_ADDRESS to 0x80000000 (Current: 0x80000000)

```

```
│ |0x80000000: 00000093  li      ra, 0                ││IntReg:                                                                                                                                                   │
│ |0x80000004: 00000113  li      sp, 0  
```

```bash 
$ make pdb-run
[Info] Set PMEM_BASE to 0x80000000 (Current: 0x80000000)
[Info] Set FIRST_INST_ADDRESS to 0x80000000 (Current: 0x80000000)
Using simulated 32768B flash
[Info] reset dut complete
> XiangShan/scripts/pdb-run.py(13)run()
-> while True:
(XiangShan) xload ready-to-run/microbench.bin   # Load binary (Tab-compatible)
(XiangShan) xwatch_commit_pc 0x80000004         # set watch point,  
(XiangShan) xistep 3                            # Step to next three instruction commit, it will stop at watch point 
[Info] Find break point (Inst commit), break (step 2107 cycles) at cycle: 2207 (0x89f)
[Info] Find break point (Inst commit, Target commit), break (step 2108 cycles) at cycle: 2208 (0x8a0)
(XiangShan) xpc                                 # print pc info
PC[0]: 0x80000000    Instr: 0x00000093
PC[1]: 0x80000004    Instr: 0x00000113
PC[2]: 0x0    Instr: 0x0
...
PC[7]: 0x0    Instr: 0x0
(XiangShan) xistep 1000000                      # Execute 10000 cycles
[Info] Find break point (Inst commit), break (step 2037 cycles) at cycle: 2207 (0x89f)
[Info] Find break point (Inst commit), break (step 2180 cycles) at cycle: 2207 (0x89f)
...
HIT GOOD LOOP at pc = 0xf0001cb0
```

```bash 
$ make pdb-run
[Info] Set PMEM_BASE to 0x80000000 (Current: 0x80000000)
[Info] Set FIRST_INST_ADDRESS to 0x80000000 (Current: 0x80000000)
Using simulated 32768B flash
[Info] reset dut complete
> XiangShan/scripts/pdb-run.py(13)run()
-> while True:
(XiangShan) xload ready-to-run/microbench.bin   # 加载需要运行的bin文件
(XiangShan) xwatch_commit_pc 0x80000004         # 设置观察点 
(XiangShan) xistep 3                            # 执行到下三条指令提交，如设置观察点则执行到观察点
[Info] Find break point (Inst commit), break (step 2107 cycles) at cycle: 2207 (0x89f)
[Info] Find break point (Inst commit, Target commit), break (step 2108 cycles) at cycle: 2208 (0x8a0)
(XiangShan) xpc                                 # 打印pc信息
PC[0]: 0x80000000    Instr: 0x00000093
PC[1]: 0x80000004    Instr: 0x00000113
PC[2]: 0x0    Instr: 0x0
...
PC[7]: 0x0    Instr: 0x0
(XiangShan) xistep 1000000                      # 执行到结束
[Info] Find break point (Inst commit), break (step 2037 cycles) at cycle: 2207 (0x89f)
[Info] Find break point (Inst commit), break (step 2180 cycles) at cycle: 2207 (0x89f)
...
HIT GOOD LOOP at pc = 0xf0001cb0
```