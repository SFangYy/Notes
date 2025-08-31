---
Project: ["undefined"]
description: 
tags: 
created: 2025-08-25 | 14:44
parent: Resource
---
# 004-QuickNotes

## xiangshan

| 指标             | gsim       | verilator |
| -------------- | ---------- | --------- |
| picker  export | 39 min 17s | x s       |
| picker make    | 14:18:42   | 3h+       |
| xspdb run      |            |           |
| VIRT           | 122.7g     | 128.4g    |
| RES            | 7.5g       | 7.6g      |

## error info
```
/nfs/home/songfangyuan/work/test_gsim/pyxscore/build/_SRC/SimTop.h:68116:23: error: ‘l_soc$l3cacheOpt$sli
ic -O3 -march=native -MD -MT CMakeFiles/DPISimTop.dir/DPISimTop/VSimTop__Trace__23.cpp.o -MF CMakeFiles/D│ces_3$sinkC$buffer’ does not name a type
PISimTop.dir/DPISimTop/VSimTop__Trace__23.cpp.o.d -o CMakeFiles/DPISimTop.dir/DPISimTop/VSimTop__Trace__2│68116 | unsigned _BitInt(256) l_soc$l3cacheOpt$slices_3$sinkC$buffer[16][2]; // width = 256, lineno = 918
3.cpp.o -c /nfs/home/songfangyuan/work/XiangShan/build/xspdb/pyxscore/build/DPISimTop/VSimTop__Trace__23.│4621
```

