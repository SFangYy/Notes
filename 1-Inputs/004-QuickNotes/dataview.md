---
Project:
  - LearnIOTO
description:
tags:
  - IOTO
created: 2025-07-30 | 02:10
parent: Resource
---
# QuickNotes
# 基础用法

```dataview1
TASK
FROM "2-Areas/009-daily/2025-07-28"
WHERE contains(tags, "#IOTO")
```
- 显示结果
```dataview
TASK
FROM "2-Areas/009-daily/2025-07-29"
WHERE contains(tags, "#IOTO")
```

```dataview1
TASK
FROM "2-Areas/009-daily"
WHERE contains(tags, "#IOTO") AND file.day >= date(2025-07-01) AND file.day <= date(2025-07-30)
GROUP BY file.link
```
