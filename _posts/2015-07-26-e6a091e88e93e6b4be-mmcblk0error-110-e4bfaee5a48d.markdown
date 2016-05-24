---
author: ww
comments: true
date: 2015-07-26 03:25:03+00:00
layout: post
link: http://www.gl6.cc/blog/%e6%a0%91%e8%8e%93%e6%b4%be-mmcblk0error-110-%e4%bf%ae%e5%a4%8d.html
slug: '%e6%a0%91%e8%8e%93%e6%b4%be-mmcblk0error-110-%e4%bf%ae%e5%a4%8d'
title: 树莓派 mmcblk0:error-110 修复
wordpress_id: 112
categories:
- uncategorized
---

修复方法，在cmdline.txt中加入两行

sdhci-bcm2708.missing_statusd=0

sdhci-bcm2708.sync_after_dma=0



重启解决问题
