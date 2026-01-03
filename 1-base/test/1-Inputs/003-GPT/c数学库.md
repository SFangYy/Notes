---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-10 | 10:50
parent: Resource
---
# 003-GPT
- 报错
```
make compile target="src/hello.c" args="-o main"
gcc src/hello.c -o main
/usr/bin/ld: /tmp/ccQkeLyC.o: in function `main':
hello.c:(.text+0x4f): undefined reference to `sin'
collect2: error: ld returned 1 exit status
make: *** [Makefile:5: compile] Error 1
```
这个错误是因为在链接阶段找不到数学库中的 `sin` 函数。GCC 默认不会链接数学库，需要手动指定。
在编译命令中添加 `-lm` 选项来链接数学库：

```
CFLAGS = -Wall -g
LDFLAGS = -lm

main: src/hello.c
    gcc $(CFLAGS) src/hello.c -o main $(LDFLAGS)
```
```

󰪢 0s 󰜥 󰉋   /work/linuxc 
    make compile target="src/hello.c" args="-o main -lm"
```
