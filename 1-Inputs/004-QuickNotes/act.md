---
Project:
  - LearnTools
description:
tags:
  - linux
  - command
created: 2025-07-07 | 10:54
parent: Resource
---
# QuickNotes
act is a debug github ci tools in your local device ,it can provide github ci env and function in its images 
- arg
	- `-W ` the ci file you want to run
	- `-P` the docker images you want to use,but it also use remote first
		- replace runs-on content
	- `--pull=flase` this arg is used to disable pull images from remote

```
act --pull=false -W .github/workflows/release_pdb1.yml -P bosc=hcr.io/openxiangshan/xspdb:build-latest --network host

```


## ci example
```
name: Release XSPdb Jobs
on:
  pull_request:
    branches: [master]
    # types: [closed]
jobs:
  build-xspdb:
    runs-on: bosc
    # if: github.event.pull_request.merged == true
    #container: ghcr.io/openxiangshan/xspdb:build-latest

```


## docker image
`docker images`
```

```