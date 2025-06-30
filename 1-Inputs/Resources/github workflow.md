---
Project: ["BuildPdb"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-06-30 | 11:15
parent: Resource
branch: 
---
# Resources

a example workflow yaml
- the function of actions/checkout@v4
      # 這個步驟會將你的整個 GitHub 倉庫克隆到 runner 的 `/home/runner/work/<你的倉庫名>/<你的倉庫名>` 目錄下
      # 注意：這個是 GitHub Actions runner 的初始目錄，和 Docker 鏡像的 WORKDIR 是不同的概念
```
name: 執行 Script 目錄下的 Makefile

on:
  push:
    branches:
      - main # 當推送到 main 分支時觸發，你可以修改為其他分支

jobs:
  build:
    runs-on: ubuntu-latest # 運行環境

    steps:
    - name: 檢查程式碼
      uses: actions/checkout@v4

    - name: 進入倉庫的 script 目錄並執行 makefile
      # 因為 Docker 鏡像的 WORKDIR 已經是 /workspace，所以我們會在 /workspace 中找到被 checkout 的倉庫程式碼
      # GitHub Actions 會將你的倉庫內容克隆到 /workspace/<你的倉庫名> 路徑下 (這是當你設定了 WORKDIR 的情況下)
      run: |
        # 假設你的倉庫名稱是 'my-repo'，checkout 後程式碼會在 /workspace/my-repo
        # 然後你再進入裡面的 script 目錄
        cd ./<你的倉庫名稱>/script # 請將 <你的倉庫名稱> 替換為你的實際倉庫名稱
        make # 執行 makefile 的默認目標
        # 如果你的 makefile 有特定目標，例如 'clean' 或 'build'
        # 你可以這樣執行：make build
```

## upload file
### put in release

```
name: 執行 Script 目錄下的 Makefile 並發布 Release

on:
  push:
    branches:
      - main # 當推送到 main 分支時觸發，你可以修改為其他分支
  release:
    types: [published] # 也可以設定為當你手動發布一個 Release 時觸發

jobs:
  build_and_release:
    runs-on: ubuntu-latest # 運行環境

	...
	
    - name: 創建 GitHub Release 並上傳資產
      uses: softprops/action-gh-release@v1 # 使用 softprops/action-gh-release Action
      if: startsWith(github.ref, 'refs/tags/') # 僅當推送到一個 tag 時才創建 Release
      with:
        files: |
          ./<你的倉庫名稱>/script/dist/my-artifact.tar.gz # 請替換為你的 .tar.gz 檔案的實際路徑和名稱
        name: Release ${{ github.ref_name }} # Release 的名稱，通常使用 tag 名稱
        tag_name: ${{ github.ref_name }} # Release 的 Tag 名稱
        body: | # Release 的描述
          此 Release 包含由 CI 自動生成的構建產物。
          Tag: ${{ github.ref_name }}
        draft: false # 是否為草稿 Release
        prerelease: false # 是否為預發布 Release
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # GitHub 自動提供的 token，用於認證
```
### use upload artifact
```
name: 執行 Makefile 並上傳構建產物

on:
  push:
    branches:
      - main # 當推送到 main 分支時觸發，你可以修改為其他分支

jobs:
  build_and_upload:
	
	...
	
    - name: 上傳構建產物
      uses: actions/upload-artifact@v4 # 使用 actions/upload-artifact Action
      with:
        name: my-build-artifact-${{ github.sha }} # 上傳產物的名稱，建議包含提交 SHA 確保唯一性
        path: ./<你的倉庫名稱>/script/dist/my-artifact.tar.gz # 要上傳的 .tar.gz 檔案的路徑
        retention-days: 7 # 產物將保留的天數，預設是 90 天，這裡設定為 7 天以節省空間
```

