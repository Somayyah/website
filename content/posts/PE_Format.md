---
title: "Why Did My Patched EXE Break? || Fixing a binary"  
date: 2001-06-17 
type: "post"  
tags: ["assembly", "security", "reverse-engineering", "how-to", "technology"]
---

In a previous post I managed to patch a binary and replace an embedded audio with another WAV audio, and I discovered that it only works if hte new  audio is exactly the same size as the old one. Weird, right? <br><br>

This suggests that maybe there are hardcoded stuff, a checksum? In today's post I will look around in this binary file, compare it with the original and maybe fix it. 