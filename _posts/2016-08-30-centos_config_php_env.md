---
layout: post
title: "服务器安装php环境"
data: 2016-08-30 11:09:11 
categories: javascript
tags: php
---

### centos配置

准备
----

	yum -y install gcc automake autoconf libtool make gcc-c++ openssl openssl-devel libmcrypt-devel mhash-devel libxslt-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel libxml2 libxml2-devel zlib zlib-devel glibc glibc-devel glib2 glib2-devel bzip2 bzip2-devel ncurses ncurses-devel curl curl-devel e2fsprogs e2fsprogs-devel krb5 krb5-devel libidn libidn-devel
   	cd /usr/local/src
   	wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.38.tar.gz 
   	wget http://zlib.net/zlib-1.2.8.tar.gz  
	wget http://www.openssl.org/source/openssl-1.0.1c.tar.gz  
   	wget http://nginx.org/download/nginx-1.4.2.tar.gz  
	wget http://museum.php.net/php5/php-5.6.9.tar.gz  
	//wget http://downloads.mysql.com/archives/mysql-5.1/mysql-5.1.70.tar.gz
	//70版本编译错误,换了个5.1.73版本编译成功

安装
----
1. prce
	
		tar -zxvf pcre-8.38.tar.gz  
		cd pcre-8.38  
		./configure && make && make install
		cd ..
2. zlib

   		tar -zxvf zlib-1.2.8.tar.gz 
   		cd zlib-1.2.8
   		./configure && make && make install
		cd ..

3. openssl
	
		tar -zxvf openssl-1.0.1c.tar.gz
		cd ..
4. nginx 

		tar -zxvf nginx-1.4.2.tar.gz  
		cd nginx-1.4.2
		./configure --sbin-path=/usr/local/etc/nginx/nginx --conf-path=/usr/local/etc/nginx/nginx.conf --pid-path=/usr/local/etc/nginx/nginx.pid --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.38 --with-zlib=/usr/local/src/zlib-1.2.8 --with-openssl=/usr/local/src/openssl-1.0.1c  
		make && make install
5. php

		tar -zxvf php-5.6.9.tar.gz  
		cd php-5.6.9
		./configure --prefix=/usr/local/etc/php  --enable-fpm --with-mcrypt --enable-mbstring --disable-pdo --with-curl --disable-debug  --disable-rpath --enable-inline-optimization --with-bz2  --with-zlib --enable-sockets --enable-sysvsem --enable-sysvshm --enable-pcntl --enable-mbregex --with-mhash --enable-zip --with-pcre-regex --with-mysql --with-mysqli --with-gd --with-jpeg-dir   
		make all install  
		cd ..
6.mysql

		tar -zxvf mysql-5.1.73.tar.gz
		cd mysql-5.1.73  
		./configure --prefix=/usr/local/etc/mysql --localstatedir=/usr/local/etc/mysql/var/ --with-server-suffix=-enterprise-gpl --without-debug --with-big-tables --with-extra-charsets=latin1,gb2312,big5,utf8,GBK --with-extra-charsets=all --with-pthread --enable-static --enable-thread-safe-client --with-client-ldflags=-all-static  --with-mysqld-ldflags=-all-static --enable-assembler --with-plugins=innobase 
		make && make install
		cd ..
		
配置
----

0. 准备
		
		groupadd www	
		useradd -g www www

1. php

		
		cd /usr/local/etc/php
		cp etc/php-fpm.conf.default etc/php-fpm.conf
	将php-fpm.conf中 user,group修改为

		user = www
		group = www
	启动php

		/usr/local/etc/php/sbin/php-fpm
	>**其它**  
	>php-fpm 关闭：
	>
            kill -INT `cat /usr/local/etc/php/var/run/php-fpm.pid`
    >php-fpm 重启：
	>
            kill -USR2 `cat /usr/local/etc/php/var/run/php-fpm.pid

2. nginx

	vim /usr/local/etc/nginx/nginx.conf 将server段配置为如下

		# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        location ~ \.php$ {
                root /user/local/www; #项目根目录
                fastcgi_pass 127.0.0.1:9000;                         fastcgi_index index.php;                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include fastcgi_params;                                                     
		}
	启动 nginx

		/usr/local/etc/nginx/nginx
	>**其它**  
	>	/usr/local/etc/nginx/nginx -s reload  # 重启

3. mysql
	
		cp /usr/local/src/mysql-5.1.73/support-files/my-medium.cnf /etc/my.conf	
		cp /usr/local/src/mysql-5.1.73/support-files/mysql.server /etc/init.d/mysqld		
		chmod +x /etc/init.d/mysqld
		chkconfig --add mysqld  
		chkconfig --level 35 mysqld on
		scripts/mysql_install_db --user=mysql
		cp /usr/local/etc/mysql/bin/mysql /usr/bin/
        cp /usr/local/etc/mysql/bin/mysqldump /usr/bin/
        cp /usr/local/etc/mysql/bin/mysqladmin /usr/bin/
		chown -R mysql:mysql /usr/local/etc/mysql  
		/etc/init.d/mysqld start  
		/usr/local/etc/mysql/bin/mysql_secure_installation

4. iptables

	>服务开启外网访问  
	>
	> 	#!/bin/bash
		/sbin/iptables -F
		/sbin/iptables -t nat -F
		/sbin/iptables -P INPUT DROP
		/sbin/iptables -P OUTPUT ACCEPT
		/sbin/iptables -P FORWARD ACCEPT
		/sbin/iptables -A INPUT -i lo -j ACCEPT
		/sbin/iptables -A INPUT -p icmp -j ACCEPT
		/sbin/iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
		/sbin/iptables -A INPUT -p tcp --dport 80 -j ACCEPT
		/sbin/iptables -A INPUT -p tcp --dport 22 -j ACCEPT
		/sbin/iptables -A INPUT -p tcp --dport 9001 -j ACCEPT