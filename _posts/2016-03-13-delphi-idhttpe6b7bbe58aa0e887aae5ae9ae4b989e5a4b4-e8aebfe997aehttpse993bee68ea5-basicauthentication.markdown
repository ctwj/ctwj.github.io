---
author: ww
comments: true
date: 2016-03-13 03:48:24+00:00
layout: post
link: http://www.gl6.cc/blog/delphi-idhttp%e6%b7%bb%e5%8a%a0%e8%87%aa%e5%ae%9a%e4%b9%89%e5%a4%b4-%e8%ae%bf%e9%97%aehttps%e9%93%be%e6%8e%a5-basicauthentication.html
slug: delphi-idhttp%e6%b7%bb%e5%8a%a0%e8%87%aa%e5%ae%9a%e4%b9%89%e5%a4%b4-%e8%ae%bf%e9%97%aehttps%e9%93%be%e6%8e%a5-basicauthentication
title: '[delphi]  idhttp添加自定义头 访问Https链接 BasicAuthentication'
wordpress_id: 531
categories:
- Delphi
- uncategorized
tags:
- BasicAuthentication
- delphi
---

1.访问 HTTPS
  首先，需要添加一个 TIdSSLIOHandlerSocketOpenSSL 
  再将 IdHttp 的 IOHandler 设置为新加的TIdSSLIOHandlerSocketOpenSSL 
  还需要在程序目录添加两个dll文件 libeay32.dll ssleay32.dll

2.添加 BasicAuthentication
  idhtp.Request.BasicAuthentication := true;
  idhtp.Request.Username := 'root';
  idhtp.Request.Password := 'root';

3.添加自定义头信息
  idhtp.Request.CustomHeaders.Values['extraInfo'] := 'http://www.gl6.cc/';

4.不编码参数
  idhtp.HTTPOptions:=[hoKeepOrigProtocol];//+[hoForceEncodeParams];
