---
Project: ["Unitychip"]
---
# browser
## 换源与环境变量
>建议先通过[[手动安装aur包]]安装clash，然后更新，尽量不要换源 
```
#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'
PS1='[\u@\h \W]\$ '

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/opt/miniconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/opt/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/opt/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/opt/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

export VCS_HOME=$HOME/EDAHome/vcs/W-2024.09-SP1
export VERDI_HOME=$HOME/EDAHome/verdi/W-2024.09-SP1
export PATH=$VCS_HOME/bin:$VERDI_HOME/bin:$PATH
alias vcs="vcs -LDFLAGS '-Wl,--no-as-needed'"

alias vim='nvim'


conda activate env_ucagent

```


## 手动修改配置文件换源[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#0)

### 修改官方源[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#1)

编辑 `/etc/pacman.d/mirrorlist` 文件，注释掉原有源后添加国内镜像源（如清华源、中科大源）：

bash

复制

`# 清华源示例 Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch # 中科大源示例 Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch`

更新软件包缓存：

bash

复制

`sudo pacman -Syy`

### 添加 ArchLinuxCN 源[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#2)

编辑 `/etc/pacman.conf` 文件，在末尾添加以下内容：

bash

复制

`[archlinuxcn] SigLevel = Optional TrustAll Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch`

安装 GPG 密钥并更新系统：

bash

复制

`sudo pacman -Sy archlinuxcn-keyring sudo pacman -Syyu`

## 使用 reflector 自动换源[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#3)

### 安装 reflector[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#4)

bash

复制

`sudo pacman -S reflector`

### 选择国内最快源[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#5)

执行以下命令，自动筛选国内 HTTPS 协议的镜像源并保存到 `/etc/pacman.d/mirrorlist`：

bash

复制

`sudo reflector --country 'China' --protocol https --latest 20 --sort rate --save /etc/pacman.d/mirrorlist`

参数说明：

|参数|说明|
|---|---|
|`--country 'China'`|限定中国境内镜像源|
|`--protocol https`|仅使用 HTTPS 协议|
|`--latest 20`|选择最近 20 个同步的镜像|
|`--sort rate`|按下载速度排序|
|`--save`|保存结果到配置文件|

更新软件包缓存：

bash

复制

`sudo pacman -Syy`

## 验证换源结果[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#6)

### 检查镜像列表[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#7)

查看 `/etc/pacman.d/mirrorlist` 或 `/etc/pacman.conf`，确认国内源已生效。

### 测试下载速度[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#8)

bash

复制

`sudo pacman -Sy archlinux-keyring  # 示例：测试下载速度`

## 注意事项[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#9)

### 备份配置文件[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#10)

修改前建议备份原始文件：

bash

复制

`sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak sudo cp /etc/pacman.conf /etc/pacman.conf.bak`

### 签名验证[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#11)

若遇到签名错误，可临时禁用签名检查（不推荐长期使用）：

bash

复制

`sudo pacman -Sy --noconfirm archlinuxcn-keyring`

或修复密钥环：

bash

复制

`sudo rm -rf /etc/pacman.d/gnupg sudo pacman-key --init sudo pacman-key --populate archlinux archlinuxcn`

### 多架构支持[](https://comate.baidu.com/zh/page/mkkqtw3hr9v#12)

若需启用 32 位库支持，在 `/etc/pacman.conf` 中取消 `[multilib]` 段的注释：

bash

复制

`[multilib] Include = /etc/pacman.d/mirrorlist`

更新系统：

bash

复制

`sudo pacman -Syyu`

页面的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，请仔细甄别

0

0

![](https://now.bdstatic.com/store/v2/f14cbf5/frontend/f901503//_next/static/media/contact-us-card-light-background.23fcbce7.png)

码随心动，快人一步，更懂你的智能代码助手

[

个人免费使用

](https://comate.baidu.com/zh/download)企业免费开通

![](https://comate.baidu.com/images/BaiduComateLogo-D.png)预约演示

私有化部署

客户服务

邮箱：Comate_Service@baidu.com

服务时间：工作日10：00-18：00

客户案例

[客户案例](https://comate.baidu.com/zh/scenarios#client-story)

产品定价

[版本对比](https://comate.baidu.com/zh/pricing)

资讯消息

[最新动态](https://comate.baidu.com/zh/news?tab=news)[获奖评测](https://comate.baidu.com/zh/news?tab=honor)

前往体验

[下载插件](https://comate.baidu.com/zh/download)[在线问答](https://comate.baidu.com/zh/chat?mode=AGENT)

服务支持

[使用手册](https://cloud.baidu.com/doc/COMATE/s/9lnvs245z)[教学课程](https://comate.baidu.com/zh/curriculums/1)[问答社区](https://developer.baidu.com/singleTagPage.html?tagId=326&type=QUESTION&from=BaiduComate)[常见问题](https://cloud.baidu.com/doc/COMATE/s/Dlnvqzquu)