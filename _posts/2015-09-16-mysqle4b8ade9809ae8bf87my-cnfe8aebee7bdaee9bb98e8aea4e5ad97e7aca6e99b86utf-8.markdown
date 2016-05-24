---
author: ww
comments: true
date: 2015-09-16 02:53:17+00:00
layout: post
link: http://www.gl6.cc/blog/mysql%e4%b8%ad%e9%80%9a%e8%bf%87my-cnf%e8%ae%be%e7%bd%ae%e9%bb%98%e8%ae%a4%e5%ad%97%e7%ac%a6%e9%9b%86utf-8.html
slug: mysql%e4%b8%ad%e9%80%9a%e8%bf%87my-cnf%e8%ae%be%e7%bd%ae%e9%bb%98%e8%ae%a4%e5%ad%97%e7%ac%a6%e9%9b%86utf-8
title: mysql中通过my.cnf设置默认字符集utf-8
wordpress_id: 135
categories:
- database
- uncategorized
tags:
- mysql
---

设置如下参数即可，如果启用了安全模式用 mysqld_safe --user=mysql & 启动
如果报错，直接运行 mysqld 能看到详细信息

[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
