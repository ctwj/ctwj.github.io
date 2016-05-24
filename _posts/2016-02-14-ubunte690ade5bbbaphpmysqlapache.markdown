---
author: ww
comments: true
date: 2016-02-14 07:06:07+00:00
layout: post
link: http://www.gl6.cc/blog/ubunt%e6%90%ad%e5%bb%baphpmysqlapache.html
slug: ubunt%e6%90%ad%e5%bb%baphpmysqlapache
title: Ubunt搭建PHP+mysql+apache
wordpress_id: 463
categories:
- database
- Linux
tags:
- mysql
- php
- ubuntu
---

Ubuntu建立(apache+php+mysql)+phpmyadmin
Ubuntu建立apache+php+mysql
基本的支持环境。暂时还不应用zend优化，因此这里就不涉及到zend optimizer的安装了。其实在ubuntu系统中中安装远比在windows系统中设置更为容易，而且在终端下设置更省事。
1、安装Apache服务
sudo apt-get install apache2
然后按照提示即完成apahce的安装了。这里 可以打开
http://127.0.0.1
，即可看于是It works
2、安装php5
sudo apt-get install php5
sudo apt-get install libapache2-mod-php5
sudo /etc/init.d/apache2 restart
OK之后，我们来查看一下是否生效了。
gksudo gedit /var/www/testphp.php
入探针
保存运行
http://127.0.0.1/testphp.php
3、安装mysql
sudo apt-get install mysql-server
安装完成按提示设置root密
4、让apache、php支持mysql
sudo apt-get install libapache2-mod-auth-mysql
sudo apt-get install php5-mysql
sudo /etc/init.d/apache2 restart
至此apache2+php 5.2.4.2+mysql5.0.51的环境就完成了。
========================================================
Ubuntu建立(apache+php+mysql)+phpmyadmin
自从成功从硬盘安装Ubuntu 8.04.1后，一直想在ubuntu 8.04.1环境下搭建WEB服务器，LAMP(Liunx+Apache+MySQL+PHP)+phpmyadmin理所当然就成为我的首眩最终我在 Ubuntu中文Wiki找到了安装配置LAMP WEB服务器最详细和全面的方法：
一.安装
1.安装LAMP
在新立得软件包管理器中选择 编辑－－使用任务分组标记软件包
在打开的窗口中 勾选 LAMP SERVER 然后确定。
在主窗口中 点击绿色的对号 应用 按钮
好了 。接下来就是等待…等待新立得 自动下载安装完。
中间会有一次提示输入mysql的root用户的密码
您还可以在终端模式下，通过命令行安装：
sudo apt-get install apache2 libapache2-mod-php5 php5 php5-gd mysql-server php5-mysql phpmyadmin
2.安装phpmyadmin
终端中运行命令
sudo apt-get install phpmyadmin
二.配置
1> apache 的配置文件路径 /etc/apache2/apache2.conf
2> php.ini 路径 /etc/php5/apache2/php5.ini
3> mysql配置文件 路径 /etc/mysql/my.cnf
4> phpmyadmin配置文件路径 /etc/phpmyadmin/apache.conf
5> 网站根目录 /var/www
1.配置apache
终端中 使用命令
sudo gedit /etc/apache2/apache2.conf
在配置文件最后面加入下面几行：
添加文件类型支持
AddType application/x-httpd-php .php .htm .html
默认字符集 根据自己需要
AddDefaultCharset UTF-8
服务器地址
ServerName 127.0.0.1
添加首页文件 三个的顺序可以换 前面的访问优先 （当然你也可以加别的 比如default.php）
DirectoryIndex index.htm index.html index.php
2.配置PHP5
这个没什么好说的 根据个人自己需要
下面是默认时区
;default.timezone=去掉前面的分号 后面加个PRC 。表示中华人民共和国（就是GMT＋8时区）
default.timezone= PRC
3.配置mysql
sudo gedit /etc/mysql/my.cnf
这里有一个地方要注意
因为默认是只允许本地访问数据库的 如果你有需要 可以打开。
bind-address 127.0.0.1这一句是限制只能本地访问mysql的。如果有需要其他机器访问 把这句话用#注释掉
#bind-address 127.0.0.1
4.配置phpmyadmin
phpmyadmin 默认并不是安装在 /var/www下面的而是在 /usr/share/phpmyadmin
你可以把phpmyadmin复制过去 或者 网上有人说你可以创建一个链接 然后把链接复制过去（没有试过）
然后 终端中运行命令
sudo gedit /etc/phpmyadmin/apache.conf
然后把下面两句的路径 改为/var/www/phpmyadmin
Alias /phpmyadmin /usr/share/phpmyadmin
改为：
Alias /phpmyadmin /var/www/phpmyadmin
符：常用命令
1.重启apache
sudo /etc/init.d/apache2 restart
2.重启mysql
sudo /etc/init.d/mysql restart
至此 LAMP环境配置成功,试一下 echo phpinfo(); 吧！
LAMP并没有那么神秘！除去下载的时间，整个配置过程决不会花费您五分钟。
GD库的安装
sudo apt-get install php5-gd
记得装完重启apache
sudo /etc/init.d/apache2 restart
启用 mod_rewrite 模块
sudo a2enmod rewrite
