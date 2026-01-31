---
Project:
  - LearnAI
description:
tags:
  - linux/auth
  - docker
created: 2025-07-01 | 22:29
parent: Resource
---
# Resources
```
RUN mkdir -p /home/sfangyy/.vnc && \
    echo "192837" | vncpasswd -f > /home/sfangyy/.vnc/passwd && \
    chmod 600 /home/sfangyy/.vnc/passwd && \
    chown -R sfangyy:sfangyy /home/sfangyy/.vnc
```

你需要将 `chown` 命令中的组名替换为 `sfangyy` 用户所属的主要组，或者一个 `sfangyy` 用户可以访问的有效组。在大多数 Linux 系统中，当使用 `useradd` 创建用户时，默认会创建一个与用户名同名的组。所以，最常见且正确的做法是使用 `sfangyy:sfangyy`。