---
title: "Reverse engineering for beginners walkthrough - 1"
date: 2025-01-30 
description: Reading the book "Reverse engineering for beginners" by Dennis Yurichev 
type: "post"  
tags: ["assembly", "security", "reverse-engineering", "how-to", "technology", "arm", "operating systems", "kernel", "x86-64", "ARM"]
---

Reverse engineering is a deep topic that I'm interested in for a while and I feel like I'm ready to dive in, starting with the book [Reverse engineering for beginners](https://beginners.re/) by [Dennis Yurichev](https://yurichev.com/) then moving to other resources if needed.

## Chapter 1 || Code patterns

The book starts with an introduction of the writer and his tech journey and gives a background about compilers and different computers architecture, it also talks about modern compilers and how they're good at optimizing, it's a fun read.

### 1.2.1 A short introduction to the CPU

This section talks about the CPU, what is it and some important glossary:
+ Instruction : A primitive CPU command. The simplest examples include: moving data between registers,
working with memory, primitive arithmetic operations. As a rule, each CPU has its own instruction
set architecture (ISA).
+ Machine code : Code that the CPU directly processes. Each instruction is usually encoded by several
bytes.
+ Assembly language : Mnemonic code and some extensions, like macros, that are intended to make a
programmer’s life easier.
+ CPU register : Each CPU has a fixed set of general purpose registers (GPR2). ~ 8 in x86, ~ 16 in x86-64, and also ~ 16 in ARM. The easiest way to understand a register is to think of it as an untyped temporary variable. Imagine if you were working with a high-level PL and could only use eight 32-bit (or 64-bit) variables. Yet a lot can be done using just these!

This short introduction explains the importance of assembly and how it relates to machine code and PL languages like C/C++ and Java, again, a fun read.

### 1.3 An Empty Function

We start with reviewing the assembly dump of an empty C code:

```bash
void f()
{
    return;
};
```

The function does nothing and returns nothing, using GCC and MSVC with https://godbolt.org/ produces below:

```bash
f       PROC
        ret     0
f       ENDP
```

In my study I'll focus on x86-64 and ARM as they're the areas I'm interested in exploring. The code above is slightly different from the result in the book even with trying the /O7 flag:

```bash
f:
    ret
```

After changing the compiler to x86-64 GCC with -O3 flag I got the same result, so it's important to check for the compiler version and optimization settings always.

### 1.4.2 ARM

The ARM output is a bit different:

```bash
f   PROC
    BX      lr # For branching
    ENDP
```

I found this [cheetsheet](https://azeria-labs.com/downloads/cheatsheetv1.3-1920x1080.png) for ARM assembly, ```BX``` is used for branching to return to the caller which it's address is saved in the ```lr``` (link register).

### Hello World in Assembly

Below is the code to output "Hello, World!" in x86-64 assembly:

```bash
.global _start
.intel_syntax noprefix

.section .text
_start:	

	// sys_write call	
	mov rax, 1
	mov rdi, 1	
	lea rsi, [hello_world]
	mov rdx, 14 
	syscall
	
	// sys_exit call to exit from the program
	mov rax, 60
	mov rdi, 0
	syscall

.section .data
hello_world:
	.asciz "Hello, World!\n"

.section .bss 
```

It has 4 main sections:
* - Global section to identify the entry point.
* - TEXT section which holds the actual code instructions.
* - DATA section which holds the **Initialized** variables.
* - BSS section which holds the **Uninitialized** variables.

In the .text section we notice two [system calls](https://blog.rchapman.org/posts/Linux_System_Call_Table_for_x86_64/) have been performed:

* - sys_write call section to print out the "Hello, World!" sentence, from the [syscall table](https://blog.rchapman.org/posts/Linux_System_Call_Table_for_x86_64/) we find below:

| %rax | System call | %rdi            | %rsi            | %rdx         | %r10 | %r8 | %r9 |
|------|------------|-----------------|-----------------|-------------|------|----|----|
| 1    | sys_write  | unsigned int fd | const char *buf | size_t count |      |    |    |

which resembles below code:

```bash
mov rax,    1               // 1 = sys_write (this tells Linux we want to write)
mov rdi,    1               // File descriptor: 1 (stdout)
lea rsi,    [hello_world]   // Address of the string (pointer)
mov rdx,    14              // Number of bytes to write
syscall                      // Perform the syscall
```

To run out assembly code we can use gcc as below:

```bash
# Assemble the source file (hello-world.s) into an object file (hello-world.o)
as hello-world.s -o hello-world.o

# Link the object file (hello-world.o) to create an executable (hello-world).
# -nostdlib: Instructs GCC to not link the standard libraries (i.e., no C runtime).
# -static: Statically links the executable, including all required libraries inside the binary.
gcc -o hello-world hello-world.o -nostdlib -static

# Run the executable. This will output "Hello, World!" to the terminal.
./hello-world
```

There are compilers other than gcc mentioned, my interest is only with x86-64 and ARM architecture so I won't cover MIPS, for now..
