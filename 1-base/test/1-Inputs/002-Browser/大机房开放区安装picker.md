---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-19 | 09:29
parent: Resource
---


## 1. install swig 
```
cd /nfs/tools/picker_src/swig       
./configure --prefix=/nfs/tools/picker
make
make install
```

## 2. install verible 


``` 
cp /nfs/tools/picker_src/verible/bin/* /nfs/tools/picker/bin       
```


## 3. install picker 

源码安装picker：执行安装命令
```
make build
make install
```