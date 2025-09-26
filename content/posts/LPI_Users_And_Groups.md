---
title: "LPI || Users and groups"
date: 1999-09-22
description: Reading CH 8 of the linux programming interface book
type: "post"
tags: ["linux", "unix", "commands", "how-to", "technology", "explain-like-i'm-five", "hacks", "security", "LPI"]
---

Below is a summary and a writeup on [Linux programming interface](https://github.com/lancetw/ebook-1/blob/master/01_programming/The%20Linux%20Programming%20Interface.pdf) by Michael KerrisK, which I’ll be using as a reference. I’m currently studying Android reverse engineering, and to understand sandboxing and permissions properly, I need a deeper grasp of Linux user management.

## Users and groups

For each user there's a unique login name and a numeric user identifier (UID). Users can belong to one or more groups. Each group also has a unique name and an identifier (GID). User and group IDs define ownership of various system resources and control the permissions granted to processes accessing those resources. 
<br><br>
For example, each file belongs to a particular user and group, and each process has a number of user and group IDs that determine who owns the process and what permissions it has when accessing a file. 
<br><br>
This sounds trivial but how does it translate in practice?

## The Password File: /etc/passwd
<br><br>
![A snippet of the file /etc/passwd showing the users ](/svg/assets/etcpasswd.svg "A snippet of the file /etc/passwd showing the users")
<br><br>

The password file is located in /etc/passwd, and contains one line for each user account, each line is composed of seven fields separated by colons (:), as in the following example:

```
<login name>:<Password hash placeholder>:<UID>:<GID>:<Comment>:<HOME Directory>:<login shell>
```

<br><br>
Below are the fields explained:

+ Login name : The unique name for the user, duh.
Login name: Unique username for the account.
+ Password hash placeholder: If shadow passwords are used, this is x (the actual hash is in /etc/shadow). Otherwise, it contains the hashed password. Special values like * or ! disable login.+ UID : Unique user ID, if it's 0 then the user has super privilages.
+ GID : The ID of the first of the groups of which this user is a member. Further group memberships for this user are defined in the system group file.
+ HOME Directory : The directory where the user is placed once they log in, this becomes the value for $HOME.
+ Login shell : The shell where the user is transferred to once they log in, this becomes the value for $SHELL.

## The Password File: /etc/passwd
<br><br>
![A snippet of the file /etc/shadow ](/images/shadow.gif "A snippet of the file /etc/shadow showing the users")
<br><br>

Historically, /etc/passwd contained all user account information, including password hashes. Because /etc/passwd is world-readable, this exposed password hashes to all users, making password cracking attempts feasible. To mitigate this, /etc/shadow was introduced to store password hashes securely, accessible only by the root user, while /etc/passwd retained only non-sensitive account information needed for system operations.