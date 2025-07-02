---
Project: ["LearnAI"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-01 | 14:41
parent: Resource
branch: 
---
# Resources

## 创建docker镜像
- 根据dockerfile创建镜像
```
docker build -t 镜像名:版本 -f 指定文件
docker build -t myapp:dev -f Dockerfile.dev .
```
- 本地拉取镜像
## 根据镜像创建容器
```
docker run -it --network host 镜像名

docker run -d -p 51202:51202 -p 5901:5901 --name my-remote-desktop ubuntu-desktop-vnc
```
## 容器的管理
```
docker ps -a

docker rm xxxx

docker stop xxx

docker start xxxx
```


# example
- 一个简单的dockerfile文件，相同目录下存在一个一个工作文件app.py
	- 创建时会将app.py移动到容器内
- 运行`docker build -t my-python-app .`
``` dockerfile
# 使用官方 Python 基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制当前目录所有文件到容器的 /app 目录
COPY . /app

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 暴露端口（假设应用使用 5000 端口）
EXPOSE 5000

# 定义容器启动命令
CMD ["python", "app.py"]
```

``` app.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello from Docker!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```