---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-04 | 22:44
parent: Resource
---
1. 使用缓存
2. 在使用环境变量配置文件名时中间不要有空格
3. github自身的脚本 


```
$(git rev-parse --short HEAD)
${{ github.event.head_commit.message }}
```



# 004-QuickNotes
```
name: Release Jobs

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build-xspdb:
    runs-on: ubuntu-latest
    permissions:
      contents: read  # 用于代码检出
      packages: write # 如果需要发布包
    #runs-on: bosc
    container: ghcr.io/xs-mlvp/envfull:latest
    steps:
      - uses: actions/checkout@v4
      - name: set env
        run: |
          echo "NOOP_HOME=$GITHUB_WORKSPACE" >> $GITHUB_ENV
      # - name: submodule init
      #   run: make init
      # - name: setup mill
      #   uses: jodersky/setup-mill@v0.3.0
      #   with:
      #     mill-version: 0.12.3
      - name: build XSPdb
        run: |
          mkdir test
      - name: upload XiangShan binary
        uses: actions/cache@v3
        with:
          key: build-xspdb
          path: build/xspdb/
          restore-keys: |
            build-xspdb
  release-xspdb:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    if: github.event.pull_request.merged == true
    container: ghcr.io/openxiangshan/xspdb:build-latest
    steps:
      - uses: actions/checkout@v4
      - name: set env
        run: |
          echo "NOOP_HOME=$GITHUB_WORKSPACE" >> $GITHUB_ENV
          echo "PDB_HOME=${GITHUB_WORKSPACE}/build/xspdb" >> $GITHUB_ENV
          FILE_TIME=$(date +%Y%m)
          FILE_SHA=$(git rev-parse --short HEAD)
          FILE_NAME=" ${{env.PDB_HOME}}/XSPdb-${FILE_TIME}-${FILE_SHA}.tar.bz2"
          echo "FILE_NAME=XSPdb-${FILE_TIME}-${FILE_SHA}.tar.bz2" >> $GITHUB_ENV
      - name: download XiangShan binary
        uses: actions/cache@v3
        with:
          key: build-xspdb
          path: build/xspdb 
      - name: archive XSPdb
        run: |
          ls build/xspdb
          #make package-pdb
          mkdir -p build/xspdb/XSPdb
          make package-pdb
          ls ${PDB_HOME}
          mv ${PDB_HOME}/XSPdb.tar.bz2 "${{ env.PDB_HOME }}/${{ env.FILE_NAME }}"
          ls build/xspdb/
          
      - name: create gitHub release
        uses: softprops/action-gh-release@v2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          tag_name: release-${{ github.sha }}
          name: Release ${{ env.FILE_NAME }}
          body: |
            ${{ github.event.head_commit.message }}
            Commit: `${{ github.sha }}`
          files: build/xspdb/${{ env.FILE_NAME }}
          prerelease: false
```


