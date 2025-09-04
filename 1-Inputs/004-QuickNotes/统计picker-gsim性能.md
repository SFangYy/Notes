---
Project: ["undefined"]
description: 
tags: 
created: 2025-08-25 | 14:44
parent: Resource
---
# 004-QuickNotes

## xiangshan

| 指标             | gsimi+picker | verilator + picker | gsim                             |
| -------------- | ------------ | ------------------ | -------------------------------- |
| picker  export | 2308.116     | x s                |                                  |
| picker make    | 14:18:42     | 3h+                | 4194.150<br>4328.759<br>4006.115 |
| xspdb run      |              |                    |                                  |
| VIRT           | 122.7g       | 128.4g             |                                  |
| RES            | 7.5g         | 7.6g               |                                  |

## cache


|                           | gsim             | verilator      |
| ------------------------- | ---------------- | -------------- |
| make                      | 25.328           | 24.863         |
| run 100000                | 2.653            | 3.343          |
| run 1000000               | 21.740           | 28.877         |
| run with set value 100000 | 10.336<br>10.787 | 8.556<br>8.201 |
| run with set value 100000 | 102.088          | 82.507         |


## error info
```
/nfs/home/songfangyuan/work/test_gsim/pyxscore/build/_SRC/SimTop.h:68116:23: error: ‘l_soc$l3cacheOpt$sli
ic -O3 -march=native -MD -MT CMakeFiles/DPISimTop.dir/DPISimTop/VSimTop__Trace__23.cpp.o -MF CMakeFiles/D│ces_3$sinkC$buffer’ does not name a type
PISimTop.dir/DPISimTop/VSimTop__Trace__23.cpp.o.d -o CMakeFiles/DPISimTop.dir/DPISimTop/VSimTop__Trace__2│68116 | unsigned _BitInt(256) l_soc$l3cacheOpt$slices_3$sinkC$buffer[16][2]; // width = 256, lineno = 918
3.cpp.o -c /nfs/home/songfangyuan/work/XiangShan/build/xspdb/pyxscore/build/DPISimTop/VSimTop__Trace__23.│4621
```

