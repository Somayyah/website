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

We change the permissions using the command [chmod](https://linuxize.com/post/chmod-command-in-linux/) which uses two types of notations:

- Octal notation : Where each permission, read, write and execute is given a value, and the total permissions are the summation of these values, so "rwx" is 7, because "r" + "w" + "x" = 4 + 2 + 1 = 7, similarly:

"r-x" = 4 + 0 + 1 = 5

"--x" = 0 + 0 + 1 = 1

and so on. Each set of permissions are written in this order : user, group, other. Consider the below file:

```bash
○ → ls -l logs
-rw-r--r-- 1 watari watari 0 Oct 12 17:06 logs
```

We notice that it has read permissions to all users, but write permissions only for the owner. In octal notations this would be:

    - User : "rw-" = 4 + 2 + 0 = 3
    - Group : "r--" = 4 + 0 + 0 = 4
    - Other : "r--" = 4 + 0 + 0 = 4
    
To give the full permissions "rwx" for everyone, we will use 7 because "rwx" = 4 + 2 + 1 = 7. So chmod command can be used as below:

```bash
○ → chmod 777 logs

○ → ls -l logs
-rwxrwxrwx 1 watari watari 0 Oct 12 17:06 logs
```

Here we supplied 3 sets of permissions where the user, group and other take 7 as the value.

- Symbolic Notation, as below:
    - "u", "g", "o", "a" : To represent user, group other and "all".
    - "+" to give permissions, "-" to remove permissions, "=" to set permissions.
    - "r" for read, "w", for write permissions, and "x" for execute.

    Together the chmod command will be like this:

    ```bash
    chmod [uago]+[+-=]{1}[rwx]+ file
    ```

    For example below file has all permissions for everyone:

    ```bash
    ○ → ls -l logs
    -rwxrwxrwx 1 watari watari 0 Oct 12 17:06 logs
    ```

    And everyone has "rwx", to remove the read permissions for the user:

    ```bash
    ○ → chmod u-r logs

    ○ → ls -l logs
    --wxrwxrwx 1 watari watari 0 Oct 12 17:06 logs
    ```
    
    To remove the execute permissions from everyone:
    
    ```bash
    ○ → chmod a-x logs

    ○ → ls -l logs
    -rw-rw-rw- 1 watari watari 0 Oct 12 17:06 logs
    ```

    We can also chain permissions together, so if I want to give execute permissions for the user, and remove the write from everyone:

    ```bash
    ○ → chmod u+x,a-w logs

    ○ → ls -l logs
    -r-xr--r-- 1 watari watari 0 Oct 12 17:06 logs

    ```

## What does it mean to execute a file or a directory?

Executing a file is straight forward, here I have a simple python script:

```python3
○ → cat test.py
#!/usr/bin/env python3

print("Hello, World!!")
```

I can't run it right away because I don't have the execute permissions yet:

```bash
○ → ls -l test.py
-rw-r--r-- 1 watari watari 48 Dec 21 10:36 test.py

○ → ./test.py
-bash: ./test.py: Permission denied
```

After adding x permissions to the owner:

```
○ → chmod u+x test.py

○ → ./test.py
Hello, World!!

○ → ls -l test.py
-rwxr--r-- 1 watari watari 48 Dec 21 10:36 test.py
```
