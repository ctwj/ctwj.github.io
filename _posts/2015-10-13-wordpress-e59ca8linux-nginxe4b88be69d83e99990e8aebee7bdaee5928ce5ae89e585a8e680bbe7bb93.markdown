---
author: ww
comments: true
date: 2015-10-13 04:18:07+00:00
layout: post
link: http://www.gl6.cc/blog/wordpress-%e5%9c%a8linux-nginx%e4%b8%8b%e6%9d%83%e9%99%90%e8%ae%be%e7%bd%ae%e5%92%8c%e5%ae%89%e5%85%a8%e6%80%bb%e7%bb%93.html
slug: wordpress-%e5%9c%a8linux-nginx%e4%b8%8b%e6%9d%83%e9%99%90%e8%ae%be%e7%bd%ae%e5%92%8c%e5%ae%89%e5%85%a8%e6%80%bb%e7%bb%93
title: wordpress 在linux nginx下权限设置和安全总结
wordpress_id: 175
categories:
- WordPress
tags:
- wordpress
---

1、wordpress 权限对安装和使用效果的影响很大：权限错误将影响theme的安装：不能安装theme或者修改theme或删除theme。

相关设置： 

chmod 755 wordpress

find wordpress -type d  -exec chmod 755 {} ;

find wordpress -iname "*.php"  -exec chmod 644 {} ;

chown -R nginx:nginx wordpress

方法见： http://my.oschina.net/kjpioo/blog/162697

2、 uploads目录 安全：

问题描述：linux 下 最新版  wordpress ，上传theme，theme安装成功后，在 wordpress/wp-content/uploads/ 目录下有 2013/09/theme_name.zip 文件存在。  虽然 2013/09/ 目录都是禁止list的，但是如何禁止 theme_name.zip 文件被客户端窥探到（防止被下载）

解决方案：

方案1：每次上传和安装好theme 后，手动删除 uploads的  .zip文件

方案2：在uploads目录下用 .htaccess的 Rewrite 规则，可以对http://SITE_URL/uploads/2013/09/theme_name.zip 的访问 进行屏蔽。

方法见： http://my.oschina.net/kjpioo/blog/162696
