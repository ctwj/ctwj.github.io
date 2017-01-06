---
layout: post
title: "Build a Docker Penetration Test evniroment"
data: 2016-10-11 11:09:11 
categories: linux
tags: linux
---

# 使用Docker构建一个渗透平台

今天我们通过Docker构建一个渗透平台, 不需要系统装任何环境.

准备工作,首先架设docker已经装好了

>**下载容器**  
>$ docker pull owasp/zap2docker-stable  
>$ docker pull citizenstig/dvwa  
>$ docker pull jmbmxer/threadfix  


1. Zap

	>$ docker run -u zap -p 5900:5900 -p 8080:8080 -v /tmp/reports:/home/zap/reports --name zap  -i owasp/zap2docker-stable x11vnc --forever --usepw --create
	
	>**启动SVN**  
	>open /System/Library/coreServices/Applications/Screen\ Sharing.app/  
	
	或者使用快捷键 [command]+[space],然后输入Screen Sharing

	![](http://i.imgur.com/XsbCwj4.jpg)

	输入`localhost`和设置密码,根据Zap的手册,就可以配置好ZAP了.

	![](http://i.imgur.com/CDHWyGw.jpg) 

	提示使用 0.0.0.0, 否则下次重启容器,ip可能就变了.

2. DVWA

	>**dvwa环境**
	>$ docker run -d -p 8081:80 --name dvwa citizenstig/dvwa  
	>**等待启动完成**  
	>$ docker  logs -f dvwa   
	
	现在可以使用自己本地ip访问dvwa了 

	![](http://i.imgur.com/YY9t0GV.jpg)

3. ThreadFix


参考 http://softwaretester.info/build-a-docker-penetration-test-environment/