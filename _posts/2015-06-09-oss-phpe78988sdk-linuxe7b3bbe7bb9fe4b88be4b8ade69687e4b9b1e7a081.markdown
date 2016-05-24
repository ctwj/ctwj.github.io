---
author: ww
comments: true
date: 2015-06-09 01:15:57+00:00
layout: post
link: http://www.gl6.cc/blog/oss-php%e7%89%88sdk-linux%e7%b3%bb%e7%bb%9f%e4%b8%8b%e4%b8%ad%e6%96%87%e4%b9%b1%e7%a0%81.html
slug: oss-php%e7%89%88sdk-linux%e7%b3%bb%e7%bb%9f%e4%b8%8b%e4%b8%ad%e6%96%87%e4%b9%b1%e7%a0%81
title: OSS PHP版SDK Linux系统下中文乱码
wordpress_id: 103
categories:
- PHP
tags:
- oss
---

只要是检测到中文字符,编码就被替换成gbk了,不知道咋想的

解决方法如下

sdk.class.php文件 1291行

[![QQ截图20150609091324](http://blog.gl6.cc/wp-content/uploads/2015/06/QQ截图20150609091324-300x68.jpg)](http://blog.gl6.cc/wp-content/uploads/2015/06/QQ截图20150609091324.jpg)

替换成自己需要的编码

$encode = mb_detect_encodin($file,array("ASCII","UTF-8","GB23     12","BIG5"));

if($encode != "UTF-8"){

$file=iconv($file,"UTF-8",$file);

}


