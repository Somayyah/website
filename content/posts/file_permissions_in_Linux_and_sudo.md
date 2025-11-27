---
title: "Linux permissions for files and Directories"
date: 1995-01-15
description:  
type: "post"
tags: ["linux", "unix", "commands", "how-to", "technology", "operating systems", "kernel"]
---

Linux permissions are supposed to be straight forward however there are some nuances that come into play. In this post, I will dive deeper into how to set these permissions and how they differ between users, groups, files and directories, and what to take into consideration.

## Introduction

Every file or directory has a set of permissions that can be viewed via a simple ls:

```bash
17 DESKTOP in HOME
-rwxr-xr-x 1 root root        14640 Mar 31  2024 411toppm
-rwxr-xr-x 1 root root           38 Apr 11  2024 7z
-rwxr-xr-x 1 root root           39 Apr 11  2024 7za

```


