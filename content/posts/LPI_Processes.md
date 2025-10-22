---
title: "LPI || Processes"
date: 2025-09-26
description: Reading CH 6 of the linux programming interface book
type: "post"
tags: ["linux", "unix", "commands", "how-to", "technology", "explain-like-i'm-five", "hacks", "security", "LPI"]
---

Below is a summary and a writeup of the 6th chapter for Linux processes in [Linux programming interface](https://github.com/lancetw/ebook-1/blob/master/01_programming/The%20Linux%20Programming%20Interface.pdf) by Michael KerrisK, which I’ll be using as a reference. Review the other writeups [here]()

## Processes and programs

A **process** is an instance of an executing program, meanwhile a program is a file with the information that to construct a process at run time as below:
+ Binary format identification: meta-information describing the format of the executable file. This enables the kernel to interpret the remaining information in the file. Historically, most widely used formats for UNIX executables are a.out (“assembler output”) format and COFF (Common Object File Format). Nowadays, most UNIX implementations (including Linux) employ the Executable and Linking Format [ELF](https://www.man7.org/linux/man-pages/man5/elf.5.html), which provides a number of advantages over the older formats.
+ Machine-language instructions: These encode the algorithm of the program.
+ Program entry-point address: This identifies the location of the instruction at which execution of the program should commence.
+ Data: The program file contains values used to initialize variables and also literal constants used by the program (e.g., strings).
+ Symbol and relocation tables: These describe the locations and names of functions and variables within the program. These tables are used for a variety of purposes, including debugging and run-time symbol resolution (dynamic linking).
+ Shared-library and dynamic-linking information: The program file includes fields listing the shared libraries that the program needs to use at run time and the pathname of the dynamic linker that should be used to load these libraries.
+ Other information: The program file contains various other information that
describes how to construct a process.