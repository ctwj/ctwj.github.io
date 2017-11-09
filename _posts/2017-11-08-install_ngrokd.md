---
author: ww
date: 2017-11-09 01:15:57+00:00
title: 使用docker安装ngrok服务
categories:
- Linux
tags:
- linux
- ngrok
---

#Ngrok 服务器搭建

##0x0 前言

为什么会需要这个ngrok，是为了解内网到外网的映射，也许有同学说路由器来个端口映射就能解决问题，那还有个条件，你的运营商没有把你放到一个大的局域网。  
ngrok应用的最多的场景是微信开发。


##0x1 准备工作

1. 另外需要一个稳定的外网服务器。 下面相关操作都在这个服务器进行。假设这个服务器叫**server**

2. 考虑到易操作性， 直接选用docker容器进行服务器布署。  
	>`https://hub.docker.com/r/hteen/ngrok`  
	 直接运行命令 `docker pull hteen/ngrok` 拉回*image 

3. 另外还需要一个域名。  `d6g.win`  

4. 域名需要进行解析到**server** 
   ![](https://i.imgur.com/K4nKcnR.png)


##0x2 服务器布署

1. 生成证书和客户端  
	命令如下
	<pre><code>
	[root@mail ~]# docker run --rm -it -e DOMAIN="d6g.win" -v /root/ngrok:/myfiles hteen/ngrok    
	/go # cp /bin/sh /bin/bash    
	/go # /bin/sh /build.sh  
    /bin/sh /build.sh 
	</code></pre>
	执行完成后， 生成了我们要的客户端和服务端在**/root/ngrok/bin**目录下,包括  
	1. bin/ngrokd
	2. bin/ngrok
	3. bin/darwin_amd64/ngrok
	4. bin/windows_amd64/ngrok.exe

2. 启动ngrokd服务  
	
	- ngrokd 启动
	- <pre><code>
		[root@mail ngrok]# docker run -itd --name ngrokd  -v /root/ngrok:/myfiles  -p 8080:80 -p 4433:443 -p 4443:4443 -e DOMAIN='d6g.win' hteen/ngrok /bin/sh /server.sh
	a22156e593a17c2c76be781578418391cd9182a22ae5897e43a234b59c976d7d
	[root@mail ngrok]# docker ps -l
	CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS                                                                          NAMES
	a22156e593a1        hteen/ngrok         "/bin/sh /server.sh"   11 seconds ago      Up 10 seconds       0.0.0.0:4433->443/tcp, 0.0.0.0:4443->4443/tcp, 80/tcp, 0.0.0.0:8080->80/tcp   ngrokd
		</code></pre>
	- nginx配置
	-因为本机启动了nginx服务器， 所以80端口被占用，启动时候，本机是用的8080，有些需求比如一些接口必需要使用**80**端口。所以nginx再配置一个反向代理。
	- <pre><code>
	server {
	     listen       80;
	     server_name  d6g.win *.d6g.win;
	     location / {
	             proxy_redirect off;
	             proxy_set_header Host $host;
	             proxy_set_header X-Real-IP $remote_addr;
	             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	             proxy_pass http://10.24.198.241:8080;
	     }
	 }
	 server {
	     listen       443;
	     server_name  d6g.win *.d6g.win;
	     location / {
	             proxy_redirect off;
	             proxy_set_header Host $host;
	             proxy_set_header X-Real-IP $remote_addr;
	             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	             proxy_pass http://127.0.0.1:4433;
	     }
	 }
	</pre></code>
3. 服务器的防火墙开启必要的端口**4443，80，443**

##0x3 客户端的使用

- 下载对应平台的ngrok
- 配置文件
	<pre><code>server_addr: "d6g.win:4443"
trust_host_root_certs: false
tunnels: 
    api:
        subdomain: "api"
        proto:
            http: 80
    t:
        subdomain: "t"
        proto:
            http: 80
    wx:
        subdomain: "wx"
        proto:
            http: 80
    m:
        subdomain: "m"
        proto:
            http: 80
</pre></code>  
	可以通过运行命令 `ngrok.exe -config ngrok.cfg start api`  
	来把本机**80**端口指向到 **http://api.dtg.win**
- 运行命令
	`ngrok -config ngrok.cfg 127.0.0.1:80` 能够得到一个随机的二级域名
	![](https://i.imgur.com/e1zpeoF.png)  
	也可以通过参数 **－subdomain** 来指定域名
－ 访问 本机 `http://127.0.0.1:4040` 来查看具体日志记录  
	![](https://i.imgur.com/GnahXcb.png)

##0x3 结束语

ngrok可以并不限于暴露Web服务。实际上，vnc，3389也是没有问题的。