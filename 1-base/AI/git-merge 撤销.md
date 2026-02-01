---
Project:
  - Unitychip
description:
tags:
  - git
parent: Resource
area: "[[工作]]"
---
# AI

## 想要撤销本次merge
```
### 方案 A：完成这次合并（推荐）

如果你已经手动解决了代码冲突，并且想保留这些合并后的修改，只需完成提交即可：

1. **提交合并结果：**
    
    Bash
    
    ```
    git commit -m "Merge branch 'origin/main' and fix conflicts"
    ```
    
    _注意：此时不需要加具体文件名，Git 会自动处理。_
    
2. **再次尝试拉取：**
    
    Bash
    
    ```
    git pull
    ```
    

---

### 方案 B：放弃这次合并（回到合并前的状态）

如果你觉得这次合并搞乱了，或者想重头来过，可以强制中止合并：

1. **中止合并：**
    
    Bash
    
    ```
    git merge --abort
    ```
    
    _执行后，你的代码会回到 `git pull` 之前的状态。_
    
2. **清理环境后重试：** 然后再尝试 `git pull`。
```