---
Project: ["BuildPdb"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-21 | 10:39
parent: Resource
branch: 
---
# QuickNotes
## install dependency


## compile and install gcc 
1. download file at `https://ftp.gnu.org/gnu/gcc/gcc-10.5.0/gcc-10.5.0.tar.gz`
2. tar zxvf `gcc-10.5.0.tar.gz`
3. mkdir build folder
```
mkdir build-gcc-10
cd build-gcc-10
```
4. configure gcc config
```
../gcc-10.x.x/configure \
    --prefix=~/.local \
    --enable-languages=c,c++ \
    --disable-multilib \
    --with-gmp=~/.local \
    --with-mpfr=~/.local \
    --with-mpc=~/.local \
    --with-isl=~/.local \
    --with-zlib=~/.local \
    --enable-shared # 确保生成共享库
```
5. compile gcc 
```
make -j$(nproc) # 使用所有可用的 CPU 核心加速编译
```
6. make install 