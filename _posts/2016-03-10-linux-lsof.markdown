---
author: ww
comments: true
date: 2016-03-10 12:16:00+00:00
layout: post
link: http://www.gl6.cc/blog/linux-lsof.html
slug: linux-lsof
title: '[linux] lsof'
wordpress_id: 527
categories:
- Linux
---

**常用参数**
lsof语法格式是：
lsof ［options］ filename

    
    lsof abc.txt 显示开启文件abc.txt的进程
    lsof -c abc 显示abc进程现在打开的文件
    lsof -c -p 1234 列出进程号为1234的进程所打开的文件
    lsof -g gid 显示归属gid的进程情况
    lsof +d /usr/local/ 显示目录下被进程开启的文件
    lsof +D /usr/local/ 同上，但是会搜索目录下的目录，时间较长
    lsof -d 4 显示使用fd为4的进程
    lsof -i 用以显示符合条件的进程情况
    lsof -i[46] [protocol][@hostname|hostaddr][:service|port]
    --> IPv4 or IPv6
      protocol --> TCP or UDP
      hostname --> Internet host name
      hostaddr --> IPv4地址
      service --> /etc/service中的 service name (可以不止一个)
      port --> 端口号 (可以不止一个)


**实用命令**

    
    lsof `which httpd` //那个进程在使用apache的可执行文件
    lsof /etc/passwd //那个进程在占用/etc/passwd
    lsof /dev/hda6 //那个进程在占用hda6
    lsof /dev/cdrom //那个进程在占用光驱
    lsof -c sendmail //查看sendmail进程的文件使用情况
    lsof -c courier -u ^zahn //显示出那些文件被以courier打头的进程打开，但是并不属于用户zahn
    lsof -p 30297 //显示那些文件被pid为30297的进程打开
    lsof -D /tmp 显示所有在/tmp文件夹中打开的instance和文件的进程。但是symbol文件并不在列
    
    lsof -u1000 //查看uid是100的用户的进程的文件使用情况
    lsof -utony //查看用户tony的进程的文件使用情况
    lsof -u^tony //查看不是用户tony的进程的文件使用情况(^是取反的意思)
    lsof -i //显示所有打开的端口
    lsof -i:80 //显示所有打开80端口的进程
    lsof -i -U //显示所有打开的端口和UNIX domain文件
    lsof -i UDP@[url]www.akadia.com:123 //显示那些进程打开了到www.akadia.com的UDP的123(ntp)端口的链接
    lsof -i tcp@ohaha.ks.edu.tw:ftp -r //不断查看目前ftp连接的情况(-r，lsof会永远不断的执行，直到收到中断信号,+r，lsof会一直执行，直到没有档案被显示,缺省是15s刷新)
    lsof -i tcp@ohaha.ks.edu.tw:ftp -n //lsof -n 不将IP转换为hostname，缺省是不加上-n参数
