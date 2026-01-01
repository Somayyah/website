---
title: "Android || Rooting an android galaxy A51 phone"
date: 1995-09-26
description: Following the XDA guide "Galaxy A51 Root || Unlock Bootloader || Flash Official Firmware"
type: "post"
tags: ["android", "linux", "mobile phone security", "how-to"]
---

My old android phone is no longer serving me, and I replaced it's broken screen so many times that I could have saved for a new phone by now, so I decided to turn this zombie into my own guinea pig. It's model is [Samsung Galaxy A51](https://www.gsmarena.com/samsung_galaxy_a51-9963.php), and I found this [guide](https://xdaforums.com/t/galaxy-a51-root-unlock-bootloader-flash-official-firmware-binary-3-may.4053065/) which I will be following today.

Disclaimer : This is my first time ever unlocking an android phone, so expect some inaccuracies and educational guesses along the way.

## What we need

The tutorial seems to be written for Windows so no Linux today but that's alright. We also need to install:

- [Odin v3.14.1](https://dl2018.sammobile.com/Odin3-v3.14.1.zip)
- [Galaxy A51 Latest USB Driver](https://developer.samsung.com/galaxy/others/android-usb-driver-for-windows)
- Samsung firmware, the instructions says to install either [Samfirm 0.4.1](https://samfirmtool.com/samfirm-v0-4-1) or [Frija 1.4.2](https://github.com/wssyncmldm/frija/releases), I will go with SamFirm.
- Microsoft Visual C++ 2010 Redistributable Package) and (Microsoft Visual C++ 2008 Redistributable Package.

## Installing the Firmware

Since my phone model is SM-A515F/DSN, I searched for it on https://samfrew.com/firmware and I didn't find it!! My region isn't listed in the site, so what's going on?