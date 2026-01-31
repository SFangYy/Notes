---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-01 | 09:12
parent: Resource
---
# 004-QuickNotes---
给文件配置环境变量时不能有空格，否则会找不到文件

```
          echo "NOOP_HOME=$GITHUB_WORKSPACE" >> $GITHUB_ENV
          echo "PDB_HOME=$GITHUB_WORKSPACE/build/xspdb" >> $GITHUB_ENV
          FILE_TIME=$(date +%Y%m)
          FILE_SHA=$(git rev-parse --short HEAD)
          ARCHIVE_NAME="XSPdb-${FILE_TIME}-${FILE_SHA}.tar.gz"
          ARCHIVE_PATH="$PDB_HOME/${ARCHIVE_NAME}"
          echo "FILE_PATH=${ARCHIVE_PATH}" >> $GITHUB_ENV

```



```
 tar -czvf "${ARCHIVE_PATH}" -C ${PDB_HOME} XSPdb
```

