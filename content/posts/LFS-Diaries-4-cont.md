---
title: "LFS Diaries - 4 follow-up || Chapter 3 Packages Install Issues"
date: 2025-02-09  
description: Chapter 3, Summary of Install issues I encountered
type: "post"  
tags: ["linux", "unix", "commands", "how-to", "technology", "lfs", "operating systems", "kernel"]
---

> Rest of the LFS posts can be viewed [**here**](https://techwebunraveled.xyz/tags/lfs/).

Below are the packages that I installed and the issues I faced:

### Glibc

Encountered the error:

**configure: error: you must configure in a separate build directory**

**Solution **

```
cd /mnt/LFS/sources/glibc-2.40
# Create separate build directory
mkdir glibc-build && cd "$_"
# Configure
../configure --prefix=/mnt/LFS/glibc-2.40/glibc-build && make && make install
```
