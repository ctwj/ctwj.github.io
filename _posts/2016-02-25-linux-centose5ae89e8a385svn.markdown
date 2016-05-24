---
author: ww
comments: true
date: 2016-02-25 03:14:35+00:00
layout: post
link: http://www.gl6.cc/blog/linux-centos%e5%ae%89%e8%a3%85svn.html
slug: linux-centos%e5%ae%89%e8%a3%85svn
title: '[linux] centos安装svn'
wordpress_id: 496
categories:
- Linux
tags:
- svn
- 版本控制器
---

1.安装

yum install -y subversion



2.验证是否安装

svnserve --version

3.创建版本库

mkdir /var/svn

svnadmin create /var/svn/repophp

4.配置

cd /var/svn/repophp

    
    #vim svnserve.conf
    #修改[general]下面
    password-db = passwd
    authz-db = authz
    anon-access = none #禁止非法访问
    



    
    #vim passwd
    [users]
    ww = ww   #添加密码为ww的用户ww
    



    
    #vim authz
    #修改[groups]添加组
    phpuser = ww
    #添加权限
    [repophp:/]
    @phpuser = rw
    


5. 启动svn

svnserve　-d -r /var/svn

6. 关闭

ps aux | grep svn

kill -i 进程id

7. 开放svn端口

iptables -I INPUT -p tcp --dport 3690 -j ACCEPT

service iptables save
