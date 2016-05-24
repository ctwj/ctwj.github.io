---
layout: post
title: "[Mysql] 主从复制"
data: 2016-05-23 16:31:32
categories: database
tags: mysql
---

## mysql 主从复制  ##


为了方便使用两台相同配置虚拟机测试

	mysql版本: `5.5.40-0ubuntu0.14.04.1 (Ubuntu)`
	1. master  192.168.0.71
	2. slaver  192.168.0.72

### 配置 master

	{% highlight php %}
	#bind-address = 127.0.0.1 #注释掉这个
	log_bin       = /var/log/mysql/mysql-bin.log 
	server-id     = 71
	binlog-do-db  = test #同步的数据库名
	binlog-ignore_db = mysql # 避免同步的数据库
	{% endhighlight %}

### 配置 slaver
	{% highlight php %}
	#bind-address = 127.0.0.1 #注释掉这个
	log_bin       = /var/log/mysql/mysql-bin.log 
	server-id     = 72
	binlog-do-db  = test #同步的数据库名
	{% endhighlight %}

### 重启mysql服务 
	/etc/init.d/mysql restart
### 在master(71)上创建数据库,并授权

	mysql> create database ms charset utf8;
	Query OK, 1 row affected (0.00 sec)

	mysql> grant replication slave on *.* to 'test'@'192.168.0.72' identified by 'pass';
	Query OK, 0 row affected (0.00 sec)

	mysql> flush privileges;
	Query OK, 0 row affected (0.00 sec)

	mysql> show master status;
	+------------+----------+--------------+----------------+
	|File        |Position  |Binlog_Do_DB  |Binlog_Ignore_DB|
	+------------+----------+--------------+----------------+
    |mysql-bin.05|       107|test          |mysql           |
	+------------+----------+--------------+----------------+
	Query OK, 1 row affected (0.00 sec)

	配置完成后,停止master数据库的操作
	
### 配置slave(72)

	mysql> change master to master_host='192.168.0.71',master_user='test',master_password='test',master_log_file='mysql_log_file'='mysql-bin.000005',master_log_pos=107;
	Query OK, 0 row affected (0.00 sec)

	mysql> start slave;
	Query OK, 0 row affected (0.00 sec)

	mysql> show slave status\G;
![slave status](http://i2.buimg.com/fd8c87737d01430c.png)
	
如果配置成功, Slave_IO_Running和Slave_SQL_Running 都是Yes,如果错误,下面会显示信息 Last_IO_Error,没有连接上.
最后悲催发现slave ip地址改变了,变成73.
![](http://i4.buimg.com/07ae7e3be0b6f31d.png)

	master重新授权
![](http://i4.buimg.com/d47c01b09a49a472.jpg)

	slave 重新配置
![](http://i4.buimg.com/c432828441f0a15f.jpg)

### 测试
1. master: 服务器上没有test,创建数据库
	![create test](http://i4.buimg.com/895f913b8c9260c2.png)
2. slave: 没有任何操作, 出现test数据库
	![show database](http://i4.buimg.com/65b3617282a8358e.jpg)


注:
ERROR 1221 (HY000): Incorrect usage of DB GRANT and GLOBAL PRIVILEGES 
如果出现这个错误是,指定了单个数据库,然而 replication,slave是不能授权个单个数据库的



	