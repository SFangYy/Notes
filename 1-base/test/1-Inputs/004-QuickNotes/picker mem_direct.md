---
Project:
  - BuildPdb
title:
description:
source:
tags:
  - xspdb
created: 2025-07-31 | 10:10
parent: Resource
---
# 004-QuickNotes
- 可以查看picker的makefile，先使用pciker将simtop.h文件导出(需要设置模板文件），然后进入mem_direct 执行make命令‘


- 在picker的makefile中 提前LD_PRELOAD difftest.so
	1. undefined symbol _ZTVN10_cxxabiv120_si
		1. 将difftest gcc改为g++
	2. 换成g++之后出现 undefined symbol pyexec_value error
		- 添加 -lpython3.10
	3. 还是找不到，通过 -l:_difftest.so

还是找不到，最后，为了项目结构考虑

还是在pyxscore下创建符号链接
```
ln -s _difftest.so libdifftest.so
```

