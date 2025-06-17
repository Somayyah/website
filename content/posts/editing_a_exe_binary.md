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

There so many stuff shown but the most important one is the function [PlaySoundA](https://learn.microsoft.com/en-us/windows/win32/multimedia/using-playsound-to-play-waveform-audio-files) which plays WAV audio. WAV Audio has the signature `52 49 46 46 ?? ?? ?? ?? 57 41 56 45` so we just need to search for it in the HEXDUMP.

<br><br>

