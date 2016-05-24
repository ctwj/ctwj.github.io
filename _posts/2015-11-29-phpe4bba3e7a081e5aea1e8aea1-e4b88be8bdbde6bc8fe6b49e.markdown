---
author: ww
comments: true
date: 2015-11-29 03:19:47+00:00
layout: post
link: http://www.gl6.cc/blog/php%e4%bb%a3%e7%a0%81%e5%ae%a1%e8%ae%a1-%e4%b8%8b%e8%bd%bd%e6%bc%8f%e6%b4%9e.html
slug: php%e4%bb%a3%e7%a0%81%e5%ae%a1%e8%ae%a1-%e4%b8%8b%e8%bd%bd%e6%bc%8f%e6%b4%9e
title: '[PHP]代码审计 下载漏洞'
wordpress_id: 319
categories:
- PHP
tags:
- 上传
- 代码审计
---

## RainEditor的下载漏洞


这个是从一个叫编辑器中取出的代码,可以通过google url:RainEditor.js 寻找此编辑器

路径:

    
    editor/uploads/download.php



    
    <?
    
    $file_name = ($_REQUEST[dn] == '')?basename($PHP_SELF):$_REQUEST[dn];
    
    $file_url = substr($PHP_SELF , strlen($_SERVER["SCRIPT_NAME"]));
    
    header("Content-Type: charset=EUC-KR"); 
    header("Content-Disposition: attachment;filename=".$file_name.";"); 
    
    @readfile(".$file_url");
    
    ?>


代码非常简单, 代码中用到了 $PHP_SELF , 必须要开启 register_globals = on 才会有这个变量,其实 就是$_SERVER['PHP_SELF'].


### 问题


会导致当前目录下的源码泄露


### 没有跨目录成功


在windows系统下,尝试跨目录时双点直接在url中生效了,斜线和反斜线都当做分界,无法访问到download.php.
在liunx系统中,通过反斜线,能传入一个路径,但是路径不像windows,必须斜线才能正常访问到路径.

[![0151129111604](http://www.gl6.cc/blog/wp-content/uploads/2015/11/0151129111604.png)](http://www.gl6.cc/blog/wp-content/uploads/2015/11/0151129111604.png)


