---
layout: post
title: "ThinkPHP 伪静态"
data: 2016-07-16 11:09:11 
categories: php
tags: php thinkphp
---

## ThinkPHP伪静态测试 ##

在ThinkPHP 中  `Conf\convention.php` 有URL伪静态配置

	'URL_HTML_SUFFIX'       =>  'html|json|exc|csv',  // URL伪静态后缀设置

只要加上相关需要的后缀比如 json
就可以访问 .json 和 .html 一样访问到同一个控制器里面了