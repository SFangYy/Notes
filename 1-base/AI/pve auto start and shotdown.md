---
Project:
  - Tools
description:
tags:
  - linux
created: 2025-09-06 | 20:15
parent: Resource
url: https://www.bilibili.com/video/BV1nM411M7N2/?spm_id_from=333.1391.0.0&vd_source=1f4168c3433efd44044aaedea59fbc29
---
# 001-Video

use `crobtab` tools to start config service
```
crobtab -e
```
then choose a editor and then add two line as follows

```
00 08 * * 1-7 /usr/sbin/qm start 101 > /dev/null 2>&1
00 01 * * 1-7 /usr/sbin/qm shutdown 101 > /dev/null 2>&1
```