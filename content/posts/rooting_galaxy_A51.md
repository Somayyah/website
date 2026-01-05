---
title: "Android || Rooting an android galaxy A51 phone"
date: 1995-09-26
description: Following the XDA guide "Galaxy A51 Root || Unlock Bootloader || Flash Official Firmware"
type: "post"
tags: ["android", "linux", "mobile phone security", "how-to"]
---

My old android phone is no longer serving me, and I replaced it's broken screen so many times I could have saved for a new one by now, so I decided to turn this zombie into my own guinea pig. It's model is [Samsung Galaxy A51](https://www.gsmarena.com/samsung_galaxy_a51-9963.php), and I found this [guide](https://xdaforums.com/t/galaxy-a51-root-unlock-bootloader-flash-official-firmware-binary-3-may.4053065/) which I will be following today.

Disclaimer : This is my first time ever unlocking an android phone, so expect some inaccuracies and educational guesses along the way.

## What we need

The tutorial seems to be written for Windows so no Linux today but that's alright. We also need to install:

- [Odin v3.14.1](https://dl2018.sammobile.com/Odin3-v3.14.1.zip)
- [Samsung Latest USB Driver](https://developer.samsung.com/galaxy/others/android-usb-driver-for-windows)
- Samsung firmware, the instructions says to install either [Samfirm 0.4.1](https://samfirmtool.com/samfirm-v0-4-1) or [Frija 1.4.2](https://github.com/wssyncmldm/frija/releases), I will go with SamFirm.
- Microsoft Visual C++ 2010 Redistributable Package) and (Microsoft Visual C++ 2008 Redistributable Package.

## Installing the Firmware

The instructions say to hunt the firmware based on the CSC (country code), Since my phone model is SM-A515F/DSN, I searched for it on https://samfrew.com/firmware and I didn't find it!! The region isn't listed in the site, so what's going on? I checked further, and found that by dailing `*#1234#` I get the CSC value **A515FOJM8HWI2**. So DSN isn't the CSC code, as per this forum the CSC should be WI2 but it's not listed. I didn't find a firmware with the CSC **WI2** or **OJM** or **OXM** so why don't I just select a firmware closest to my country? It's a child's play thing, nothing is serious anyways.
<br><br>
Wait, the model of my phone after dialing *#1234#* is A515FXXU8HWI1, and this one does exist! So I installed the one with CSC of BTE and extracted it, let's see..
<br><br>
Find the list of Samsung CSC [here](https://technastic.com/samsung-csc-codes-list/)

## Preparing the other stuff

First, I need to install the [Samsung Latest USB Driver](https://developer.samsung.com/galaxy/others/android-usb-driver-for-windows), which is only necessary for windows. Then I install Odin and Samfirm, then I made sure that my device is detected on windows which wasn't easy because I'm running a VBox machine. If you're encountering a similar problem, here's what I did to fix it:

- Install windows VBox guest additions.
- Install VBox extentions pack.
- Make sure that DKMS is installed on the Fedora host machine.
- Enable USB 2 on VBox machine settings.
- Use a proper USB, and verify that the phone is connected to the host using the command "adb devices"
- Reloading the host after previous changes.

Since now we have everything ready, will proceed with the actual steps.

## Proceed..

We follow the below steps on our android phone to unlock bootloader:

- Go to Settings then to About phone > System insformation and find your build number.
- Tap on your build number 6 times until you see “You’re now a developer”.
- Go in Developer options > enable OEM unlocking.
- Connect the device to your PC.
- Power off your device with POWER and volume DOWN and directly hold volume UP and DOWN together!
- Device will boot in DOWNLOAD MODE.

Then we get a warning that our device will be bricked which is what we want, the warning not the bricking.

- Long press volume UP to unlock the bootloader. This will wipe your data and automatically reboot your device!
