---
title: "Why Did My Patched EXE Break? || Fixing a binary"  
date: 2001-06-17 
type: "post"  
tags: ["assembly", "security", "reverse-engineering", "how-to", "technology"]
---

In a previous [post](/posts/editing_a_exe_binary/) I managed to patch a binary and replace an embedded audio with another WAV audio, and I discovered that it only works if the new  audio is exactly the same size as the old one. Weird, right? <br><br>

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

The signature 4D 5A is for [DOS MZ Executable](https://en.wikipedia.org/wiki/DOS_MZ_executable), I found this [document](https://wiki.osdev.org/MZ) about the MZ format, The header follows the format:

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

They're identical which makes sense, I just duct taped the content and didn't account for any hardcoded stuff or alignments. Furthermore here's header content:

```
| Offset | Field              | Raw Hex | Interpreted (Little Endian) | Value Meaning                                               
| ------ | ------------------ | ------- | ---------------------------  ----------------------------------------------------------- 
| 0x00   | Signature          | 4d5a    | MZ                          | Magic number
| 0x02   | Extra bytes        | 9000    | 0x0090 = 144                | 144 bytes in the last page                                  	
| 0x04   | Pages              | 0300    | 0x0003 = 3                  | 3 pages = 1536 bytes total                                  	
| 0x06   | Relocation items   | 0000    | 0x0000 = 0                  | No relocation entries                                       
| 0x08   | Header size        | 0400    | 0x0004 = 4                  | 4 \* 16 = 64 bytes header size                              
| 0x0A   | Minimum allocation | 0000    | 0x0000 = 0                  | No minimum memory required                                  
| 0x0C   | Maximum allocation | ffff    | 0xFFFF = 65535              | Take all the RAM you can get behavior                     
| 0x0E   | Initial SS         | 0000    | 0x0000 = 0                  | Stack segment offset                                        
| 0x10   | Initial SP         | b800    | 0x00b8 = 184                | Stack pointer                                               
| 0x12   | Checksum           | 0000    | 0x0000 = 0                  | 0 so unused?!!                                              
| 0x14   | Initial IP         | 0000    | 0x0000 = 0                  | Entry point instruction pointer                             
| 0x16   | Initial CS         | 0000    | 0x0000 = 0                  | Entry point code segment                                    
| 0x18   | Relocation table   | 4000    | 0x0040 = 64                 | Offset to relocation table (right after the 64-byte header) 
| 0x1A   | Overlay            | 0000    | 0x0000 = 0                  | The main executable                 
```	

Some interesting fields are the **pages**, **header size**, **Relocation table** and **overlay**. The pages field says we need 3 pages of 512 content. There's 144 bytes in  the last page, so total content length is 2 * 512 + 144 = 1168 bytes, but this is way smaller than the original file size!!

```
➜ stat -c%s audience.exe
1905664 ## in bytes
```

How about I check the relocation table which is right after the header? but the header suggests the relocation items to be 0, then there is no relocation table right? For now I will assume this is the case, moreover checking the [Wiki](https://wiki.osdev.org/MZ#MZ_File_Structure) there's a mention to what's called PE extention, if our file is a PE executable then we should have the start of a PE header in the offset 0x3C, this is the case here:

```
➜ xxd -s 0x3C -l 4 audience.exe
0000003c: 0001 0000                                ....
➜ xxd -s 0x3C -l 4 audience_p_exact.exe
0000003c: 0001 0000                                ....
➜ xxd -s 0x3C -l 4 audience_p_large.exe
0000003c: 0001 0000                                ....
```

At 0x3c we see the PE header start at 0x00000100 which is correct:

```
➜ xxd -s 0x100 -l 4 audience.exe
00000100: 5045 0000                                PE..
```

I found this [document](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format) for PE format:

> The PE file header consists of a Microsoft MS-DOS stub, the PE signature, the COFF file header, and an optional
> header. A COFF object file header consists of a COFF file header and an optional header. In both cases, the 
> file headers are followed immediately by section headers.


And:

> After the MS-DOS stub, at the file offset specified at offset 0x3c, is a 4-byte signature that identifies the 
> file as a PE format image file. This signature is "PE\0\0" (the letters "P" and "E" followed by two null bytes)

<br> So bytes from 0x100 to 0x104 are reserved for the PE signature, followed by the COFF File Header which is 20 bytes long:

```
➜ xxd -s 0x100 -l 24 audience.exe
00000100: 5045 0000 6486 0600 db13 5068 0000 0000  PE..d.....Ph....
00000110: 0000 0000 f000 2200                      ......".
```

Hex dump explained:

```
5045 0000 	==> Hex for "PE\0\0"
6486 		==> Machine, IMAGE_FILE_MACHINE_AMD64
0600 		==> NumberOfSections, 0x0006 = 6 sections.
db13 5068 	==> TimeDateStamp, should I care about it now?
0000 0000	==> PointerToSymbolTable, zero, expected.
0000 0000 	==> Number of symbols, zero, expected.
f000 		==> SizeOfOptionalHeader, 0x00f0 = 240, since it's not zero then we're dealing with executable not object file.
2200		==> Characteristics, 0x0022, File attributes, IMAGE_FILE_LARGE_ADDRESS_AWARE and IMAGE_FILE_EXECUTABLE_IMAGE
```
For the optional header, it has 3 major parts, first section is for the standard header, it's either 28 or 24 bytes depending on the type PE32 or PE32+, first two bytes are 0x020b which means we are dealing with PE32+. In this section there's the field SizeOfCode which is for the .text section:

```
➜ xxd -s 0x11c -l 4 audience.exe
0000011c: 0010 0000                                ....
```

So the .text section equals 0x00001000, that's 4096 bytes. Then we have SizeOfInitializedData field = 00061d00 = 0x001D0600 which is 1902080 bytes. The address of the entry point:

```
➜ xxd -s 0x11c -l 16 audience.exe
0000011c: 0010 0000 0006 1d00 0000 0000 f813 0000  ................
``` 

Is 0x000013f8, and base of code is 0x00001000:

```
➜ xxd -s 0x11c -l 20 audience.exe
0000011c: 0010 0000 0006 1d00 0000 0000 f813 0000  ................
0000012c: 0010 0000                                ....
```

I followed the PE specification and below are the fields and sections right after the COFF header:

```
## Standard fields section, 24 bytes in length, start from 118

0b02			Magic, PE32+ Execuatable
0e				MajorLinkerVersion
2c				MinorLinkerVersion
00e2 0000		SizeOfCode = 0x0000e200 = 57856
00d2 0000 		SizeOfInitializedData = 0x0000d200 = 53760
0000 0000		SizeOfUninitializedData = 0
6412 0000 		AddressOfEntryPoint = 0x00001264
0010 0000 		BaseOfCode = 0x00001000

## Windows-specific fields, 88 bytes in length, starts from 0x130

0000 0040 0100 0000			ImageBase = 0x0000000140000000
0010 0000					SectionAlignment = 0x00001000
0002 0000					FileAlignment = 00000200
0600						MajorOperatingSystemVersion
0000						MinorOperatingSystemVersion
0000						MajorImageVersion
0000						MinorImageVersion
0600						MajorSubsystemVersion
0000						MinorSubsystemVersion
0000 0000					Win32VersionValue
0000 0200					SizeOfImage = 0x00020000
0004 0000					SizeOfHeaders = 0x00000400
0000 0000					CheckSum = 0
0300						Subsystem
6081						DllCharacteristics
0000 1000 0000 0000			SizeOfStackReserve = 0x0000000000100000
0010 0000 0000 0000			SizeOfStackCommit = 0x0000000000001000
0000 1000 0000 0000			SizeOfHeapReserve = 0x0000000000100000
0010 0000 0000 0000			SizeOfHeapCommit = 0x0000000000001000
0000 0000					LoaderFlags
1000 0000					NumberOfRvaAndSizes = 0x00000010             
```

The fields I'm interested in are:

+ NumberOfSections: for audience.exe it's 0x06 = 6, this is the first different field, indicates the size of the section table.
+ SizeOfCode
+ SizeOfInitializedData

## NumberOfSections

Using objdump we can examine file headers as below for the original file:

```
➜ objdump -h audience.exe

audience.exe:     file format pei-x86-64

Sections:
Idx Name          Size      File off  Algn
  0 .text         00000ffc  00000400  2**4
  1 .rdata        00001094  00001400  2**4
  2 .data         00000200  00002600  2**4
  3 .pdata        000001c8  00002800  2**2
  4 .rsrc         001ce690  00002a00  2**2
  5 .reloc        00000030  001d1200  2**2
```

The .rsrc section is massive (1.8MB) and contains our embedded audio file. We can draft the file layout as below:

```
┌─────────────────┐ 0x00000000
│   PE Headers    │
├─────────────────┤ 0x00000400
│ .text           │
├─────────────────┤ 0x00001400  
│ .rdata          │
├─────────────────┤ 0x00002600
│ .data           │ 
├─────────────────┤ 0x00002800
│ .pdata          │
├─────────────────┤ 0x00002a00  ← Audio starts here
│                 │
│ .rsrc (1.8MB)   │ ← Our audio file
│     AUDIO       │
│                 │
├─────────────────┤ 0x001d1200  ← Next section starts here
│ .reloc          │
└─────────────────┘
```

Since patching modifies this section then we can assume that the next .reloc section is misaligned. Let's check what should be at offset 0x001d1200 (where .reloc starts) in the three files:

**Original binary**:
```
➜ xxd -s 0x001d1200 -l 32 audience.exe
001d1200: 0020 0000 3000 0000 f0a1 f8a1 00a2 08a2  . ..0...........
001d1210: 10a2 20a2 30a2 48a2 50a2 80a2 88a2 08a3  .. .0.H.P.......
```

**Exact-size patch**:
```
➜ xxd -s 0x001d1200 -l 32 audience_p_exact.exe  
001d1200: 0020 0000 3000 0000 f0a1 f8a1 00a2 08a2  . ..0...........
001d1210: 10a2 20a2 30a2 48a2 50a2 80a2 88a2 08a3  .. .0.H.P.......
```
Same clean relocation data.

**Large patch**:
```
➜ xxd -s 0x001d1200 -l 32 audience_p_large.exe
001d1200: 0ebc 7ac6 50b5 bebd e9b6 a5bb c6b8 08bd  ..z.P...........
001d1210: 8fb4 24b8 49b4 d1b5 f2b5 5eb9 30ae 22b5  ..$.I.....^.0.".
```
.reloc section doesn't start here!

