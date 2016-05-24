---
author: ww
comments: true
date: 2015-07-28 14:32:20+00:00
layout: post
link: http://www.gl6.cc/blog/%e6%a0%91%e8%8e%93%e6%b4%be-kernelpanic-vfs-unable-to-mount-root-fs-on-unknown-block1792.html
slug: '%e6%a0%91%e8%8e%93%e6%b4%be-kernelpanic-vfs-unable-to-mount-root-fs-on-unknown-block1792'
title: '树莓派 KERNELPANIC: VFS Unable to mount root fs on unknown-block(179,2)'
wordpress_id: 114
categories:
- Linux
tags:
- 树莓派
---

修复：

fsck -f -v -r /dev/sdb2

具体 设备名称其他信息查看 [http://blog.gl6.cc/?p=95](http://blog.gl6.cc/?p=95)
