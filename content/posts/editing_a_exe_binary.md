---
title: "Binary patching exercise | Edit the WAV audio inside a binary"  
date: 2025-06-17 
type: "post"  
tags: ["assembly", "security", "reverse-engineering", "how-to", "technology"]
---

I created this small piece of [software](https://github.com/Somayyah/audience) that plays cheering sound whenever you click the mouse. But I want to do something else, what if I want to edit the audio inside? 
<br><br>

First I try a simple strings test:

```
➜ strings audience.exe 
```

There so many stuff shown but the most important one is the function [PlaySoundA](https://learn.microsoft.com/en-us/windows/win32/multimedia/using-playsound-to-play-waveform-audio-files) which plays WAV audio. WAV Audio has the [signature](https://en.wikipedia.org/wiki/List_of_file_signatures) `52 49 46 46 ?? ?? ?? ?? 57 41 56 45` so we just need to search for it in the HEXDUMP.

<br><br>

As per this [document](https://docs.fileformat.com/audio/wav/) I found, The header of a WAV (RIFF) file is 44 bytes long and has the following format:<br>

```goat
The header of a WAV (RIFF) file is 44 bytes long and has the following format:

Positions	Sample Value			Description
1 - 4		“RIFF”					Marks the file as a riff file. Characters are each 1 byte long.
5 - 8		File size (integer)		Size of the overall file - 8 bytes, in bytes (32-bit integer). 
9 -12		“WAVE”	File Type		For our purposes, it always equals “WAVE”.
13-16		“fmt "					Format chunk marker. Includes trailing null
17-20		16						Length of format data as listed above
21-22		1						Type of format (1 is PCM) - 2 byte integer
23-24		2						Number of Channels - 2 byte integer
25-28		44100					Sample Rate - 32 bit integer. Common values are 44100 (CD), 48000 (DAT). Sample Rate = Number of Samples per second, or Hertz.
29-32		176400					(Sample Rate * BitsPerSample * Channels) / 8.
33-34		4						(BitsPerSample * Channels) / 8.1 - 8 bit mono2 - 8 bit stereo/16 bit mono4 - 16 bit stereo
35-36		16						Bits per sample
37-40		“data”					“data” chunk header. Marks the beginning of the data section.
41-44		File size (data)		Size of the data section.
```