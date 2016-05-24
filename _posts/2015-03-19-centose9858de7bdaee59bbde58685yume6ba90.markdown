---
author: ww
comments: true
date: 2015-03-19 13:37:03+00:00
layout: post
link: http://www.gl6.cc/blog/centos%e9%85%8d%e7%bd%ae%e5%9b%bd%e5%86%85yum%e6%ba%90.html
slug: centos%e9%85%8d%e7%bd%ae%e5%9b%bd%e5%86%85yum%e6%ba%90
title: Centos配置国内yum源
wordpress_id: 7
categories:
- Linux
- uncategorized
---

网易（163）yum源是国内最好的yum源之一 ，无论是速度还是软件版本，都非常的不错，将yum源设置为163yum，可以提升软件包安装和更新的速度，同时避免一些常见软件版本无法找到。具体设置方法如下：

1，进入yum源配置目录
cd /etc/yum.repos.d

2，备份系统自带的yum源
mv CentOS-Base.repo CentOS-Base.repo.bk
下载163网易的yum源：
wget http://mirrors.163.com/.help/CentOS6-Base-163.repo

3，更新玩yum源后，执行下边命令更新yum配置，使操作立即生效
yum makecache

4，除了网易之外，国内还有其他不错的yum源，比如中科大和搜狐的，大家可以根据自己需求下载
中科大的yum源：
wget [http://centos.ustc.edu.cn/CentOS-Base.repo](http://centos.ustc.edu.cn/CentOS-Base.repo)
sohu的yum源
wget [http://mirrors.sohu.com/help/CentOS-Base-sohu.repo](http://mirrors.sohu.com/help/CentOS-Base-sohu.repo)

。
