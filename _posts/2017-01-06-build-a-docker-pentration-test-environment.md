---
layout: post
title: "Build a Docker Penetration Test evniroment"
data: 2016-10-11 11:09:11 
categories: linux
tags: linux
---

# 使用Docker构建一个渗透平台

今天我们通过Docker构建一个渗透平台, 不需要系统装任何环境.

准备工作,首先架设docker已经装好了,默认docker-machine的ip为192.168.99.100

>**下载容器**  
>$ docker pull owasp/zap2docker-stable  
>$ docker pull benoitg/dvwa  
>$ docker pull jmbmxer/threadfix  
>$ docker pull remnux/metasploit  


1. Zap

	>$ docker run -u zap -p 5900:5900 -p 8080:8080 -v /tmp/reports:/home/zap/reports --name zap  -i owasp/zap2docker-stable x11vnc --forever --usepw --create
	
	>**启动SVN**  
	>open /System/Library/coreServices/Applications/Screen\ Sharing.app/  
	
	或者使用快捷键 [command]+[space],然后输入Screen Sharing

	![](http://i.imgur.com/XsbCwj4.jpg)

	输入`192.168.99.100`和设置密码,根据Zap的手册,就可以配置好ZAP了.

	![](http://i.imgur.com/CDHWyGw.jpg) 

	提示使用 0.0.0.0, 否则下次重启容器,ip可能就变了.

2. DVWA

	>**dvwa环境**    
	>$ docker run --name dvwa -p 8082:80 -d benoitg/dvwa  
	>**等待启动完成**  
	>$ docker  logs -f dvwa   
	
	现在可以使用自己本地ip访问dvwa了 

	![](http://i.imgur.com/YY9t0GV.jpg)

3. ThreadFix

	>**Threadfix**
	>$ docker run -d -p 8443:8443 --name threadfix jmbmxer/threadfix start
	
	打开浏览器并登录 https://192.168.99.100:8443/threadfix 就可以开始使用了。
	
4. Metasploit

	>$ docker run -it -p 443:443 -v ~/.msf4:/root/.msf4 -v /tmp/msf:/tmp/data --name=msf remnux/metasploit  
	
5. QuasiBot	

	>git clone https://github.com/Smaash/quasibot.git   
	>$ docker run -itd -p 80:80 --name=web nickistre/ubuntu-lamp. 
	>$ docker cp ./quasibot web:/var/www/html  
	>$ docker exec -it web apt-get install php5-curl  
	>$ docker exec -it web /etc/init.d/apache2 restart    
	
	进入容器将`/var/www/html/quasibot`内容移到上一层目录。  
	配置 `/var/www/html/config.php` 的mysql密码为空。  
	访问 https://192.168.99.100 输入 quasi:changeme  登陆系统
	
	
6. 


参考 http://softwaretester.info/build-a-docker-penetration-test-environment/