---
title: "LFS Diaries - 4 follow-up || Chapter 3 Packages Install Issues"
date: 2025-02-09  
description: Chapter 3, Summary of Install issues I encountered
type: "post"  
tags: ["linux", "unix", "commands", "how-to", "technology", "lfs", "operating systems", "kernel"]
---

> Rest of the LFS posts can be viewed [**here**](https://techwebunraveled.xyz/tags/lfs/).

Below are the packages that I installed and the issues I faced:

## Glibc

### Error # 1 

```bash
## configure: error: you must configure in a separate build directory
## Solution: 
cd /mnt/LFS/sources/glibc-2.40
# Create separate build directory
mkdir glibc-build && cd "$_"
# Configure with the correct prefix
../configure --prefix=/mnt/LFS/usr/include && make && make install
```
### Error # 2

```bash
### Reading this error
    # wctomb.c:57:1: error: ‘artificial’ attribute ignored [-Werror=attributes]
    # 57 | libc_hidden_def (wctomb)
###
# Use the option --disable-werror
../configure --prefix=/mnt/LFS/usr \
             --disable-werror \
             --with-headers=$LFS/usr/include
```

## Automake

```bash
### Reading this error
    #   checking whether autoconf is installed... no
    #   configure: error: Autoconf 2.65 or better is required.
    #   Please make sure it is installed and in your PATH.
###
# Update the $PATH variable before configuring
export PATH=$PATH:/mnt/LFS/usr/bin
```