---
title: "ffmpeg"
date: 1995-02-02
description:  
type: "post"
tags: ["linux", "unix", "commands", "ffmpeg-how-to", "technology", "ffmpeg", "codex"]
---

[FFMPEG](https://ffmpeg.org/) is an open source tool that comprises of a collection of libraries and tools for media processing. It's the backbone of many multimedia creation programs, and I'm forcing myself to learn it after avoiding it for a long time. Since my video creation process is almost always the same, why don't I automate it?

## FFMPEG - The Main Tool

The ```ffmpeg``` command follows a simple format:

```bash
ffmpeg [global_options] {[input_file_options] -i input_url} ... {[output_file_options] output_url}
```

The command I generally use is as below:

```bash
ffmpeg -i video.mp4 -i audio.wav -vf subtitles=file.srt output.mp4
```
