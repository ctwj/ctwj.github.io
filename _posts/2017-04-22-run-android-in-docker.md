---
layout: post
title: "Docker运行Android模拟器"
data: 2017-04-22 11:09:11 
categories: linux
tags: docker
---

# Docker运行Android模拟器

命令：
	'docker run -e "EMULATOR=android-22" -e "ARCH=x86" -d -P --name android tracer0tong/android-emulator

连接：

1. 通过ssh， 端口：22， 用户：root， 密码：android
2. ADB
3. VNC

Emulator container exposed 4 port's by default: tcp/22 - SSH connection to container (login: root, password: android, change this if you are security concerned)
- tcp/5037 - ADB
	- tcp/5554 - ADB
	 - tcp/5555 - ADB connection port
	- tcp/5900 - QEMU VNC connection (doesn't support pointing device and keyboard, I recommend to use MonkeyRunner for pointing simulation or 3rd-party VNC server pushed into emulator)

Cleanup:
	'$ docker volume rm $(docker volume ls -qf dangling=true)
 
Additional commands:

List dangling volumes:
	'$ docker volume ls -qf dangling=true

List all volumes:
	'$ docker volume ls

Clear the volumes that are orphaned:
	'docker volume rm $(docker volume ls -qf dangling=true)

Clear unused images:
	'docker rmi $(docker images -q -f "dangling=true")