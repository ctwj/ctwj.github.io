---
layout: post
title: "apahce 多网站配置"
data: 2016-05-26 11:09:11 
categories: safe
tags: php apache
---

## Apahce 多网站配置

如果是简单复制的配置很可能出现一个这样的问题,  
1. 几个域名都访问到第一个配置了,  
	**解决办法:**  
	- 在serverName下面添加ServerAlias  
2. 配置多个域名出现`the first has precedence, perhaps you need a NameVirtualHost`
	**解决办法:**  
	添加 NameVirtualHost 这样就能配置多个子域名了


	NameVirtualHost *:80
	<VirtualHost *:80>
	    ServerAdmin abb@qq.com
	    DocumentRoot /var/www/html
	    ServerName test.gl6.cc
	    ServerAlias test.gl6.cc
	</VirtualHost>
	<VirtualHost *:80>
	    ServerAdmin abc@qq.com
	    DocumentRoot /var/www/yi
	    ServerName y.gl6.cc
	    ServerAlias  y.gl6.cc
	</VirtualHost>
	<VirtualHost *:80>
	    ServerAdmin abc@qq.com
	    DocumentRoot /var/www/yi
	    ServerName m.gl6.cc
	    ServerAlias  m.gl6.cc
	</VirtualHost>