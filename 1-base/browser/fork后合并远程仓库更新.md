---
Project: ["XSPdb"]
---
# browser
```
git remote add upstream https://github.com/OpenXiangShan/XiangShan.git

songfangyuan:~/work/pdb/202512/XiangShan$ git remote -v
origin  git@github.com:SFangYy/XiangShan.git (fetch)
origin  git@github.com:SFangYy/XiangShan.git (push)
upstream        https://github.com/OpenXiangShan/XiangShan.git (fetch)
upstream        https://github.com/OpenXiangShan/XiangShan.git (push)

git fetch upstream


```
- 合并到master分支
```
git rebase upstream/master
```

- 将远程仓库的其他分支放到我的仓库

```
git checkout --track upstream/fix-difftop
```