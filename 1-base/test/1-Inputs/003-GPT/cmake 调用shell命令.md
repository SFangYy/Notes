---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-08 | 10:31
parent: Resource
---
# 003-GPT
```
# 获取环境变量
set(RAW_FLAGS $ENV{EMU_FLAGS})

# 使用 separate_arguments 将字符串分割为列表
separate_arguments(SPLIT_FLAGS UNIX_COMMAND "${RAW_FLAGS}")

# 使用分割后的列表
add_custom_command(
    OUTPUT some_output
    COMMAND gsim ${SPLIT_FLAGS}
    DEPENDS some_dependency
)
```