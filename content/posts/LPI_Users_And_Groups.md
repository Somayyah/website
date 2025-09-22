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
<login name>:<encrypted password>:<UID>:<GID>:<Comment>:<HOME Directory>:<login shell>

```

<br><br>
Below are the fields explained:

+ Login name : The unique name for the user, duh.
+ encrypted password : a 13 characters encrypted password, if shadowed passwords are used then it's presented as x. If the password field contains any other string or a string of other characters then the login to this user is disabled.
+ UID : Unique user ID, if it's 0 then the user has super privilages.
+ GID : The ID of the first of the groups of which this user is a member. Further group memberships for this user are defined in the system group file.
+ HOME Directory : The directory where the user is placed once they log in, this becomes the value for $HOME.
+ Login shell : The shell where the user is transferred to once they log in, this becomes the value for $SHELL.