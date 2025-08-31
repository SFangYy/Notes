---
Project: ["undefined"]
description: 
tags: 
created: 2025-08-26 | 17:07
parent: Resource
---
# 003-GPT
```Makefile
NAME ?= "World" 
AGE ?=

$(eval AGE_ARG :=)
$(if $(strip $(AGE)),$(eval AGE_ARG := --age $(AGE)))

python3 pdb-run $(AGE_ARG)
```

pdb-run.py
```python 
args = patse_args()
XSPdb(dut).run(args)
```

xspdb.py
```
import argparse
def create_parser():
    """创建并返回参数解析器"""
    parser = argparse.ArgumentParser(description='XSPdb 运行脚本')
    
    # 添加 -b 参数
    parser.add_argument('-b', '--binary', type=str, required=True,
                        help='load binary file')
    
    # 可以添加更多参数
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='启用详细输出模式')
    
    return parser

def parse_args():
    """解析并返回命令行参数"""
    parser = create_parser()
    return parser.parse_args()
```