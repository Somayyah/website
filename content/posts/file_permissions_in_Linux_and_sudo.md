---
title: "Linux permissions for files and Directories"
date: 1995-01-15
description:  
type: "post"
tags: ["linux", "unix", "commands", "how-to", "technology", "operating systems", "kernel"]
---

Linux permissions are supposed to be straight forward however there are some nuances that come into play. In this post, I will dive deeper into how to set these permissions and how they differ between users, groups, files and directories, and what to take into consideration.

## Introduction

### How Are Permissions Represented in Linux

**skip if you're already familiar with linux permissions and how they're set up**

Every file or directory has a set of permissions that can be viewed via a simple ls:

```bash
> ls -l

17 DESKTOP in HOME
-rwxr-xr-x 1 root root        14640 Mar 31  2024 411toppm
-rwxr-xr-x 1 root root           38 Apr 11  2024 7z
-rwxr-xr-x 1 root root           39 Apr 11  2024 7za

```

Permissions are shown as a string of characters at the start of the listing. The first character indicates the type of file or directory (- for a regular file, d for a directory, etc.), and the remaining characters are grouped in threes, representing access for owner, group, and others, in that order.

- r : read permissions
- w : write permissions
- x : execute permissions
- "-" : No permission

so "rwx" means that the file has read, write and execute, meanwhile "r-x" means it has read and execute permissions only. Permissions are grouped into three sets for user, group and others, so "-rwx--xrw-" means:

- user permissions are "rwx", read, write and execute.
- group permissions are "--x", only execute.
- other users permissions are "rw-", read and write.

### How To Change Linux Permissions

We change the permissions using the command [chmod](https://linuxize.com/post/chmod-command-in-linux/)

