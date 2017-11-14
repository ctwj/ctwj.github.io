---
author: ww
date: 2017-11-09 01:15:57+00:00
title: 在Nginx日志中记录自定义Header
categories:
- Linux
tags:
- linux
- nginx
---


#how to record custom header field to log in nginx

1. Config the nginx.conf, add a new line in server scope.
	`underscores_in_headers on;`

2. Get the custom header value, for example, i have a request.
	<pre>curl -head -H "X_CUSTOM_HEADER: iamkerwin" http://www.safecoee.cc
</pre>
	we can get the header with **`$http_x_custom_header`**

3. Now we can use this **`$http_x_custom_header`** in nginx.conf.  
	for example:
	<pre>log_format  main  '$remote_addr - $remote_user $http_x_custom_header'
</pre>
	![](https://i.imgur.com/BtnfAIZ.png)

5. In the site config , we add log_form **main** into access log.
	![](https://i.imgur.com/0WCEoeZ.png)

6. Now we can test it ! 
	![](https://i.imgur.com/UiJl7Fl.png)

7. have something need attention to. about the nginx version.if the version greater than or equal to  1.9.7, we need add prefix **`sent_http_`**, else we just need add **`http_`**