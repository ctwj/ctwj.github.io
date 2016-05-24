---
author: ww
comments: true
date: 2015-03-19 09:04:59+00:00
layout: post
link: http://www.gl6.cc/blog/centos_6-5%e5%ae%89%e8%a3%85nginxphpmysql.html
slug: centos_6-5%e5%ae%89%e8%a3%85nginxphpmysql
title: CentOS_6.5安装Nginx+PHP+MySQL
wordpress_id: 5
categories:
- Linux
- uncategorized
---

准备工作
安装make
yum -y install gcc automake autoconf libtool make
安装g++
yum install gcc gcc-c++
下面正式开始
---------------------------------------------------------------------------
一般我们都需要先装pcre, zlib，前者为了重写rewrite，后者为了gzip压缩。
可以是任何目录，本文选定的是/data/soft/src
一：Nginx安装
cd /data/soft/src
1.安装PCRE库
ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/ 下载最新的 PCRE 源码包，使用下面命令下载编译和安装 PCRE 包：
cd /data/soft/src
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.34.tar.gz
tar -zxvf pcre-8.34.tar.gz
cd pcre-8.34
./configure
make
make install
2.安装zlib库
http://zlib.net/zlib-1.2.8.tar.gz 下载最新的 zlib 源码包，使用下面命令下载编译和安装 zlib包：
cd /data/soft/src
wget http://zlib.net/zlib-1.2.8.tar.gz
tar -zxvf zlib-1.2.8.tar.gz
cd zlib-1.2.8
./configure
make
make install
3.安装ssl（某些vps默认没装ssl)
cd /data/soft/src
wget http://www.openssl.org/source/openssl-1.0.1c.tar.gz
tar -zxvf openssl-1.0.1c.tar.gz
yum -y install openssl openssl-devel
4.安装nginx
Nginx 一般有两个版本，分别是稳定版和开发版，您可以根据您的目的来选择这两个版本的其中一个，下面是把 Nginx 安装到 /data/soft/nginx 目录下的详细步骤：
cd /data/soft/src
wget http://nginx.org/download/nginx-1.4.2.tar.gz
tar -zxvf nginx-1.4.2.tar.gz
cd nginx-1.4.2
./configure --sbin-path=/data/soft/nginx/nginx \--conf-path=/data/soft/nginx/nginx.conf \--pid-path=/data/soft/nginx/nginx.pid \--with-http_ssl_module \--with-pcre=/data/src/pcre-8.34 \--with-zlib=/data/src/zlib-1.2.8 \--with-openssl=/data/src/openssl-1.0.1c
make
make install
安装成功后 /data/soft/nginx 目录下如下:
fastcgi.conf koi-win nginx.conf.default
fastcgi.conf.default logs scgi_params
fastcgi_params mime.types scgi_params.default
fastcgi_params.default mime.types.default uwsgi_params
html nginx uwsgi_params.default
koi-utf nginx.conf win-utf
5.启动
确保系统的 80 端口没被其他程序占用，运行/data/soft/nginx/nginx 命令来启动 Nginx，
netstat -ano|grep 80
如果查不到结果后执行，有结果则忽略此步骤
sudo /usr/local/nginx/nginx
打开浏览器访问此机器的 IP，如果浏览器出现 Welcome to nginx! 则表示 Nginx 已经安装并运行成功。
到这里nginx就安装完成了，如果只是处理静态html就不用继续安装了，如果你需要处理php脚本的话，还需要安装php-fpm。
6.Nginx开机启动
echo "/data/soft/nginx/sbin/nginx" >> /etc/rc.local
二：编译安装php-fpm
PHP-FPM是一个PHP FastCGI管理器，是只用于PHP的,可以在 http://php-fpm.org/download下载得到.
PHP-FPM其实是PHP源代码的一个补丁，旨在将FastCGI进程管理整合进PHP包中。必须将它patch到你的PHP源代码中，在编译安装PHP后才可以使用。
新版PHP已经集成php-fpm了，不再是第三方的包了，推荐使用。PHP-FPM提供了更好的PHP进程管理方式，可以有效控制内存和进程、可以平滑重载PHP配置，比spawn-fcgi具有更多优点，所以被PHP官方收录了。在./configure的时候带 –enable-fpm参数即可开启PHP-FPM，其它参数都是配置php的，具体选项含义可以到这里查看：http://www.php.net/manual/en/configure.about.php。
安装前准备
centos下执行(自动安装gcc)
yum -y install gcc automake autoconf libtool make
yum -y install gcc gcc-c++ glibc
yum -y install libmcrypt-devel mhash-devel libxslt-devel \
libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel libxml2 libxml2-devel \
zlib zlib-devel glibc glibc-devel glib2 glib2-devel bzip2 bzip2-devel \
ncurses ncurses-devel curl curl-devel e2fsprogs e2fsprogs-devel \
krb5 krb5-devel libidn libidn-devel openssl openssl-devel
1.php-fpm安装(推荐安装方式)
cd /data/soft/src
wget http://museum.php.net/php5/php-5.4.7.tar.gz
tar zvxf php-5.4.7.tar.gz
cd php-5.4.7
./configure --prefix=/data/soft/php --enable-fpm --with-mcrypt \--enable-mbstring --disable-pdo --with-curl --disable-debug --disable-rpath \--enable-inline-optimization --with-bz2 --with-zlib --enable-sockets \--enable-sysvsem --enable-sysvshm --enable-pcntl --enable-mbregex \--with-mhash --enable-zip --with-pcre-regex --with-mysql --with-mysqli \--with-gd --with-jpeg-dir
make all install
2.以上就完成了php-fpm的安装。
下面是对php-fpm运行用户进行设置
cd /data/soft/php
cp etc/php-fpm.conf.default etc/php-fpm.conf
vi etc/php-fpm.conf
修改
user = www
group = www
如果www用户不存在，那么先添加www用户
groupadd www
useradd -g www www
3.修改nginx配置文件以支持php-fpm
修改nginx配置文件为,nginx.conf
其中server段增加如下配置：
# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
location ~ \.php$ {
root /data/www; #项目根目录
fastcgi_pass 127.0.0.1:9000;
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
include fastcgi_params;
}
4.创建测试php文件
创建php文件
在/data/www下创建index.php文件，输入如下内容：
<?php
echo phpinfo();
?>
5.启动php-fpm服务
/data/soft/php/sbin/php-fpm
重启nginx服务器：
/data/nginx/nginx -s reload
6.php-fpm关闭与重启
php-fpm 关闭：
kill -INT `cat /data/soft/php/var/run/php-fpm.pid`
php-fpm 重启：
kill -USR2 `cat /data/soft/php/var/run/php-fpm.pid`
7.php-fpm开机启动
echo "/data/soft/php/sbin/php-fpm" >> /etc/rc.local
三：mysql安装
cd /data/soft/src
wget http://downloads.mysql.com/archives/mysql-5.1/mysql-5.1.70.tar.gz
tar -zxvf mysql-5.1.70.tar.gz
cd mysql-5.1.70
yum install ncurses ncurses-devel
./configure '--prefix=/data/soft/mysql' '--without-debug' '--with-charset=utf8' '--with-extra-charsets=all' '--enable-assembler' '--with-pthread' '--enable-thread-safe-client' '--with-mysqld-ldflags=-all-static' '--with-client-ldflags=-all-static' '--with-big-tables' '--with-readline' '--with-ssl' '--with-embedded-server' '--enable-local-infile' '--with-plugins=innobase' make
make install
到此mysql就安装到了/data/soft/mysql路径下，下面开始mysql的配置工作
------------------------------------
安装mysql选项文件
cp support-files/my-medium.cnf /etc/my.cnf
mysql设置开机自启动
cp -r support-files/mysql.server /etc/init.d/mysqld
/sbin/chkconfig --del mysqld
/sbin/chkconfig --add mysqld
配置权限表
chown -R mysql:mysql /data/soft/mysql
/data/soft/mysql/bin/mysql_install_db --user=mysql
启动mysql
/etc/init.d/mysqld start
mysql初始化配置：
export PATH=/data/soft/mysql/bin:$PATH
/data/soft/mysql/bin/mysql_secure_installation
注：这里根据提示设置mysql的root密码
到这里mysql安装完成了， 我们开始使用客户端连接mysql
如果报错：
SQL Error (1130): Host '192.168.1.100' is not allowed to connect to this MySQL server
首先按下面的步骤登录Mysql服务器
登录mysql需要切换到dos下的mysql的bin目录，进行如下操作：
#mysql -uroot -ppassword
mysql>use mysql;
mysql>update user set host = '%' where user ='root';
mysql>flush privileges;
mysql>select 'host','user' from user where user='root';
mysql>quit
OK。远程连接成功！
