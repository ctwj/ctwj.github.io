---
author: ww
comments: true
date: 2015-05-12 02:06:01+00:00
layout: post
link: http://www.gl6.cc/blog/phpstrom%e9%80%9a%e8%bf%87sftp%e7%99%bb%e9%99%86centos%e8%bf%9b%e8%a1%8c%e8%bf%9c%e7%a8%8b%e5%bc%80%e5%8f%91%e9%85%8d%e7%bd%ae.html
slug: phpstrom%e9%80%9a%e8%bf%87sftp%e7%99%bb%e9%99%86centos%e8%bf%9b%e8%a1%8c%e8%bf%9c%e7%a8%8b%e5%bc%80%e5%8f%91%e9%85%8d%e7%bd%ae
title: PHPStrom通过sftp登陆Centos进行远程开发配置
wordpress_id: 88
categories:
- PHP
tags:
- PHPStrom
- sftp
---

1、创建sftp组
# groupadd sftp  

2、创建一个sftp用户，名为mysftp 并添加密码
# useradd -g sftp -s /bin/false mysftp
# passwd mysftp

4、配置sshd_config
编辑 /etc/ssh/sshd_config

# vim +132 /etc/ssh/sshd_config  
找到如下这行，并注释掉
Subsystem      sftp    /usr/libexec/openssh/sftp-server  

添加如下几行
Subsystem       sftp    internal-sftp  
Match Group sftp  
ChrootDirectory /usr
ForceCommand    internal-sftp  
AllowTcpForwarding no  
X11Forwarding no  

根目录权限必须为755 只有文件的所有者才能写入文件,可以在根目录新建目录再分配所有者

5、设定Chroot目录权限
# chgrp -R sftp /usr
# chmod -R 755 /usr
# chmod -R 755 /usr/www
# chown -R sftp /usr/www
这里权限设置有要求，如果设置成775 会连接不上提示失败

6. 打开PHPStrom  File->Settings->Deployment
类型选择sftp
其它按照设置填入 点击 Test SFTP connection 通过即可

6. 设置Mapping选项卡 local path 为本地目录

7. 打开远程目录 Tools->Deployment->Brose Remote Host

