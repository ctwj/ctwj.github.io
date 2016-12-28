---
layout: post
title: "docker dns server"
data: 2016-10-11 11:09:11 
categories: linux
tags: linux
---

## docker 集群配置方案, DNS服务器配置

###网络规划

做一个简单的网络集群容易,进行有目的的网络划分,集群内有DNS服务器,负责各个容器之间的解析, web集群,数据库集群,消息队列等

服务器规划
	
	dns-server 192.168.87.254
	web-server1 192.168.87.1
    web-server2 192.168.87.2
    web-server3 192.168.87.3
    web-server4 192.168.87.4  
	web-server5 192.168.87.5
	web-server6 192.168.87.6
    database-master 192.168.87.11
    database-slave1 192.168.87.12
    database-slave2 192.168.87.13
    rabbimq-server  192.168.87.21

### 准备工作

如果需要能够配置ip地址, 需要指定一个网桥

`docker network create --driver=bridge --subnet=192.168.87.0/24 --gateway=192.168.87.1 --ip-range=192.168.87.0/24  jqbridge`

后面需要配置ip的容易要指定 `--net=jqbridge`

## DNS服务器配置 ##

启动一个dns服务器

	docker run -d -p 53:53/tcp -p 53:53/udp --cap-add=NET_ADMIN --net=jqbridge --ip=192.168.87.254 --name dns-server --hostname=dns-server andyshinn/dnsmasq

配置

`docker exec -it dns-server /bin/sh`  
首先配置上行的真正的dns服务器地址，毕竟你只是个本地代理，不了解外部规则。创建文件：  
`vi /etc/resolv.dnsmasq`
添加内容：  
>nameserver 114.114.114.114    
nameserver 8.8.8.8  
配置本地解析规则，这才是我们的真实目的。新建配置文件
`vi /etc/dnsmasqhosts`  
添加解析规则  
>192.168.87.254 dns-server  
192.168.87.10	haproxy  
192.168.87.2    web-server1   
192.168.87.3    web-server2   
192.168.87.4    web-server3    
192.168.87.11    database-master   
192.168.87.12    database-slave1   
192.168.87.13    database-slave2   
192.168.87.21    rabbimq-server      

修改dnsmasq配置文件，指定使用上述两个我们自定义的配置文件  
`vi /etc/dnsmasq.conf`  
修改下述两个配置  
>resolv-file=/etc/resolv.dnsmasq  
addn-hosts=/etc/dnsmasqhosts  

restart dns-server   
`docker restart dns-server`

###start docker container

0. ## haproxy ##

	haproxy config file `~/jq/haproxy/haproxy.cfg`
	
		global
		    log 127.0.0.1   local0
		    log 127.0.0.1   local1 notice
		    #log loghost    local0 info
		    maxconn 4096
		    chroot /var/haproxy
		    uid 99
		    gid 99
		    daemon
		        nbproc  1  
		    #debug
		    #quiet
		
		defaults
		    log global
		    mode    http
		    option  httplog
		    option  dontlognull
		    retries 3
		    option redispatch # 自动重定向到健康机器
		    maxconn 2000
		    timeout check 2000ms # 检查超时
		    timeout connect 5000ms # 连接超时
		    timeout client 50000ms # 客户端连接超时
		    timeout server 50000ms # 服务端连接超时
		
		
		frontend http_80_in 
		     bind 0.0.0.0:80
		     mode http
		     log global
		     option forwardfor
		     acl static_down nbsrv(static_server) lt 1
		     acl php_web url_reg /*.php$
		     acl static_web url_reg /*.(css|jpg|png|jpeg|js|gif)$
		     use_backend php_server if static_down
		     use_backend php_server if php_web
		     use_backend static_server if static_web
		
		backend php_server
		     mode http
		     balance source
		     cookie SERVERID
		     server php_server_1 192.168.87.2:80 cookie 1 check inter 2000 rise 3 fall 3 weight 2
		     server php_server_2 192.168.87.3:80 cookie 2 check inter 2000 rise 3 fall 3 weight 1
		     server php_server_bak 192.168.87.4:80 cookie 3 check inter 1500 rise 3 fall 3 backup
		
		backend static_server
		     mode http
		     option httpchk GET /test/index.html
		     server static_server_1 10.12.25.83:80 cookie 3 check inter 2000 rise 3 fall 3
		
		listen stats
		      bind 0.0.0.0:6553
		      mode http
		      transparent
		      log global
		      stats refresh 30s
		      stats uri / haproxy-stats
		      stats realm Haproxy \ statistic
		      stats auth admin:admin

	check config file  
	>docker run -it -v ~/jq/haproxy/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro --rm --name haproxy-syntax-check haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg

	$ docker run -d --name haproxy --hostname=haproxy -v ~/jq/haproxy/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro --ip=192.168.87.10 --net=jqbridge --dns=192.168.87.254 -p 80:80 -p 6553:6553 haproxy

1. ## webserver ##


	docker run -itd --name=web-server1 --hostname=web-server1 --ip=192.168.87.2 --net=jqbridge --dns=192.168.87.254  nginx

	docker run -itd --name=web-server2 --hostname=web-server2 --ip=192.168.87.3 --net=jqbridge --dns=192.168.87.254  nginx

	docker run -itd --name=web-server3 --hostname=web-server3 --ip=192.168.87.4 --net=jqbridge --dns=192.168.87.254  nginx

	
	 
2. ## MySQL Master-Slave Config ##


	0. docker mysql image useage

		config file
	
		- config_file	` -v /my/custom:/etc/mysql/conf.d`
		- data dir		` -v ~/jq/database/master_data:/var/lib/mysql`
		
		config without config file
	
		- data_path		` -v /my/own/datadir:/var/lib/mysql`
		- database		` -e MYSQL_DATABASE=my-secret-pw`
		- username		` -e MYSQL_USER`
		- password		` -e MYSQL_PASSWORD` 
		- root_password	` -e MYSQL_ROOT_PASSWORD=my-secret-pw`
	

	we need config master-slave first  

	1. create master database config file `~/jq/database/master_config/mysql.cnf`  
		>[mysql]
		>
		>[mysqld]  
		log-bin  
		server-id=1  
		binlog-do-db=jq_database  
		binlog-ignore-db=mysql 

	2. create dir save data  
		
		`mkdir -p ~/jq/database/master_data`  
		`mkdir -p ~/jq/database/slave_data1`  
		`mkdir -p ~/jq/database/slave_data2` 
		
	3. crate database-master container
	
		>**docker@windows:~$** docker run -d --name=database-master --hostname=database-master --ip 192.168.87.11 --net=jqbridge --dns=192.168.87.254 -e  MYSQL_ROOT_PASSWORD=123456 -v ~/jq/database/master_data:/var/lib/mysql -v ~/jq/database/master_config:/etc/mysql/conf.d mysql    
		24a4ae60b81f0656e61468014738163a5cc1d5f20e356f753e18bc828481493c    
		>**docker@windows:~$** docker exec -it database-master /bin/bash  
		>**root@database-master:/#** mysql -uroot -p123456  
		>**mysql>** create database jq_database default charset utf8;  
		>Query OK, 1 row affected (0.00 sec)  
		>**mysql>** use jq_database;  
		>Database changed  
		>**mysql>** create table test ( id int unsigned not null primary key auto_increment, username varchar(15) not null ) default charset utf8;  
		>Query OK, 0 rows affected (0.00 sec)  
		>**mysql>** grant replication slave on *.* to 'replication'@'%' identified by '123456';    
		>Query OK, 0 rows affected, 1 warning (0.01 sec)  
		>**mysql>** flush privileges;  
		>Query OK, 0 rows affected (0.00 sec)  
		>**mysql>** show master status;  
		
			+----------------------------+----------+--------------+------------------+-------------------+  
			| File                       | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |  
			+----------------------------+----------+--------------+------------------+-------------------+  
			| database-master-bin.000003 |     1219 | jq_database  | mysql            |                   |  
			+----------------------------+----------+--------------+------------------+-------------------+  

		>1 row in set (0.00 sec)  
		>**mysql>** exit  
		>Bye  
		>**root@database-master:/#** mysqldump -uroot -p jq_database > /tmp/jq.sql
		>**root@database-master:/#** exit
		>**docker@windows:~$** docker cp database-master:/tmp/jq.sql ~/
		
	4. create slave database config file `~/jq/database/slave_config1/mysql.cnf`  
		>[mysql]
		>
		>[mysqld]  
		server-id=2 
	
	5. create database-slave1 container

		>**docker@windows:~$** docker run -d --name=database-slave1 --hostname=database-slave1 --ip 192.168.87.12 --net=jqbridge --dns=192.168.87.254 -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_USER=replication -e MYSQL_PASSWORD=123456 -v ~/jq/database/slave_config1:/etc/mysql/conf.d  -v ~/jq/database/slave_data1:/var/lib/mysql mysql  
		>80ae42607b10fb193f7bcdc1009c3e148c58fdea19d29f4cb8ec63bfbc33ef71  
		>**docker@windows:~$** docker cp ~/jq.sql database-slave1:/jq.sql  
		>**docker@windows:~$** docker exec -it database-slave1 /bin/bash  
		>**root@database-slave1:/#** mysql -uroot -p123456  
		>**mysql>** create database jq_database default charset utf8;  
		>Query OK, 1 row affected (0.00 sec)  
		>
		>**mysql>** use jq_database;
		>Database changed  
		>
		>**mysql>** source /jq.sql;  
		>Query OK, 0 rows affected (0.00 sec) 
		>...   
		>
		>**mysql>** stop slave;  
		>Query OK, 0 rows affected, 1 warning (0.01 sec)  

		>**mysql>** change master to  
		    -> master_host = 'database-master',  
		    -> master_user = 'replication',  
		    -> master_password = '123456',  
		    -> master_log_file = 'database-master-bin.000003',  
		    -> master_log_pos = 1219;  
		>Query OK, 0 rows affected, 2 warnings (0.00 sec)    
		>
		>mysql> start slave;  
		>Query OK, 0 rows affected (0.03 sec)  
		>
	
	6. check result
	
		- login to database-master update database
			
				mysql> insert into test (`username`) values ('test');
				Query OK, 1 row affected (0.00 sec)
				
				mysql> select * from test;
				+----+----------+
				| id | username |
				+----+----------+
				|  1 | test     |
				+----+----------+
				1 row in set (0.00 sec)

		- login to database-slave1 select database
		
				mysql> select * from test;
				+----+----------+
				| id | username |
				+----+----------+
				|  1 | test     |
				+----+----------+
				1 row in set (0.00 sec)