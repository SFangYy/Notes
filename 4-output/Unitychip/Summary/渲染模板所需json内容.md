---
Project: ["Unitychip"]
Status: Ongoing
---
```
data = {
    "package_name": "xxx",              # 包名
    "version": "v0.1",
    "date_now": "2025-12-31",
    "generate_dut": true/false,         # 是否生成DUT实例（--from-rtl时为true）
    "rtl_file_path": "path/to/rtl.v",   # RTL文件相对路径
    "transactions": [                    # 总是数组，即使只有1个
        {
            "name": "Adder",             # 模块名（RTL）或类名（SV）
            "class_name": "Adder_trans", # transaction类名
            "filepath": "Adder_trans.sv",# transaction文件路径
            "from_rtl": true/false,      # 是否从RTL生成
            "variables": [               # 所有端口/字段
                {
                    "name": "a",
                    "bit_count": 128,
                    "byte_count": 16,
                    ...
                }
            ]
        }
    ]
}

```