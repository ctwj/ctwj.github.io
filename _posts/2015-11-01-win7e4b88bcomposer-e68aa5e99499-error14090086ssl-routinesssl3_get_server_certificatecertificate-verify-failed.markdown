---
author: ww
comments: true
date: 2015-11-01 03:29:58+00:00
layout: post
link: http://www.gl6.cc/blog/win7%e4%b8%8bcomposer-%e6%8a%a5%e9%94%99-error14090086ssl-routinesssl3_get_server_certificatecertificate-verify-failed.html
slug: win7%e4%b8%8bcomposer-%e6%8a%a5%e9%94%99-error14090086ssl-routinesssl3_get_server_certificatecertificate-verify-failed
title: Win7下composer 报错 error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate
  verify failed
wordpress_id: 197
categories:
- PHP
tags:
- composer
- openssl
---

环境如标题描述

解决：

1 下载 http://curl.haxx.se/ca/cacert.pem
放置到php目录下

2. 配置php.ini

寻找 [OpenSLL] 如果找不到，自己创建

[OpenSSL] 
openssl.cafile= D:xamppphpverifycacert.pem

如果提示load失败，则是路径配置错误，检查路径是否正确

