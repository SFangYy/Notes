---
Project:
  - LearnTools
title: act
description: 
source: 
author: 
tags:
  - linux
created: 2025-07-07 | 10:54
parent: Resource
branch:
---
# QuickNotes
act is a debug github ci tools in your local device ,it can provide github ci env and function in its images 
- arg
	- `-W ` the ci file you want to run
	- `-P` the docker images you want to use,but it also use remote first
	- `--pull=flase` this arg is used to disable pull images from remote

```
act --pull=false -W .github/workflows/release_pdb1.yml -P ubuntu-latest=pdb-env:latest
```


