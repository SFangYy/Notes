---
Advanced: true
OpenArticle: false
Pro: true
Product: IOTO
aliases: 
dateCreated: 2025-11-17 20-42-39
dateModified: 2025-11-21 15-26-16
tags: 
更新时间: 2025-11-01 07:02
---
# IOTO更新日志

## 1.9.7  2025年11月26日

[IOTO 1.9.7 新功能演示](https://meeting.tencent.com/crm/ldPoGjjde2)

- 支持使用`ts-`前缀来使用日期时间格式来设置笔记的前缀和后缀
- 修改syncOption参数为Object
- 增加OnlySyncCurrentFileMode开关
- 优化同步设置的报错提示，如果没有进行同步的必要设置，在提供报错信息后，自动中断同步操作

## 1.9.6 2025年10月23日

- 同步时，支持更新包含多行文本属性值的属性
- 增加闪念笔记文件夹设置，允许闪念笔记的前缀为空

## 1.9.5 2025年10月17日

- **支持同步到Lark多维表**
- 更新IOTO同步生成器Airtable模板
    - [新版同步生成器使用介绍](https://meeting.tencent.com/crm/23b9p98ge4)

## 1.9.4  更新于2025年10月8日

- **支持同步到钉钉AI表格**
- **支持同步到WPS多维表**
- 问题修复
    - 修复Quick Image图片大小控制错误
    - 修复当笔记内容超过多维表文本字段长度限制时，返回的内容被截断
        - 内容限制标准
            - Airtable _10万字符_
            - Vika _10万字符_
            - WPS _3万2500字符_
            - 飞书多维表 _2万字符_
            - 钉钉AI表格 _1万字符_

## 1.9.3 更新于2025年8月8日

### IOTO Update插件

- **用户自定义部署语言**
    - 在IOTO Update插件的设置中，用户可以选择IOTO的运行语言
    - 在选择语言后，**需要重新部署IOTO**才能从服务器下载对应版本的IOTO到本地OB库

### IOTO 框架

- 支持Vika和飞书多维表同步自定义日期字段
    - 由于Vika和飞书多维表对日期字段有特殊的要求，和Airtable的同步机制不同
    - 如果你在同步Vika和飞书多维表时，准备使用日期型的字段，那么在你的同步脚本设置中，你需要给你的自定义字段一个特殊的默认值——**Timestamp**
        - 举例`发布日期: "Timestamp"`
            - 上面例子中，**发布日期**是你在OB中的属性名，这个属性可以是日期型，也可以是日期加时间型
            - 同时**发布日期**也是你在Vika或者飞书多维表中的字段名
            - 后面的**Timestamp**，需要作为字符串，放入到英文的双引号内
- 新增**useTitleInDb**同步属性
    - 支持三级设置
    - 这是一个布尔设置项，默认值为false
    - 如果在同步设置中，把这个属性设置成true，那么在同步时，OB中的笔记标题将不再上传到在线数据库
    - 这个属性的主要使用场景时，你的笔记标题是在多维表中使用公式生成的，当你把多维表中的笔记获取到OB中后，你修改了笔记的内容，想再把OB中的笔记内容上传会多维表。
    - 这时，你就需要把useTitleInDb设置为true，否则，同步时会提示你无法给计算字段传值
- **fmFetchFields**优化
    - 支持在Vault级设置
    - 支持**fmFetchFieldsOverrideMode**
        - fmFetchFieldsOverrideMode是一个新增的设置项，布尔型，默认值是false
        - 在默认值时，Vault设置中如果存在fmFetchFields，会和文件夹设置中的fmFetchFields进行合并
        - 如果设置为true，文件夹设置中的fmFetchFields会覆盖Vault设置中的内容
- 优化部分同步模板
- 添加遗漏的翻译项

## 1.9.2 更新于2025年6月22日

- 支持多语言部署
    - 英语
    - 中文简体
    - 中文繁体
- 自动关闭Templater的触发模板功能，避免更新时出现错误提醒

## 1.9.1 更新于2025年6月15日

- 提供一键部署功能
- 加入用户邮箱和更新API验证
- 添加新的翻译

## 1.9.0 更新于2025年6月13日

- 使用IOTO Update插件进行部署

## 1.8.2版 更新于2025年4月29日

### 更新内容

- 更新了[[ObSyncAirtable.js]],[[ObSyncVika.js]],[[ObSyncFeishu.js]]
    - 修复在批量同步时无法同步block区块和extract内容的问题

## 1.8.1版 更新于2025年4月25日

### 更新内容

- 更新了[[ObSyncFeishu.js]]
    - 在和飞书同步时，不再需要使用代理服务器
- 更新了[[ObFetchAirtable.js]]
    - 增加了更新API Key过期时的判断功能
- 更新了[[IOTO-OBFetchIOTOUpdates]]
    - 加入IOTO更新判断参数
    - 取消更新时，不再跳转到帮助页面

### 如果你之前没有用过OB和飞书多维表的同步功能，可以参考下面的视频进行学习

#### 第一 自建飞书应用并绑定到指定的多维表

请根据自己使用的飞书版本选择对应的视频

##### **飞书个人版**

> 录制：如何在飞书自建企业应用并绑定到指定的多维表（飞书个人版）
> 日期：2024-06-06 16:40:36
> 录制文件： <https://meeting.tencent.com/crm/KWa7GyJN1c>

##### **飞书企业版**

> 录制：如何在飞书自建企业应用并绑定到指定的多维表（飞书企业版）
> 日期：2024-06-06 16:52:41
> 录制文件： <https://meeting.tencent.com/crm/KngQ5pn2e9>

注意：在根据视频内容把所建应用绑定到飞书多维表时，**如果使用编辑权限有问题，可以修改成管理权限**

#### 第二 你就可以根据下面的同步指南，去使用Obsidian和飞书同步的公共版本了。

> 录制：OB与飞书同步公共版使用指南.mp4
> 日期：2024-08-02 17:09:22
> 录制文件：<https://meeting.tencent.com/crm/KDnA6npN72>

注意：视频中使用的是去年开发的公共版同步脚本，你的IOTO中已经有最新版的脚本了，不需要使用那个版本

> 视频中使用的飞书多维表模板：
> [https://johnnylearns.feishu.cn/base/PLrqbt8THahrV0sAJfncZuFmntb?from=from_copylink](https://johnnylearns.feishu.cn/base/PLrqbt8THahrV0sAJfncZuFmntb?from=from_copylink)

## 1.8.0版 更新于2025年4月11日

- 具体更新的内容请查看[这个视频](https://meeting.tencent.com/crm/N1Aadjyr0d)

## 1.7.0版 更新于2025年2月7日

- 具体更新请参考[这个视频](https://meeting.tencent.com/crm/2Z0b98kd7c)

## 1.6.0版 更新于2025年1月27日

- 对OB和多维表的同步脚本进行了更新
    - 增加同步项
        - 同步当前笔记中的链接到多维表
    - 同步脚本的设置更新
        - 可以指定同步不同的文件夹到不同Base下的Table
        - 可以设置某个文件夹的同步模式为使用title同步（默认是使用id同步）
        - 可以选择是否同步某个文件夹下的笔记的Content到多维表
        - 可以设置文件夹只从多维表更新数据

## 1.5.3版（微更新）  更新于2024年9月25日

[更新演示链接](https://meeting.tencent.com/crm/NoxzQ4Ol9c)

- 重构了要点提取辅助功能
    - 将`IOTOStrongToList.js`重命名成`IOTOExtractKeyPoints.js`
    - 如果你使用IOTO框架的自动更新，原有的`IOTOStrongToList.js`文件不会被删除，会新建一个`IOTOExtractKeyPoints.js`文件
    - 这个文件保留也不影响使用，但如果你想删除的话，需要你手动去删除
- MyIOTO中的`IOTO-提取要点`这个模板的内容也做了修改
    - 首先去调用新的`IOTOExtractKeyPoints`方法
    - 然后增加了是把提取内容放入到当前笔记，还是放入到新创建的笔记中的选项
- 在你更新了MyIOTO的模板后，你需要手动把`MyIOTO-1-5-3/辅助工具/IOTO-提取要点`移动到你自己的MyIOTO模板文件夹下对应的位置

## 1.5.3版  更新于2024年9月23日

[更新演示链接](https://meeting.tencent.com/crm/KW5vYo7Ndd)

- 优化统计结果的显示速度
- 在没有选择项目时，不再进行统计
    - 这么处理是为了避免当笔记和任务过多时，结果渲染的太慢从而导致OB卡死的现象
        - 以后会使用更优化的方式来解决这个问题，目前这个是权宜之计
- 添加了适当的报错和无结果提示信息
- 在输入、输出、成果和IOO综合统计面板中加入以下控制属性
    - `sort`用来控制结果中笔记按照创建日期的排序
        - 可以使用的值有`正序`和`倒序`
        - 如果值为空，则默认为`正序`
    - `taskStatus`用的控制结果中显示什么状态的任务
        - 可以使用的值有`已完成`和`未完成`
        - 如果值为空，在两种状态的任务都会显示

## 1.5.2版 （微更新）更新于2024年9月13日

- 增加一个Excalidraw的视觉卡片模板[[My-IOTO-ExCard]]
- 在创建Excalidraw文件时，不再添加`.excalidraw`后缀

## 1.5.2版 更新于2024年4月27日

[IOTO1.5.2版更新演示视频](https://meeting.tencent.com/crm/9KPXgpmKf5)

## 1.5.1版 更新于2024年4月10日

> 1.5.1版本已经包含了1.5.1-Pre中的更新

> [!NOTE]+ IOTO框架 1.5.1版主要更新内容
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/选择器模板/My-TP-选择器-创建输出.md`
>    - 增加了自动添加到对应的项目TDL的设置
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/选择器模板/My-TP-选择器-创建输入.md`
>    - 增加了自动添加到对应的项目TDL的设置
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/选择器模板/My-TP-选择器-创建成果.md`
>    - 增加了自动添加到对应的项目TDL的设置，添加了默认成果文件夹下的项目文件夹的子文件夹设置
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/笔记模板/Output笔记模板/My-TP-输出-卡片笔记.md`
>    - 增加了Project属性的获取代码
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/笔记模板/Input笔记模板/My-TP-输入-碎片笔记.md`
>    - 增加了Project属性的获取代码
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/快速笔记/My-TP-Quick-Note-碎片笔记.md`
>    - 增加了自动添加到对应的项目TDL的设置
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/快速笔记/My-TP-Quick-Note-卡片笔记.md`
>    - 增加了自动添加到对应的项目TDL的设置

## 1.5.1-Pre版 更新于2024年4月4日

> [!NOTE]+ IOTO框架 1.5.1-Pre版主要更新内容
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/笔记模板/Output笔记模板/My-TP-输出-闪念笔记.md`
>    - 更新以周为单位的闪念笔记的默认模板
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/MyIOTO/选择器模板/My-TP-选择器-创建输出.md`
>    - 增加闪念笔记相关的设置项，可以设置闪念笔记的前缀和日期格式
> - **修改文件**：`0-辅助/IOTO/Scripts/IOTOCreateOrOpenNote.js`
>    - 增加闪念笔记日期格式的控制逻辑
> - **修改文件**：`0-辅助/IOTO/Dataview/Views/MovieTimes/view.js`
>    - 修改电影时间的控制逻辑，修复任务列表点击后状态不同步的问题
> - _增加文件_：`0-辅助/IOTO/Dataview/Views/OldMovieTimes/view.js`
>    - 增加旧的电影时间控制文件，修复任务列表点击后状态不同步的问题
> - **修改文件**：`0-辅助/IOTO/Dataview/Views/TasksList/view.js`
>    - 修复任务列表点击后状态不同步的问题
> - **修改文件**：`0-辅助/IOTO/Dashboard/Task-Dashboard.md`
>    - 增加groupList的设置，去控制任务列表是否按照文件分组
> - **修改文件**：`0-辅助/IOTO/Scripts/ObSyncAirtable.js`
>    - 增加onlyFetchFromNocoDB的返回值，用来做进一步的判断控制
> - **修改文件**：`0-辅助/IOTO/Templates/Templater/OBIOTO/IOTO同步模板/IOTO-OBFetchIOTOUpdates.md`
>    - 增加更新后打开指定文件的功能

## 1.5.0版 更新于2024年3月15日

> [!NOTE]+ IOTO框架 1.5.0版主要更新内容
> 
> ### 数据统计层更新
> - 【功能】修改电影时间的统计方式
> 	- 修改JS脚本[[0-辅助/IOTO/Dataview/Views/MovieTimes/view.js|view]]
> 	- 只要是添加了电影标签的未完成任务，都会显示在当天未完成的任务
> 	- 不加电影标签的任务，不管在什么文件里，都不会显示在电影时间
> - 【功能】增加未安排工作的任务统计
> 	- 增加JS脚本[[0-辅助/IOTO/Dataview/Views/TasksList/view.js|view]]
> 	- 这个脚本会按照未完成任务的类型去统计未完成的任务
> - 【功能】增加数据统计面板的排序设置
> 
> ### 样式修改
> - 修改任务日历的表格宽度控制
> - 更新了[[hideProperties.css]]
> 
> ### 相关更新视频
> - [IOTO知识管理框架开箱视频与升级指南_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1cx421k71H/)

## 1.4.10版 更新于2023年12月1日

> [!NOTE]+ IOTO框架 1.4.10版主要更新内容
> 
> ### 模板自动化层更新
> - 【功能】创建任务列表时，可以选择是否提供一个自定义的名字。
> 	- 修改脚本[[IOTOCreateTasksList.js]]
> 	- 如何使用：
> 		- 在[[My-TP-选择器-创建任务]]中，提供了一个新的设置项`useCustomTDLName`，如果你把这个设置项的值改为`true`，那么你每次创建任务列表的时候，都会弹出一个输入框，让你去输入你的自定义任务列表名字。
>  
> ### 辅助工具更新
> - 【功能】在**提取要点**工具中增加提取下划线内容的选项。
> 	- 修改脚本[[IOTOStrongToList.js]]
> 	- 如何使用：
> 		- 在你的笔记中你需要使用`<u></u>`这一组HTML标签去指定下划线内容，比如<u>这样</u>。
> - 【功能】在**批量添加BlockID**工具中增加使用两个换行符作为分隔符的选项。
> 	- 修改脚本[[IOTOAddBlockIDs.js]]
> 	- 修改了[[0-辅助/IOTO/Templates/Templater/MyIOTO/辅助工具/IOTO-添加区块ID|IOTO-添加区块ID]]中的设置方式
> 	- 如何使用：
> 		- 如果你需要使用两个换行符作为区块的分隔符，在你[[0-辅助/IOTO/Templates/Templater/MyIOTO/辅助工具/IOTO-添加区块ID|IOTO-添加区块ID]]中，你需要把`useSingleLineAsSeperator`的设置项的值改为`false`。

## 1.4.9版  更新于2023年10月18日

> [!NOTE]+ IOTO框架 1.4.9版主要更新内容
> 
> ### 数据同步层更新
> - 【功能】支持从在线数据库同步标签到OB
> 	- 从数据库同步标签时可以在[[My-TP-OBSyncAirtable]]或[[My-TP-OBSyncVika]]中设置是否在Frontmatter中显示笔记内容区的标签
> 	- 增加的设置属性是`includesTagsInContent`，该属性默认值是`fasle`，即不在Frontmatter中显示笔记内容区的标签
> 		- 修改模板[[My-TP-OBSyncAirtable]]，[[IOTO-OBSyncAirtable]]
> 		- 修改模板[[My-TP-OBSyncVika]]，[[IOTO-OBSyncVika]]
> - 【Bug解决】当属性值是Obsidian链接时，更新后会保留属性中的引号
> 
> ### 数据看板层更新
> - 【功能】增加标签过滤功能
> - 【功能】在Search中搜索的关键词也会去搜索任务所在的文件路径中的关键词
> - 【功能】增加Dashboard中属性布局的控制CSS
> 	- 默认添加`dashboard`样式类时，属性面板将使用6栏布局
> 	- 如果由于电脑屏幕或者布局的限制，你可以添加下列额外的CSS样式类来进行栏数的控制
> 		- `db-2c` 显示为两栏
> 		- `db-3c` 显示为三栏
> 		- `db-4c` 显示为四栏
> 		- `db-5c` 显示为五栏
> 	- 修改样式文件 [[dashboard.css]]
> - 【UI优化】使用Callouts来呈现数据看板中的内容，隐藏嵌入的文件标题
> - 【注意】你需要自己手动更新IOTO框架中的CSS Snippets到自己的`.obsidian/snippets`文件夹
> 
> ### 模板自动化层更新
> - 【功能】创建任务列表时，自动在新便签打开该任务列表
> 	- 修改脚本 [[IOTOCreateTasksList.js]]
> 
> ### 辅助工具更新
> - 【功能】增加**要点提取**工具，可以提取笔记中的加粗、斜体和高亮为列表
> 	- 增加脚本[[IOTOStrongToList.js]]
> - 【功能】增加**批量添加BlockID**工具，可以为指定的笔记批量添加指定格式的BlockID
> 	- 增加脚本[[IOTOAddBlockIDs.js]]
> - 【设置】辅助工具脚本可以在`MyIOTO/辅助工具`下进行自定义设置，可以自行增减
> 	- 修改模板[[IOTO-选择器-辅助工具]]
> - 【Bug解决】当属性值是Obsidian链接时，更新后会保留属性中的引号

## 1.4.8版 更新于2023年9月28日

> [!NOTE]+ IOTO框架 1.4.8版主要更新内容
> 
> ### 重要更新
> - 从这一版开始，IOTO支持在Obsidian中使用命令进行一键更新。
> - 启动库中默认的更新快捷键是`Alt(Option)+Shift+H`
> - 你可以选择3种更新方式
> 	- 只更新帮助文档
> 	- 只更新IOTO核心文件
> 	- 只更新MyIOTO下的模板文件
>  
>  ### 如果你已经在使用1.4.7版的IOTO，这次你想手动更新的话，你只需要按照以下步骤操作：
>  - 首先，用1.4.8版的启动库中的[[ObSyncAirtable.js]]文件覆盖你自己库中的同一文件。
>  - 然后，把1.4.8版启动库中[[IOTO-OBFetchIOTOUpdates]]模板文件放入你的IOTO框架下的`Templates\Templater\OBIOTO\IOTO同步模板`文件夹下
>  - 接着，你可以直接使用Templater的插入模板命令，或者先去给这个模板设置快捷键，去运行这个模板，选择你需要更新的内容即可。（建议你只更新帮助文档和IOTO核心文件）
>  
>  ### 其他主要更新内容
>  - 更新了Dataview文件夹下各个view.js使用的日期格式为ISO模式，从而更好的支持不同电脑平台。
>  - 更新了[[IOTOCreateTasksList.js]]中的单一任务模式下对自定义时间戳的支持。
>  - 在帮助文档中加入了每一次直播的腾讯会议回放链接。

## 1.4.7版 更新于2023年9月22日

> [!NOTE]+ IOTO框架 1.4.7版主要更新内容
> 
> ### 重要更新
> - 由于IOTO设置插件的ID从`ioto-setting`改成了`ioto-settings`, 原来库中使用到插件设置的文件全部都有更新。
> 
> ### 框架文件结构更新
> - `IOTO\Templates\Templater`下的文件结构进行调整
> - 具体请参考[[IOTO框架中Templater模板结构的调整]]
> 
> ### IOTO设置插件更新
> - 启动库中插件更新到`1.0.3`版
> - 建议删除之前的版本，重新复制安装新版的设置插件。
> 
> ### 数据看板更新
> - [[Task-Dashboard]]中的电影时间标签从IOTO设置插件中获取，不再直接写入此文件
> 
> ### IOTO框架帮助文件更新
> - 新增以下帮助文件
> 	- [[如何获取IOTO最新的帮助文档]]
> 	- [[如何设置自己的IOTO笔记模板]]
> 	- [[如何修改今日工作安排中Movie Time所使用的标签]]
> 	- [[IOTO框架中Templater模板结构的调整]]
>  
>  ### MyIOTO下的模板更新
>  - [[My-TP-成果-创建成果笔记]]中增加`Status`属性，默认值是`未完成`
>   
>  ### OBIOTO下的模板更新
>  - 增加[[IOTO-OBFetchIOTOUpdates]]文件
> 	 - 注意，请不要修改这个文件的内容
> 	 - 这个文件的默认触发快捷键是`Alt+Shift+H`或者`Opt+Shift+H`。
