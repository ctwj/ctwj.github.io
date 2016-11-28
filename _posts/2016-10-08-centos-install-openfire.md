---
layout: post
title: "centos install openfire"
data: 2016-09-09 11:09:11 
categories: php
tags: php 
---

 安装 openfire


1. 前置安装

	- 安装java环境
	
			yum install java
		设置 /etc/profile  或 ~/.bashrc
	
			export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.101-3.b13.el6_8.x86_64  
			export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar  
			export PATH=$PATH:$JAVA_HOME/bin

	- 64位系统需要安装 libldb.i686

			yum install libldb.i686
	 
2. 安装openfire

	- 下载软件  
	
			wget http://download.igniterealtime.org/openfire/openfire-3.10.2-1.i386.rpm
	- 安装 

			rpm -ivh openfire-3.9.1-1.i386.rpm

	- 开启
		
			chkconfig openfire on
			service openfire start

	- 新建数据库
	
			#mysql -uroot -p
		
			mysql>create database openfire;
			mysql>use openfire;
			mysql>source /opt/openfire/resources/database/openfire_mysql.sql;  
			mysql>grant all privileges on openfire.* to admin@'localhost' identified by 'admin';
			mysql>flush privileges;

	- 设置 iptables,具体端口

			iptables -A INPUT -p tcp --dport 5222 -j ACCEPT  
			iptables -A INPUT -p tcp --dport 5223 -j ACCEPT  
			iptables -A INPUT -p tcp --dport 7443 -j ACCEPT  
			iptables -A INPUT -p tcp --dport 7070 -j ACCEPT 
			iptables -A INPUT -p tcp --dport 7777 -j ACCEPT 
			iptables -A INPUT -p tcp --dport 9090 -j ACCEPT  


	- 访问 web 管理界面完成安装

			http://ip:9090
