---
author: ww
comments: true
date: 2015-03-28 06:53:43+00:00
layout: post
link: http://www.gl6.cc/blog/mysqlnd%e6%8f%92%e4%bb%b6mysqlnd_ms%e7%9a%84%e4%bb%8b%e7%bb%8d.html
slug: mysqlnd%e6%8f%92%e4%bb%b6mysqlnd_ms%e7%9a%84%e4%bb%8b%e7%bb%8d
title: mysqlnd插件mysqlnd_ms的介绍
wordpress_id: 25
categories:
- PHP
- uncategorized
---

从PHP5.3开始, MySQL team专为PHP开发的MySQL连接库mysqlnd(MySQL native driver for PHP)终于和PHP一起发布了. mysqlnd的主要目的是为了解决长久以来mysql和php的license的问题. 它将作为PHP的源代码的一部分和PHP一起发布.

今天, 我要为大家介绍一个mysqlnd的插件:mysqlnd_ms, 这个插件是由mysqlnd的开发者Andrey Hristov,[Ulf Wendel](http://blog.ulf-wendel.de/)和[johannes](http://schlueters.de/blog/)一起开发的, 目前发布在PECL: [mysqlnd_ms](http://pecl.php.net/package/mysqlnd_ms)

在这个扩展的介绍页面我们可以看到它的功能描述:


<blockquote>The replication and load balancing plugin is a plugin for the mysqlnd library. It can be used with PHP MySQL extensions (ext/mysql, ext/mysqli, PDO_MySQL). if they are compiled to use mysqlnd. The plugin inspects queries to do read-write splitting. Read-only queries are send to configured MySQL replication slave servers all other queries are redirected to the MySQL replication master server. Very little, if any, application changes required, dependent on the usage scenario required.</blockquote>


这个扩展, 主要实现了, 连接保持和切换, 负载均衡和读写分离等, 也就是说, 这个扩展会去分别PHP发给MySQL的query, 如果是”读”的query, 就会把query发送给从库(配置中指明), 并且支持负载均衡; 而如果是”写”的query, 就会把query发送给主库.

不过这个扩展需要搭配mysqlnd一起使用(从PHP5.4 beta1开始, 我们已经把mysqlnd作为mysql, mysqli, pdo的默认链接目标, 当然, 你也可以通过–with-mysql=***来制定你想要链接到libmysql).

这个扩展使用的方法也很简单, 首先在**php.ini**中定义配置:

    
    mysqlnd_ms.enable=1
    mysqlnd_ms.ini_file=/path/to/mysqlnd_ms_plugin.ini
    


之后, 在你指明的mysqlnd_ms_plugin.ini中配置好MySQL的主从库就好了:

    
    [myapp]
    master[]=localhost:/tmp/mysql.sock
    slave[]=192.168.2.27:3306


**博文发出以后, Ulf提醒我, 从1.1.0开始, 配置文件改为JSON格式:**


<blockquote>Ulf_Wendel: @laruence >Thx for the blog. Please note, mysqlnd_ms config format was changed in 1.1.0. Now JSON based</blockquote>


所以新的配置应该类似于如下格式:

    
    {
        "myapp": {
            "master": {
                "master_0": {
                    "host": "localhost",
                    "socket": "\/tmp\/mysql.sock"
                }
            },
            "slave": {
                "slave_0": {
                    "host": "192.168.2.27",
                    "port": "3306"
                }
            }
        }
    }
    


链接方式修改如下:

    
     <?php
    /* Load balanced following "myapp" section rules from the plugins config file */
    $mysqli = new mysqli("myapp", "username", "password", "database");
    $pdo = new PDO('mysql:host=myapp;dbname=database', 'username', 'password');
    $mysql = mysql_connect("myapp", "username", "password");
    ?>


然后就和你之前一样的来开发了.
