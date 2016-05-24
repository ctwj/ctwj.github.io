---
author: ww
comments: true
date: 2015-12-28 02:36:05+00:00
layout: post
link: http://www.gl6.cc/blog/php-cgi-%e4%b8%ad-fix_pathinfo-%e5%bc%95%e8%b5%b7%e7%9a%84%e5%ae%89%e5%85%a8%e9%9a%90%e6%82%a3.html
slug: php-cgi-%e4%b8%ad-fix_pathinfo-%e5%bc%95%e8%b5%b7%e7%9a%84%e5%ae%89%e5%85%a8%e9%9a%90%e6%82%a3
title: PHP CGI 中 fix_pathinfo 引起的安全隐患
wordpress_id: 404
categories:
- PHP
tags:
- php
---

这两天网上开始疯传一个[“nginx文件类型错误解析漏洞”](http://www.80sec.com/nginx-securit.html#more-163)，这个“漏洞”是这样的：

假设有如下的 URL：http://phpvim.net/foo.jpg，当访问 http://phpvim.net/foo.jpg/a.php 时，foo.jpg 将会被执行，如果 foo.jpg 是一个普通文件，那么 foo.jpg 的内容会被直接显示出来，但是如果把一段 php 代码保存为 foo.jpg，那么问题就来了，这段代码就会被直接执行。这对一个 Web 应用来说，所造成的后果无疑是毁灭性的。

关于这个问题，已有高手 laruence 做过[详细的分析](http://www.laruence.com/2010/05/20/1495.html)，这里再多啰嗦几句。

首先不管你是否有用到正则来解析 PATH_INFO，这个漏洞都是存在的。比如下面这个最基本的 nginx 配置：



<table >
<tbody >
<tr >

<td class="code" >

    
    location ~ \.php$ {
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_index index.php;
        include       fastcgi_params;
        fastcgi_param SCRIPT_FILENAME   $document_root$fastcgi_script_name;
    }



</td>
</tr>
</tbody>
</table>



漏洞同样会出现，如 laruence 所说，实际上这个漏洞和 nginx 真的没什么关系，nginx 只是个 Proxy，它只负责根据用户的配置文件，通过 fastcgi_param 指令将参数忠实地传递给 FastCGI Server，问题在于 FastCGI Server 如何处理 nginx 提供的参数？

比如访问下面这个 URL：



<table >
<tbody >
<tr >

<td class="code" >










**[text]** [view plain](http://blog.csdn.net/neubuffer/article/details/16901023#)[copy](http://blog.csdn.net/neubuffer/article/details/16901023#)












	
  1. <span style="font-size: 14px;">http://phpvim.net/foo.jpg/a.php/b.php/c.php</span>




</td>
</tr>
</tbody>
</table>



那么根据上面给出的配置，nginx 传递给 FastCGI 的 SCRIPT_FILENAME 的值为：



<table >
<tbody >
<tr >

<td class="code" >










**[text]** [view plain](http://blog.csdn.net/neubuffer/article/details/16901023#)[copy](http://blog.csdn.net/neubuffer/article/details/16901023#)












	
  1. <span style="font-size: 14px;">/home/verdana/public_html/unsafe/foo.jpg/a.php/b.php/c.php</span>




</td>
</tr>
</tbody>
</table>



也就是 $_SERVER['ORIG_SCRIPT_FILENAME']。

当 php.ini 中 cgi.fix_pathinfo = 1 时，PHP CGI 以 / 为分隔符号从后向前依次检查如下路径：



<table >
<tbody >
<tr >

<td class="code" >










**[text]** [view plain](http://blog.csdn.net/neubuffer/article/details/16901023#)[copy](http://blog.csdn.net/neubuffer/article/details/16901023#)












	
  1. /home/verdana/public_html/unsafe/foo.jpg/a.php/b.php/c.php

	
  2. /home/verdana/public_html/unsafe/foo.jpg/a.php/b.php

	
  3. /home/verdana/public_html/unsafe/foo.jpg/a.php

	
  4. /home/verdana/public_html/unsafe/foo.jpg</span>




</td>
</tr>
</tbody>
</table>



直到找个某个存在的文件，如果这个文件是个非法的文件，so… 悲剧了~

PHP 会把这个文件当成 cgi 脚本执行，并赋值路径给 CGI 环境变量——SCRIPT_FILENAME，也就是 $_SERVER['SCRIPT_FILENAME'] 的值了。

在很多使用 php-fpm （<0.6） 的主机中也会出现这个问题，但新的 php-fpm 的已经关闭了 cgi.fix_pathinfo，如果你查看 phpinfo() 页面会发现这个选项已经不存在了，代码 ini_get(“cgi.fix_pathinfo”) 的返回值也是 “false”。

原因是似乎因为 APC 的一个 bug，当 cgi.fix_pathinfo 开启时，PATH_TRANSLATED 有可能是 NULL，从而引起内存异常，造成 php-fpm crash，所以 php-fpm 关闭这个选项。



http://blog.csdn.net/neubuffer/article/details/16901023
