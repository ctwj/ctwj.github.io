---
author: ww
comments: true
date: 2015-10-18 23:33:58+00:00
layout: post
link: http://www.gl6.cc/blog/thinkphp-if-%e6%a0%87%e7%ad%be%e4%b8%ad%e7%9a%84%e6%95%b0%e7%bb%84%e8%ae%bf%e9%97%ae.html
slug: thinkphp-if-%e6%a0%87%e7%ad%be%e4%b8%ad%e7%9a%84%e6%95%b0%e7%bb%84%e8%ae%bf%e9%97%ae
title: Thinkphp If 标签中的数组访问
wordpress_id: 183
categories:
- PHP
tags:
- thinkphp
---

如下代码


      {$vvv['name']}
 

其中 $vvv $vo 都是数组

使用tp3.1.3版本，

在 if 的condition 中，比较的后一个数组需要用大括号，如果用点的方式会导致什么都不显示，前一个可以用点号

