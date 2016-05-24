---
author: ww
comments: true
date: 2016-02-18 15:00:58+00:00
layout: post
link: http://www.gl6.cc/blog/mysql-%e5%ae%89%e8%a3%85msyql%e6%9c%8d%e5%8a%a1%e5%8f%af%e4%bb%a5%e5%a4%9a%e4%b8%aa.html
slug: mysql-%e5%ae%89%e8%a3%85msyql%e6%9c%8d%e5%8a%a1%e5%8f%af%e4%bb%a5%e5%a4%9a%e4%b8%aa
title: '[mysql] 安装msyql服务,可以多个'
wordpress_id: 473
categories:
- database
- uncategorized
tags:
- mysql
---


	
  1. 下载免安装包并解压到目录


链接：http://pan.baidu.com/s/1gdXMwmv 密码：fuq7

2. 配置文件

可以在目录里面找到样版配置,并选择合适的修改

改名成my.ini, 如果需要安装多个,这里端口不能重复

    
    [client]
    port		= 3307
    socket		= MySQL
    default-character-set = utf8
    
    [mysqld]
    basedir		= H:/mysql5.1
    datadir		= H:/mysql5.1/data
    default-character-set = utf8
    port		= 3307
    socket		= MySQL
    skip-locking
    key_buffer_size = 256M
    max_allowed_packet = 1M
    table_open_cache = 256
    sort_buffer_size = 1M
    read_buffer_size = 1M
    read_rnd_buffer_size = 4M
    myisam_sort_buffer_size = 64M
    thread_cache_size = 8
    query_cache_size= 16M
    thread_concurrency = 8
    
    
    log-bin=mysql-bin
    binlog_format=mixed
    server-id	= 2
    
    
    [mysqldump]
    quick
    max_allowed_packet = 16M
    
    [mysql]
    no-auto-rehash
    # Remove the next comment character if you are not familiar with SQL
    #safe-updates
    
    [myisamchk]
    key_buffer_size = 128M
    sort_buffer_size = 128M
    read_buffer = 2M
    write_buffer = 2M
    
    [mysqlhotcopy]
    interactive-timeout
    


3. 安装成服务

进入 bin目录 执行安装命令

mysqld --install mysql51

安装多个的话 服务名不能重复


