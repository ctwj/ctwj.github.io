---
author: ww
layout: post
title: "Linux 磁盘清理"
data: 2016-05-18 10:31:32
categories: Linux
tags: linux
---

### `df -h` 当磁盘使用率过高时需要清理磁盘 ###

1. 找出占用空间较大的文件  
	`find / -size +20000k`

2. 删除日志  
	`rm -rf /var/log/*`

3. 找出系统占用空间较大的目录  
	`du | awk '$1>2000'`

4. 找出最近创建或修改的文件  

	- 查找最近30分钟修改的当前目录下的.php文件
	- `find . -name '*.php' -mmin -30`
	- 查找最近24小时修改的当前目录下的.php文件
	- `find . -name '*.php' -mtime 0`  
	- 查找最近24小时修改的当前目录下的.php文件，并列出详细信息
	- `find . -name '*.inc' -mtime 0 -ls`
	- 查找当前目录下，最近24-48小时修改过的常规文件。
	- `find . -type f -mtime 1`
	- 查找当前目录下，最近1天前修改过的常规文件。
	- `find . -type f -mtime +1`
