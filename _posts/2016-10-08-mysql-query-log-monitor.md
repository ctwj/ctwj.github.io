---
layout: post
title: "Mysql 日志监测"
data: 2016-10-08 11:09:11 
categories: php
tags: php 
---

### Mysql 日志监测


mysql配置
----
打开配置文件
在 mysqld 下面添加 log 配置

	log = "D:/xampp/mysql/mysql.log


重启 mysql

mariadb配置
----
打开配置文件
在 mysqld 下面添加 log 配置

	general_log = on
	general_log_file = "D:/xampp/mysql/mysql.sql"

查看配置结果
----

	 SHOW VARIABLES LIKE "general_log%";

当现实general_log = on 时配置成功


BareTail配置
----

推荐配置如下关键字的高亮
	FAULT
	ERROR
	INFO
	TRACE
	CREATE
	DESTROY   
	PHP Warning  
	PHP Fatal  
	PHP Notice  
	POST  
	Query


参考文章:[http://www.safecode.cc/index.php?p=/discussion/28/mysql-%E6%97%A5%E5%BF%97%E7%9B%91%E6%B5%8B#latest](http://www.safecode.cc/index.php?p=/discussion/28/mysql-%E6%97%A5%E5%BF%97%E7%9B%91%E6%B5%8B#latest)

下载地址[http://www.safecode.cc/index.php?p=/discussion/29/%E6%97%A5%E5%BF%97%E7%9B%91%E6%B5%8B%E5%B7%A5%E5%85%B7-baretail#latest](http://www.safecode.cc/index.php?p=/discussion/29/%E6%97%A5%E5%BF%97%E7%9B%91%E6%B5%8B%E5%B7%A5%E5%85%B7-baretail#latest)