---
author: ww
date: 2017-11-25 01:15:57+00:00
title: Install Naxsi For Nginx
categories:
- Linux
tags:
- linux
---

## Install Naxsi

- download naxsi source code

```php
[root@mail src]# pwd
/usr/local/src
[root@mail src]# wget https://github.com/nbs-system/naxsi/archive/master.zip
[root@mail src]# mv master.zip maxsi-master.zip
[root@mail src]# unzip maxsi-master.zip
[root@mail src]# cd naxsi-master/naxsi_src/
[root@mail naxsi_src]# pwd
/usr/local/src/naxsi-master/naxsi_src
```

- get the Nginx building parameter

```php
[root@mail naxsi_src]# /usr/local/etc/nginx/sbin/nginx -V
nginx version: nginx/1.4.2
built by gcc 4.4.7 20120313 (Red Hat 4.4.7-17) (GCC)
TLS SNI support enabled
configure arguments: --prefix=/usr/local/etc/nginx --with-pcre=/usr/local/src/pcre-8.38 --with-zlib=/usr/local/src/zlib-1.2.8 --conf-path=/usr/local/etc/nginx/nginx.conf --pid-path=/usr/local/etc/nginx/conf/nginx.pid --with-http_ssl_module --with-openssl=/usr/local/src/openssl-1.0.1c --add-module=/usr/local/src/headers-more-nginx-module-0.23 --add-module=/usr/local/src/nginx-http-concat-master
```

- Now rebuild the nginx

```php
[root@mail naxsi_src]# cd /usr/local/src/nginx-1.4.2
[root@mail nginx-1.4.2]# ./configure --prefix=/usr/local/etc/nginx --with-pcre=/usr/local/src/pcre-8.38 --with-zlib=/usr/local/src/zlib-1.2.8 --conf-path=/usr/local/etc/nginx/nginx.conf --pid-path=/usr/local/etc/nginx/conf/nginx.pid --with-http_ssl_module --with-openssl=/usr/local/src/openssl-1.0.1c --add-module=/usr/local/src/headers-more-nginx-module-0.23 --add-module=/usr/local/src/nginx-http-concat-master --add-module=/usr/local/src/naxsi-master/naxsi_src
[root@mail nginx-1.4.2]# make && make install
```

- copy rules

[root@mail nginx-1.4.2]\# cp /usr/local/src/naxsi-master/naxsi\_config/naxsi\_core.rules /usr/local/etc/nginx/

[root@mail nginx-1.4.2]\# vim /usr/local/etc/nginx/mysite.rules

```php
#/usr/local/etc/nginx/mysite.rules
#LearningMode; #Enables learning mode
SecRulesEnabled;
#SecRulesDisabled;
DeniedUrl "/RequestDenied";
## check rules
CheckRule "$SQL >= 8" BLOCK;
CheckRule "$RFI >= 8" BLOCK;
CheckRule "$TRAVERSAL >= 4" BLOCK;
CheckRule "$EVADE >= 4" BLOCK;
CheckRule "$XSS >= 8" BLOCK;
```

- config nginx

```php
[root@mail nginx]# vim /usr/local/etc/nginx/nginx.conf

#in http section add a string
include /usr/local/etc/nginx/naxsi_core.rules;

[root@mail nginx]# vim conf/default.conf

```

```php
server {
    listen       80;
    server_name  www.safecode.cc;
    autoindex off;
    access_log  /var/log/nginx/log/naxsi_access.log;
    error_log /var/log/nginx/log/naxsi_error.log;
    location / {
        include "/usr/local/etc/nginx/mysite.rules";
        root   /usr/local/www;
        index  index.php index.html index.htm;
        if (!-e $request_filename) {
            rewrite  ^(.*)$  /index.php?s=$1  last;
            break;
        }
    location /RequestDenied {
      return 418;
    }
    
   }
```

- restart nginx