---
author: ww
comments: true
date: 2015-10-12 07:55:46+00:00
layout: post
link: http://www.gl6.cc/blog/directorypress-v7-1-4-%e4%b8%bb%e9%a2%98%e7%a0%b4%e8%a7%a3.html
slug: directorypress-v7-1-4-%e4%b8%bb%e9%a2%98%e7%a0%b4%e8%a7%a3
title: DirectoryPress.v7.1.4 主题破解
wordpress_id: 169
categories:
- WordPress
tags:
- wordpress
- 主题破解
---

在 ppt_admin.php 文件

1581行左右， 找到

$whatNow = explode("**",$msg);

下面添加一行 $whatNow = array(1, 'blog.gl6.cc');

保存，直接填写即可注册成功
