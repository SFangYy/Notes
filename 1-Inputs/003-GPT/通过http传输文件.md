---
Project: ["undefined"]
description: 
tags: 
created: 2025-10-11 | 14:57
parent: Resource
---
# 003-GPT

## 服务端 
```
python -m http.server 8000
```

## 客户端 
- 配置服务器ip和端口以及文件名
```
import urllib.request

url = 'http://example.com:8000/somefile.txt'  # 替换为你的URL
local_filename = 'downloaded_file.txt'

try:
    with urllib.request.urlopen(url) as response:
        data = response.read()
        with open(local_filename, 'wb') as f:
            f.write(data)
    print(f"文件已下载为 {local_filename}")
except Exception as e:
    print(f"下载过程中出现错误: {e}")
```a