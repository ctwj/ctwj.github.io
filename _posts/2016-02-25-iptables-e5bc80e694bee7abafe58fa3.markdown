---
author: ww
comments: true
date: 2016-02-25 02:45:29+00:00
layout: post
link: http://www.gl6.cc/blog/iptables-%e5%bc%80%e6%94%be%e7%ab%af%e5%8f%a3.html
slug: iptables-%e5%bc%80%e6%94%be%e7%ab%af%e5%8f%a3
title: iptables 开放端口
wordpress_id: 493
categories:
- Linux
tags:
- iptables
---


    
    iptables -I INPUT -p tcp --dport 3690 -j ACCEPT
    
    service iptables save
    
    
