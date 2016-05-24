---
author: ww
comments: true
date: 2016-01-18 09:35:06+00:00
layout: post
link: http://www.gl6.cc/blog/shell-shell%e4%b8%ad%e8%8e%b7%e5%8f%96url%e7%9a%84%e5%9f%9f%e5%90%8d.html
slug: shell-shell%e4%b8%ad%e8%8e%b7%e5%8f%96url%e7%9a%84%e5%9f%9f%e5%90%8d
title: '[shell] shell中获取url的域名'
wordpress_id: 441
categories:
- Linux
tags:
- shell
---



    
    url="http://www.gl6.cc/blog"
    domain=`echo ${url} | awk -F '[/:]' '{print $4}'`



