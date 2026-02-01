---
Project:
  - Unitychip
tags:
  - git
area: "[[工作]]"
---

Git 的撤销操作取决于你的修改处于哪个“阶段”。在 Git 中，文件通常经历：**工作区 (Working Directory)** -> **暂存区 (Index/Stage)** -> **版本库 (Commit)**。

以下是针对不同场景的解决方案：

---

### 1. 撤销工作区的修改（还没 `git add`）

如果你改乱了代码，想恢复到和上次提交（或暂存区）一模一样的状态：

- **撤销单个文件：**
    
    Bash
    
    ```
    git checkout -- <文件名>
    # 或者使用新版命令
    git restore <文件名>
    ```
    
- **撤销所有修改：**
    
    Bash
    
    ```
    git checkout .
    # 或者
    git restore .
    ```
    

---

### 2. 撤销暂存区的修改（已经 `git add`，还没 `commit`）

如果你已经执行了 `add`，想把它撤回成“待提交”的状态：

- **将文件从暂存区移回工作区：**
    
    Bash
    
    ```
    git reset HEAD <文件名>
    # 或者使用新版命令
    git restore --staged <文件名>
    ```
    
    _执行后，你的修改还在，只是不再处于“准备提交”的状态了。_
    

---

### 3. 撤销版本库的提交（已经 `git commit`，还没 `push`）

如果你提交后发现漏了文件或信息写错了：

- **修改最后一次提交消息（或补提交文件）：**
    
    Bash
    
    ```
    git commit --amend
    ```
    
- **完全撤销最后一次提交：**
    
    - **保留代码修改：**（撤销 commit，代码回到暂存区）
        
        Bash
        
        ```
        git reset --soft HEAD~1
        ```
        
    - **完全回滚：**（撤销 commit 和代码修改，**慎用！**）
        
        Bash
        
        ```
        git reset --hard HEAD~1
        ```
        

---

### 4. 撤销已经 `push` 的提交

如果你代码已经推送到远程仓库（如之前的 `myrepo`），为了不破坏他人的提交历史，建议使用 `revert`：

- **生成一个新的“反向提交”来抵消错误：**
    
    Bash
    
    ```
    git revert <commit_id>
    git push myrepo <分支名>
    ```
    
    _这种方式最安全，因为它不会修改历史，只是新增了一个撤销的操作。_