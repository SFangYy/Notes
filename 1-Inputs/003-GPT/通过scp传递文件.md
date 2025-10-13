---
Project:
  - undefined
description:
tags:
  - linux
created: 2025-09-08 | 10:32
parent: Resource
---
# 003-GPT

```
scp /path/to/local/file.txt username@remotehost:/path/to/remote/directory/
scp file1.txt file2.txt username@remotehost:/path/to/remote/directory/
scp -r /path/to/local/directory username@remotehost:/path/to/remote/directory/
scp -C largefile.txt username@remotehost:/remote/directory/

scp  XiangShan.tar.bz2 songfangyuan@172.19.20.31:~/work/temp3
```
## 拉取远端服务器的文件
```
scp  -T songfangyuan@172.19.20.31:~/work/temp3/XSPdb.tar.bz2 .
```