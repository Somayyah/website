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

<br>

As per this [document](https://docs.fileformat.com/audio/wav/) I found, The header of a WAV (RIFF) file is 44 bytes long and has the following format:<br>

```
| Positions | Sample Value          | Description                                                                 |
|-----------|-----------------------|-----------------------------------------------------------------------------|
| 1 - 4     | "RIFF"                | Marks the file as a RIFF file. Each char is 1 byte.                        |
| 5 - 8     | File size (int)       | Size of the overall file - 8 bytes "RIFF" + size field, in bytes (32-bit integer).                                      |
| 9 - 12    | "WAVE"                | File type. Always equals "WAVE".                                           |
| 13 - 16   | "fmt "                | Format chunk marker. Includes trailing null.                               |
| 17 - 20   | 16                    | Length of format data (usually 16).                                        |
| 21 - 22   | 1                     | Audio format (1 = PCM). 2-byte integer.                                    |
| 23 - 24   | 2                     | Number of channels. 2-byte integer.                                        |
| 25 - 28   | 44100                 | Sample rate (Hz). 32-bit integer.                                          |
| 29 - 32   | 176400                | Byte rate = SampleRate * Channels * BitsPerSample / 8                      |
| 33 - 34   | 4                     | Block align = Channels * BitsPerSample / 8                                 |
| 35 - 36   | 16                    | Bits per sample                                                            |
| 37 - 40   | "data"                | "data" chunk header                                                        |
| 41 - 44   | File size (data)      | Size of the data section in bytes                                          |
```

<br>Let's take a look at the first line:

```
➜ xxd audience.exe > hex.dump
➜ grep "RIFF" hex.dump
00002ab0: 5249 4646 58e4 1c00 5741 5645 666d 7420  RIFFX...WAVEfmt
```

We can find information about the audio and it's size:

- 52 49 46 46 ==> RIFF (first 4 bytes)
- 58 E4 1C 00 (little-endian) → (0x001CE458) supposed to be the overall file size - 8 bytes.

<br>

The bytes from 5 to 8 represent 1893464 in base 10, we add 8 which gives us 1893472 bytes in total, this is how much we need to replace. I will replace it with another [WAV audio for crying](https://freesound.org/people/qubodup/sounds/200428/), after downloading it I saved it with audacity as a WAV file with signed 16 bit PCM enconding. The resulted file is 14265130 bytes in size which is waaaay bigger than the audio file, wouldn't that override the next bits?<br>

How about below plan:

<br>- Identify the start and end of the existing WAV chunk.
<br>- Extract everything after the WAV chunk and save it in a separate file.
<br>- Delete the original WAV chunk.
<br>- Insert the new WAV file’s bytes in its place.
<br>- Append the saved tail back to the new composite file.
<br>

I wrote a simple [script](https://github.com/Somayyah/bch) for patching, it takes an input file, the offset, and the patching data as a file or raw hex. I tested it with a regular text file and managed to replace a chunk of data without corrupting the rest. so will test it now on my binary. <br><br>

The audio starts at 00002ab0 and we need to replace 1893472 with our new content, so will test running this command:
<br>

```
python bch.py test/audience.exe 0x2ab0 test/crying.wav 1893472
```

<br><br>
The file is now patched but it's not running, windows is giving us this vague message:
<br>
the application has failed to start because it's side-by-side configuration is incorrect. 
<br><br>

The patched  file has to be correct:

```
➜ original_size=$(stat -c %s test/audience.exe)
old_audio_size=$(stat -c %s test/cheer1.wav)
new_audio_size=$(stat -c %s test/crying.wav)

patched_size=$((original_size - old_audio_size + new_audio_size))
last_offset=$((patched_size - 1))
patched_file_size=$(stat -c %s test/audience.exe_patched)

echo "Expected patched file size: $patched_size bytes"
echo "Final patched file size: $patched_file_size"
printf "Expected last offset: 0x%X\n" "$last_offset"
Expected patched file size: 14277322 bytes
Final patched file size: 14277322
Expected last offset: 0xD9DAC9
```

Could it be a misalignment issue? using the [SoX](https://stackoverflow.com/questions/24236678/can-i-use-sox-to-generate-audio) tool we can generate a new audio file of the same size as the replaced chunk:

```
➜ sox -n -r 8000 output.wav synth 30 sine 500
➜ truncate -s 1893472 output.wav
➜ python bch.py test/audience.exe 0x2ab0 output.wav 1893472
```
<br><br>
Now the excutable runs on windows with no issues, and with every mouse click I hear the new audio playing. This suggests that my patching work is correct however windows still expects something else from me. 
<br><br>

I'll dig into that later, for now my patching logic works, and I'll dig into the excutable stuff later.
