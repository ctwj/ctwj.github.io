---
author: ww
comments: true
date: 2015-03-24 08:13:01+00:00
layout: post
link: http://www.gl6.cc/blog/%e9%85%8d%e7%bd%aenginx-conf%e4%bd%bf%e5%be%97thinkphp%e6%ad%a3%e5%b8%b8%e8%ae%bf%e9%97%ae%e4%bb%a5%e5%8f%8a413-request-entity-too-large%e9%94%99%e8%af%af.html
slug: '%e9%85%8d%e7%bd%aenginx-conf%e4%bd%bf%e5%be%97thinkphp%e6%ad%a3%e5%b8%b8%e8%ae%bf%e9%97%ae%e4%bb%a5%e5%8f%8a413-request-entity-too-large%e9%94%99%e8%af%af'
title: 配置nginx.conf使得Thinkphp正常访问,以及413 Request Entity Too Large错误
wordpress_id: 15
categories:
- Linux
- uncategorized
---

### 修改nginx.conf ###

    
    
    server {
    ...
    location / {
    index index.htm index.html index.php;
    #访问路径的文件不存在则重写URL转交给ThinkPHP处理
    if (!-e $request_filename) {
    rewrite ^/(.*)$ /index.php/$1 last;
    break;
    }
    }
    location ~ \.php/?.*$ {
    root /var/www/html/website;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    #加载Nginx默认"服务器环境变量"配置
    include fastcgi.conf;
    
    #设置PATH_INFO并改写SCRIPT_FILENAME,SCRIPT_NAME服务器环境变量
    set $fastcgi_script_name2 $fastcgi_script_name;
    if ($fastcgi_script_name ~ "^(.+\.php)(/.+)$") {
    set $fastcgi_script_name2 $1;
    set $path_info $2;
    }
    fastcgi_param PATH_INFO $path_info;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name2;
    fastcgi_param SCRIPT_NAME $fastcgi_script_name2;
    }
    }
    





其实应该使用更简单的方法，fastcgi模块自带了一个fastcgi_split_path_info指令专门用来解决此类问题的，该指令会根据给定的正则表达式来分隔URL，从而提取出脚本名和path info信息，使用这个指令可以避免使用if语句，配置更简单。
另外判断文件是否存在也有更简单的方法，使用try_files指令即可。


    
    
    server {
    ...
    location / {
    index index.htm index.html index.php;
    #如果文件不存在则尝试TP解析
    try_files $uri /index.php$uri;
    }
    location ~ .+\.php($|/) {
    root /var/www/html/website;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    
    #设置PATH_INFO，注意fastcgi_split_path_info已经自动改写了fastcgi_script_name变量，
    #后面不需要再改写SCRIPT_FILENAME,SCRIPT_NAME环境变量，所以必须在加载fastcgi.conf之前设置
    fastcgi_split_path_info ^(.+\.php)(/.*)$;
    fastcgi_param PATH_INFO $fastcgi_path_info;
    
    #加载Nginx默认"服务器环境变量"配置
    include fastcgi.conf;
    }
    }
    




摘自http://blog.csdn.net/tinico/article/details/18033573

### Nginx出现“413 Request Entity Too Large” ###


只需要在nginx主配置文件nginx.conf，找到http{}段，添加
client_max_body_size 20m;

### 重启nginx  /usr/etc/nginx/nginx -s reload ###

/usr/etc/nginx/为我的nginx安装目录
