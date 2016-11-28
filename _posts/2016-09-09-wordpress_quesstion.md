---
layout: post
title: "wordpress 一些问题"
data: 2016-09-09 11:09:11 
categories: php
tags: php wordpress
---

## wordpress的一些常见问题

### 注册用户收取不到邮件

1. 使用插件(WP MAIL SMTP)  
	http://wordpress.org/extend/plugins/wp-mail-smtp/  
	插件测试成功, 但是邮件发送失败,可能是因为主题的原因,或者系统的原因

2. googleapi, 现在googleapi太慢了,每次加载都好久

	相关文件: wp-includes/script-loader.php

2. 加速
	
	插件
	----
	-	[W3 Total Cache](http://wordpress.org/extend/plugins/w3-total-cache/) 使用高效的缓存插件   
	-	[Free-CDN](http://wordpress.org/extend/plugins/free-cdn/) 使用内容分发网络  
	-	[WP-SmushIt](http://wordpress.org/extend/plugins/wp-smushit/) 图片优化很重要  
	-	[WP-Optimize](http://wordpress.org/extend/plugins/wp-optimize/installation/) 优化你的WP数据库 
	-	[jQuery Image Lazy Load](http://wordpress.org/extend/plugins/jquery-image-lazy-loading/) 为你的图片添加延时加载   


	为文件添加过期时间
	----
	><IfModule mod_expires.c>  
	>	ExpiresActive On  
	>	ExpiresDefault A600  
	>	ExpiresByType image/x-icon A2592000
	>	ExpiresByType application/x-javascript A604800
	>	ExpiresByType text/css A604800  
	>	ExpiresByType image/gif A2592000  
	>	ExpiresByType image/png A2592000  
	>	ExpiresByType image/jpeg A2592000  
	>	ExpiresByType text/plain A86400  
	>	ExpiresByType application/x-shockwave-flash A2592000  
	>	ExpiresByType video/x-flv A2592000  
	>	ExpiresByType application/pdf A2592000  
	>	ExpiresByType text/html A600   
	></IfModule>


