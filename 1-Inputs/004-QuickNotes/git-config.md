---
Project:
  - LearnTools
title: act
description: 
source: 
author: 
tags:
  - git
created: 2025-07-07 | 10:54
parent: Resource
branch:
---
# QuickNotes

在Linux系统中配置Git密钥（通常指的是SSH密钥），可以让你无需每次提交代码时都输入用户名和密码，从而提高工作效率。以下是详细的步骤：

### 1. 生成SSH密钥

如果你还没有SSH密钥，首先需要生成一个。打开你的终端（Terminal），然后运行以下命令来生成一个新的SSH密钥对：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

- `-t rsa` 指定密钥类型为RSA。
    
- `-b 4096` 指定密钥的位数为4096位，这是推荐的安全位数。
    
- `-C` 后面跟着你的电子邮件地址，用于标识这个密钥。
    

运行此命令后，系统会要求你输入一个文件名来保存密钥（默认为`id_rsa`），以及一个密码（可选）。强烈建议设置一个密码，以增加安全性。

### 2. 查看你的公钥

生成密钥后，你可以查看你的公钥，并将其添加到Git服务（如GitHub, GitLab等）上，以便进行身份验证。

查看公钥的命令：

```bash
cat ~/.ssh/id_rsa.pub
```

### 3. 将公钥添加到Git服务

复制输出的公钥内容，然后登录到你的Git服务账户（如GitHub, GitLab等），user head -> settings 中找到“SSH and GPG keys”或类似的选项，然后点击“New SSH key”或“Add SSH key”，将你的公钥粘贴进去，并保存。



### 5. 测试SSH连接

为了测试你的SSH配置是否正确，你可以尝试连接到GitHub（以GitHub为例）：

```bash
ssh -T git@github.com
```

如果一切配置正确，你应该会看到一条欢迎消息，表明你已经成功连接。

### 6. 使用SSH密钥进行Git操作

现在，你可以在Git命令中使用SSH协议来克隆、推送和拉取仓库，而无需输入用户名和密码了。例如：

```bash
git clone git@github.com:username/repository.git
```

以上步骤应该可以帮助你在Linux系统中配置Git的SSH密钥。如果你遇到任何问题，检查每一步的细节确保没有遗漏或错误。

## 7. config to don`t need input password
`git config --global credential.helper store`


## command 

```
ssh-keygen -t rsa -b 4096 -C "sfangyy@163.com"

Generating public/private rsa key pair.
Enter file in which to save the key (/home/sfangyy/.ssh/id_rsa): 
Created directory '/home/sfangyy/.ssh'.
Enter passphrase for "/home/sfangyy/.ssh/id_rsa" (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/sfangyy/.ssh/id_rsa
Your public key has been saved in /home/sfangyy/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:oxPaMIbkDRaNROr3iG4EVG/A3xbxtPsfQYluckOz9hI sfangyy@163.com
The key's randomart image is:
+---[RSA 4096]----+
| o*=   ...       |
| o.o+  .o . . .  |
|o + .o. .o + o   |
|o+ +.. o  + +    |
|..o.= o So E .   |
| .o.o= o .* + .  |
|.. ...+    o o   |
|..     .    o .  |
|..           .   |
+----[SHA256]-----+

╭─ ~                                                                                                                                                                                               20:32 󰧱 
╰─   cat ~/.ssh/id_rsa.pub

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCxyFB7+dJOtocCXxNkOx10Vt+2QiyEglKMpWpFils/Soi021CdDAtZgvvENrGC6gDxTaExG2mwrWwc4QnULnVQvMGAYxnwPYkOtVO6qQT4mU+lJtgNBcML/Tz9Wuvf0xIuEI61X3HebTvk+pczluzRFhSGiEC9f3oMKTtmuYeKk2d6xKf9A/6S9p2AELB4ne/sn3zvOFu5HqlD9BWIXUkXjo6NzbQKw//GPhpilHU/byrYo/hFhUHwVY4v36ttwsCdT32K2cfxdYagWY9Lb/vpokUaMOtFdvQFWNp1joDqFaxDP+mLRMInPljZ9aKRgK/LwGivgfQ8zFmcezcMc8SaprSXue39rhMfnY3THL7MDY5o1bQV0nIMeO+xKiehPukKAYkHnkdRuvHqrNAPnMES/SqE6+fvYmM5RkyhIl8M1DkKEmd+ZXf6ko9/uZ6r/e2f/CO7hWFyyFiaD4ILg7lJleGOUb+BAUUUeMaBenEXi5FsbJD/rLdohpzLrrTQyVKtaMc5gv/pgGKK7lGKxWbYKq7ZS7xBXPu70A9pPIftn9yZ+WNpQcywdKubxHSwWBxFl2sYYddwSzOISyPNzkwQETZRmdL06Fl+J8KmlqAeQ0hSOm+bvSx0ThniHRuJ09o1Sdezrh00BHUQxnAhsngJmOfB1xxf7rZx7O/CohBUvw== sfangyy@163.com
```