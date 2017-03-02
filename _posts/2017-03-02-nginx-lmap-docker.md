---
layout: post
title: "使用docker提供lamp服务，利用nginx反向代理转发"
data: 2017-03-02 11:09:11 
categories: linux
tags: linux
---

# 使用docker提供lamp服务，利用nginx反向代理转发

### 0x001  前言
为啥有这个需求，TAT纯属瞎折腾。……╮(╯▽╰)╭

### 0x002 环境
- 本机网卡 ip : `45.76.103.10`
- Docker 网卡Ip ： `172.17.42.1 `
- 本机 端口 **80** 已经被nginx占用
- 域名 www.safecode.cc ： 指向 `45.76.103.10`

需要的效果， 架设一个容器， 提供lamp服务， 使用80端口，使用`www.safecode.cc` 访问时，能够没有任何感觉，直接在访问本机一样

### 0x003 原始方案

绑定docker容器80端口到8080， 通过nginx代理域名到. 
 `http://45.76.103.10:8080`

**docker（apache 提供web服务）**  
> `Docker run -itd -p 8080:80 -v /website:/www  janes/alpine-lamp`

**nginx（本机）**   
> location  / 
>           proxy_pass http://45.76.103.10 :8080;
> }

问题：
除了首页是 `http://www.safecode.com`,其他链接都是 `http://45.76.103.10:8080` 开始的

### 0x004 改善方案

1. 创建容器时，将端口绑定到 docker 的ip上,并在80端口上

	> `Docker run -itd -p 172.17.42.1:80:80 -v /website:/www  janes/alpine-lamp`
2. 使用host将 www.safecode.cc 转发到 172.17.42.1
3. 本机nginx反向代理配置
		server {
		listen       45.76.103.10:80;
		server_name  www.safecode.cc;
		location / {
		proxy_pass http://www.safecode.cc;
		   }
		}

实现的效果：
访问容器网站就像访问本机一样了， 链接全部变成了`www.safecode.cc`开始的了
缺点：
只能配置一个，因为ip上面80端口已经被绑定一次了， 不知道是否有ip复用的方法

### 0x005 总结
总结一下改善方法的实现过程， 访问域名， 最终访问到nginx上面，因为域名指向的是这个ip，nginx配置了serverName， 到这以后 nginx 进行转发， 再转发到同一个域名， 但是host已经将该域名指向到了docker的ip， 最终lamp容器绑定到docker的ip上的80端口， 最后访问到了容器上的lamp服务上了


