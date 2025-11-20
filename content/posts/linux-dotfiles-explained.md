---
title: "Linux Dotfiles Explained"
date: 1995-01-15
description:
type: "post"
tags: ["linux", "bash", "dotfiles", "how-to"]
---

As a Linux user, you’ve probably come across dotfiles. They're named for the dot at the beginning, and add configuration and functionality to many programs, including BASH. The concept is simple, but there are nuances and quirks that are easy to miss. Let’s fix that. In this post, I’ll explain the different types of dotfiles, what belongs where, and how to keep them organized.
<br>
<br>
**This post isn’t about dotfile managers, maybe in a future post.**

## What even is a Shell?
<br>

A **shell** is a program to read commands typed by a user and execute appropriate programs in response to those commands. Such a program is sometimes known as a **command interpreter**. There are many types of shells, like **BASH**, **ZSH**, **FISH** .. etc.
<br>

### Login vs Non Login Shell

A shell can be a **login shell**, which means that you logged into it for example in case of TTY, SSH, or a terminal configured to start a login shell (For example in GNOME terminal you can set this behavior in the preferences section). To check if we're in a login shell simply print the value of `$0`:
<br><br>

```bash
● [watari@DESKTOP] in ~
➜ # After login into Linux, $0 gives us a dash in the beginning of the shell name, that's how we know it's a login shell
● [watari@DESKTOP] in ~
➜ echo $0
-bash
● [watari@DESKTOP] in ~
➜ # If we start bash manually without the -l option, we don't have a dash in the beginning of the output, because it's not a login shell
● [watari@DESKTOP] in ~
➜ bash
● [watari@DESKTOP] in ~
➜ echo $0
bash
● [watari@DESKTOP] in ~
➜ exit
exit
● [watari@DESKTOP] in ~
➜ # Now we're back to the login shell
● [watari@DESKTOP] in ~
➜ echo $0
-bash
```
<br><br>

**Note**: You can start a login shell using the command `bash -l`.

### Interactive vs Non interactive-shells

Interactive shells are the ones you type the commands on, so when you list files or change directory you're in an interactive shell. 

<br>

```bash
● [watari@DESKTOP] in ~
➜ cd ~
● [watari@DESKTOP] in ~
➜ ls
file1
file2
file3
● [watari@DESKTOP] in ~
➜
```
<br>
Meanwhile when you run a bash script, you're running a shell that's non-interactive, sure your script may accept some inputs but it's not the same as commands. 

<br>
Shell flags allow us to see if the shell is interactive like below:
<br>

```bash
● [watari@DESKTOP] in ~
➜ # The flag `i` means the shell is interactive
● [watari@DESKTOP] in ~
➜ echo $-
himBCHs
● [watari@DESKTOP] in ~
➜
```
<br><br>

But if we check the flags from inside a bash script we notice the absence of the `i` flag:
<br><br>

```bash
● [watari@DESKTOP] in ~
➜ cat non-interactive-demo.sh
#!/usr/bin/env bash

echo $-
● [watari@DESKTOP] in ~
➜ ./non-interactive-demo.sh
hB
● [watari@DESKTOP] in ~
➜
```
<br>

## Dotfiles

A system-wide configuration file is /etc/profile. It’s not technically a dotfile because its name doesn’t start with a dot, but it can be overridden by a user-specific dotfile, ~/.profile. Both files load settings for login shells, which means that if you add an alias or command in .profile, it won’t be active when you start a new Bash session from an already-open terminal, it only takes effect when you log in. To see this in action, let’s add an echo statement inside ~/.profile:
<br><br>

```bash
● [watari@DESKTOP] in ~
➜ tail ~/.profile
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi

. "$HOME/.local/bin/env"

echo Hello from ~/.profile
● [watari@DESKTOP] in ~
➜
```
<br><br>
So when we log into a new session we are greeted with the echo message, but not when starting bash as it's not a login shell:

<br><br>

```bash
Hello from /home/watari/.profile
● [watari@DESKTOP] in ~
➜ bash
● [watari@DESKTOP] in ~
➜
```

<br><br>~/.profile is a user wide config file and affects all login shells, so it's useful for environment variables needed by any login shell like PATH, EDITOR, LANG, XDG_*... etc. For shell specific configuration we have other dotfiles like ~/.bash_profile, .bashrc for bash and .zshrc for zsh ... etc. They're loaded when you start the shell. In general, program specific dotfiles are loaded when the program is loaded.

## Bash dotfiles
<br>

Bash different dotfiles like ~/.bash_profile and .bashrc. If ~/.bash_profile exists, it overrides ~/.profile. and ~/.bashrc is used for interactive shells. In general, Bash will read only the first file that exists in this order: ~/.bash_profile, ~/.bash_login, ~/.profile.”. Below is a summary of different bash specific dotfiles and why they're used:
<br><br>
+ ~/.bashrc : Used by interactive shells, login or non login: 
    + Interactive non-login shells: Source ~/.bashrc automatically (most terminal emulator windows)
    + Interactive login shells: Only source ~/.bashrc if you explicitly tell them to in .bash_profile or .profile. 
    <br>
Ideal for: aliases, functions, prompt settings, theming, shell options (shopt), completions.
+ ~/.bash_profile : Loaded by login shells only, can be used for setting environment variables (PATH, EDITOR, LANG), starting programs on login, sourcing .bashrc.
+ ~/.bash_login : Rarely used, and only if ~/.bash_profile doesn't exist.
+ ~/.bash_logout : Loaded when a login shell exits, useful for cleanup stuff.
+ ~/.bash_history : Not loaded as a file, but interacts with your bash session and logs the used commands
+ ~/.bash_aliases : to add bash aliases separately from bashrc.

## General Dotfile Guides

<br>

+ Put environment variables in ~/.profile, they will be used with all **LOGIN** shells.
+ Make .bash_profile only load .profile + .bashrc:

```bash
if [ -f ~/.profile ]; then
    . ~/.profile
fi

if [[ -f ~/.bashrc ]]; then
    . ~/.bashrc
fi
```
+ Put all interactive-only stuff in .bashrc, aliases, functions, prompt ... etc.