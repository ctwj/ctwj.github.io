---
author: ww
comments: true
date: 2016-01-31 08:35:18+00:00
layout: post
link: http://www.gl6.cc/blog/centos%e4%b8%8b%e7%94%a8yum%e9%85%8d%e7%bd%aephpmysqlapache.html
slug: centos%e4%b8%8b%e7%94%a8yum%e9%85%8d%e7%bd%aephpmysqlapache
title: CentOS下用yum配置php+mysql+apache
wordpress_id: 457
categories:
- Linux
tags:
- centos
---

1. 安装Apahce, PHP, Mysql, 以及php连接mysql库组件。
yum -y install httpd php mysql mysql-server php-mysql

2. 配置开机启动服务
/sbin/chkconfig httpd on [设置apache服务器httpd服务开机启动]
/sbin/chkconfig --add mysqld [在服务清单中添加mysql服务]
/sbin/chkconfig mysqld on [设置mysql服务开机启动]

/sbin/service httpd start [启动httpd服务,与开机启动无关]
/sbin/service mysqld start [启动mysql服务,与开机无关]

3.设置mysql数据库root帐号密码。
mysqladmin -uroot password 'newpassword' [引号内填密码]

4. 让mysql数据库更安全
mysql -uroot -p [此时会要求你输入刚刚设置的密码，输入后回车即可]

mysql> DROP DATABASE test; [删除test数据库]
mysql> DELETE FROM mysql.user WHERE user = ''; [删除匿名帐户]
mysql> FLUSH PRIVILEGES; [重载权限]

5. 按照以上的安装方式, 配置出来的默认站点目录为/var/www/html/新建一个php脚本:
<?




phpinfo();
?>

6. 新建一个数据库，添加一个数据库用户，设置用户权限。写个php脚本测试一下数据库连接吧。
mysql> CREATE DATABASE my_db;
mysql> GRANT ALL PRIVILEGES ON my_db.* TO 'user'@'localhost' IDENTIFIED BY 'password';

//安装apache扩展
yum -y install httpd-manual mod_ssl mod_perl mod_auth_mysql
//安装php的扩展
yum install php-gd
yum -y install php-gd php-xml php-mbstring php-ldap php-pear php-xmlrpc
//安装mysql扩展
yum -y install mysql-connector-odbc mysql-devel libdbi-dbd-mysql




 




================================ 我是分隔线 ================================




 




如果您够幸运，通过以上步骤已经安装好php，mysql，apache及相关的组件及库支持了，下面要做的就是通过修改配置文件使其联系起来。




1、修改php配置文件php.ini




这个文件依你安装的版本和目录不同，可能是/etc/php.ini 或者 /etc/php/php.ini,也可能是 /usr/local/etc/php/php.ini，修改register-golbals = Off 为 register-golbals = On 状态。




 




2、修改apache配置文件httpd.conf




 




首先找到AddType部分，在其后加入如下两句：




AddType application/x-httpd-php .php .php3 
AddType application/x-httpd-php-source .phps
再找到LoadModule部分，在其后加入如下两句：




LoadModule mysql_auth_module modules/mod_auth_mysql.so
LoadModule php5_module modules/libphp5.so
需要注意的是，so文件依版本不同而可能名称不同，请根据实际情况命名，同时要注意modules目录下是否存在该文件，如果不存在，说明相应的模块没有安装。




 




重启apache。




 




================================ 我是分隔线 ================================




 




如果您够幸运，目前php+mysql+apache都已经能够正常协同工作了，只要把DedeCMS的相关文件上传到www目录，按照提示进行安装即可了。
