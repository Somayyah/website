---
title: "Why Did My Patched EXE Break? || Fixing a binary"  
date: 2001-06-17 
type: "post"  
tags: ["assembly", "security", "reverse-engineering", "how-to", "technology"]
---

In a previous [post](/posts/editing_a_exe_binary/) I managed to patch a binary and replace an embedded audio with another WAV audio, and I discovered that it only works if hte new  audio is exactly the same size as the old one. Weird, right? <br><br>

This suggests that maybe there are hardcoded stuff, a checksum? In today's post I will look around in this binary file, compare it with the original and maybe fix it. I generated three files for testing:
<br><br>
```
➜ ls -al test/
total 34404
drwxr-xr-x 2 watari watari     4096 Jun 23 12:26 .
drwxr-xr-x 6 watari watari     4096 Jun 23 12:26 ..
-rwxr-xr-x 1 watari watari  1905664 Jun 23 12:22 audience.exe			# The original  binary
-rw-r--r-- 1 watari watari  1905664 Jun 23 12:25 audience_p_exact.exe	# Binary patched using audio of the same size
-rw-r--r-- 1 watari watari 14277322 Jun 23 12:25 audience_p_large.exe	# Binary patched with a much larger audio
-rwxr-xr-x 1 watari watari  1893472 Jun 23 12:23 cheer1.wav				# original audio file
-rwxr-xr-x 1 watari watari 14265130 Jun 23 12:23 crying.wav				# new audio file
-rw-r--r-- 1 watari watari  1893472 Jun 23 12:24 exact_size.wav			# Testing audio, same size as the original
```

I did the patching using a [script](https://github.com/Somayyah/bch) I wrote:<br><br>
```
➜ python bch.py test/audience.exe 0x2ab0 test/crying.wav 1893472 audience_p_large.exe
➜ python bch.py test/audience.exe 0x2ab0 test/exact_size.wav 1893472 audience_p_exact.exe
```

all the files shows the signature of MS-DOS executable:
<br><br>
```
➜ hexdump -C audience.exe | head -n 1
00000000  4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00  |MZ..............|
```

The signature 4D 5A is for [DOS MZ Executable](https://en.wikipedia.org/wiki/DOS_MZ_executable), I found this [document](https://wiki.osdev.org/MZ) about the MZ format, as expected it follows a format:

```
| Offset | Hex  | Field              | Size | Description                                                                                  |
| ------ | ---- | ------------------ | ---- | -------------------------------------------------------------------------------------------- |
| 0      | 0x00 | Signature          | word | `0x5A4D` — ASCII for `'M'` and `'Z'`                                                         |
| 2      | 0x02 | Extra bytes        | word | Number of bytes used in the last 512-byte page                                               |
| 4      | 0x04 | Pages              | word | Total number of 512-byte pages (including partial last page)                                 |
| 6      | 0x06 | Relocation items   | word | Number of relocation entries                                                                 |
| 8      | 0x08 | Header size        | word | Size of header in paragraphs (16 bytes each). Used to locate where the actual program begins |
| 10     | 0x0A | Minimum allocation | word | Minimum memory (in paragraphs) needed to run, not counting the program itself                |
| 12     | 0x0C | Maximum allocation | word | Maximum memory (in paragraphs) the program can use                                           |
| 14     | 0x0E | Initial SS         | word | Segment address for the stack segment (SS)                                                   |
| 16     | 0x10 | Initial SP         | word | Stack pointer (SP) value at start                                                            |
| 18     | 0x12 | Checksum           | word | Should make the sum of all header words equal zero (rarely used)                             |
| 20     | 0x14 | Initial IP         | word | Instruction pointer (IP) value at start                                                      |
| 22     | 0x16 | Initial CS         | word | Segment address for code segment (CS)                                                        |
| 24     | 0x18 | Relocation table   | word | File offset of the relocation table                                                          |
| 26     | 0x1A | Overlay            | word | Overlay number — 0 means main executable                                                     |
| 28     | 0x1C | Overlay info       | N/A  | Optional data used for managing overlays (non-standard)                                      |
```

Let's see how this translates to our file(s):<br>

```
➜ xxd -l 28 audience.exe
00000000: 4d5a 9000 0300 0000 0400 0000 ffff 0000  MZ..............
00000010: b800 0000 0000 0000 4000 0000            ........@...
➜ xxd -l 28 audience_p_exact.exe
00000000: 4d5a 9000 0300 0000 0400 0000 ffff 0000  MZ..............
00000010: b800 0000 0000 0000 4000 0000            ........@...
➜ xxd -l 28 audience_p_large.exe
00000000: 4d5a 9000 0300 0000 0400 0000 ffff 0000  MZ..............
00000010: b800 0000 0000 0000 4000 0000            ........@...
```

They're identical which makes sense, I just duct taped the content and didn't account for any hardcoded stuff or alignments.