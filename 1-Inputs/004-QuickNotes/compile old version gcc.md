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

### auto download

```
./contrib/download_prerequisites

```
### isl
```
tar -xf isl-*.tar.gz
cd isl-*
./configure --prefix=/nfs/home/songfangyuan/.local/isl-9
make
make install
cd ..
```

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
../gcc-10.5.0/configure \
    --prefix=/nfs/home/songfangyuan/.local \
    --enable-languages=c,c++ \
    --disable-multilib \
    --with-gmp=~/.local \
    --with-mpfr=~/.local \
    --with-mpc=~/.local \
    --with-zlib=~/.local \
    --enable-shared # 确保生成共享库
```

```
cd /path/to/your/gcc-10.x.x-build # Or your GCC 9 build directory
make clean # IMPORTANT: Clean previous build attempts!

```

```
../gcc-10.5.0/configure \
    --prefix=/nfs/home/songfangyuan/.local \
    --enable-languages=c,c++ \
    --disable-multilib \
    --with-gmp=~/.local \
    --with-mpfr=~/.local \
    --with-mpc=~/.local \
    --with-isl=~/.local/isl-20 \
    --with-zlib=~/.local \
    --enable-shared \
    LDFLAGS="-L~/.local/isl-20/lib" \
    CPPFLAGS="-I~/.local/isl-20/include" 
```
5. compile gcc 
```
make -j$(nproc) # 使用所有可用的 CPU 核心加速编译
```
6. make install 

```
# 假设 ISL 安装在 /usr/local/isl
export LD_LIBRARY_PATH=/nfs/home/songfangyuan/.local/isl-20/lib:$LD_LIBRARY_PATH
export CPPFLAGS="-I/nfs/home/songfangyuan/.local/isl-20/include"
export LDFLAGS="-L/nfs/home/songfangyuan/.local/isl-20/lib"

# 然后再运行 configure 脚本
./configure --prefix=/path/to/your/gcc-install [其他配置选项]
```