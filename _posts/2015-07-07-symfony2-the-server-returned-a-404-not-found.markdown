---
author: ww
comments: true
date: 2015-07-07 01:43:46+00:00
layout: post
link: http://www.gl6.cc/blog/symfony2-the-server-returned-a-404-not-found.html
slug: symfony2-the-server-returned-a-404-not-found
title: symfony2  The server returned a 404 Not Found
wordpress_id: 107
categories:
- PHP
tags:
- symfony2
---

刚安装完出现这个问题。

首先系统并没有定义这个路由，其次开发环境应该访问app_dev.php

解决如下

1） 修改web目录下的htaccess

<IfModule mod_rewrite.c>
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ app_dev.php [QSA,L]
</IfModule>

2） 给AppBundler DefaultController 添加路由

/**
* @Route("/", methods="GET",name="index")
*/
public function indexAction()
{
return $this->render('default/index.html.twig');
}

3） 直接访问首页，可以看到Homepage。

需要注意的是路由的name不能重复，否则前面的规则会被后面的覆盖。
