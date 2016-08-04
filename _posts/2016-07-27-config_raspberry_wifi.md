---
layout: post
title: "树莓派wifi配置"
data: 2016-07-27 11:09:11 
categories: safe
tags: linux raspberry
---

准备工作
=======
-	虚拟机
-	读卡器

系统安装
-------
使用`Win32 Disk Imager`烧录镜像到SD卡.
wifi配置
--------
1. 启动虚拟机,并加载SD到linux系统.
2. 打开文件加载的sd卡中的 **/etc/network/interfaces**
3. 写入wifi配置
		
		auto lo
		iface lo inet loopback
		iface eth0 inet dhcp
		allow-hotplug wlan0
		iface wlan0 inet static
		wpa-ssid  netgear          #你要连接的wifi ssid
		wpa-psk  1234567890     #你的wpa连接密码 
		address 192.168.1.110     # 设定的静态IP地址
		netmask 255.255.255.0     # 网络掩码
		gateway 192.168.1.1      # 网关
		network 192.168.1.1      # 网络地址
		iface default inet dhcp

最后
----
退出SD卡, 安装到树莓派测试