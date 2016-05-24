---
author: ww
comments: true
date: 2015-05-26 16:33:55+00:00
layout: post
link: http://www.gl6.cc/blog/%e6%a0%91%e8%8e%93%e6%b4%be-unable-to-mount-root-fs-on-unkown-block-%e4%bf%ae%e5%a4%8d.html
slug: '%e6%a0%91%e8%8e%93%e6%b4%be-unable-to-mount-root-fs-on-unkown-block-%e4%bf%ae%e5%a4%8d'
title: 树莓派 unable to mount root fs on unkown-block 修复
wordpress_id: 95
categories:
- Linux
tags:
- 树莓派
---

不小心就出了这个问题，首先是启动不了了，链接显示器，可以看到错误

unable to mount root fs on unkown-block

没有办法查了一下，最后还是解决了

1. 打开一个Linux系统的虚拟机，将读卡器插入，并连接到虚拟机中

这个时候能够打开树莓派中那个几十M的分区

2. 执行 fdisk -l

可以看到SD卡的信息，知道/dev/sdb 是SD卡

**Disk /dev/sdb: 16.0 GB, 16021192704 bytes**
**64 heads, 32 sectors/track, 15279 cylinders, total 31291392 sectors**
**Units = sectors of 1 * 512 = 512 bytes**
**Sector size (logical/physical): 512 bytes / 512 bytes**
**I/O size (minimum/optimal): 512 bytes / 512 bytes**
**Disk identifier: 0xa6202af7**

**Device Boot Start End Blocks Id System**
**/dev/sdb1 8192 122879 57344 c W95 FAT32 (LBA)**
**/dev/sdb2 122880 31291391 15584256 83 Linux**



3.执行  df -h

可以看到 /dev/sdb1 被加载，看大小和文件夹名字就知道是sd的小分区,

而 /dev/sdb2 则没有正常加载

**Filesystem Size Used Avail Use% Mounted on**
**rootfs 29G 13G 15G 48% /**
**udev 10M 0 10M 0% /dev**
**/dev/sdb1 56M 19M 37M 34% /media/boot**

4 尝试加载 mount -t ext3 /dev/sdb2  /mnt/usbhd

提示加载错误

**mount: wrong fs type, bad option, bad superblock on /dev/sdb2,**
** missing codepage or helper program, or other error**
** In some cases useful info is found in syslog - try**
** dmesg | tail or so**

5. dmesg 可以看到 提示错误，

[14010.283960] EXT4-fs (sdb2): VFS: Can't find ext4 filesystem

6. 修复 fsck -t ext4 /dev/sdb2

**fsck from util-linux 2.20.1**
**e2fsck 1.42.5 (29-Jul-2012)**
**ext2fs_open2: Bad magic number in super-block**
**fsck.ext4: Superblock invalid, trying backup blocks...**
**/dev/sdb2: recovering journal**
**fsck.ext4: unable to set superblock flags on /dev/sdb2**
**/dev/sdb2: ***** FILE SYSTEM WAS MODIFIED *******

**/dev/sdb2: ********** WARNING: Filesystem still has errors ************

7，再挂载，就直接成功了，看到了以前的文件了

mount -t ext4 /dev/sdb2 /mnt/usbhd
