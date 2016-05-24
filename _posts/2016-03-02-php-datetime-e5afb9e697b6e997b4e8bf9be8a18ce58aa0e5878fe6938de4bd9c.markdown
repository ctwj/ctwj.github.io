---
author: ww
comments: true
date: 2016-03-02 08:56:55+00:00
layout: post
link: http://www.gl6.cc/blog/php-datetime-%e5%af%b9%e6%97%b6%e9%97%b4%e8%bf%9b%e8%a1%8c%e5%8a%a0%e5%87%8f%e6%93%8d%e4%bd%9c.html
slug: php-datetime-%e5%af%b9%e6%97%b6%e9%97%b4%e8%bf%9b%e8%a1%8c%e5%8a%a0%e5%87%8f%e6%93%8d%e4%bd%9c
title: '[php] DateTime 对时间进行加减操作'
wordpress_id: 505
categories:
- PHP
---

通过modify函数加减

    
    $d = new Datetime("2015-03-02 18:00:00");
    echo $d->modify("-1 day")->format("Y-m-d H:i:s");


通过DateIntenal加减

    
    $date = new DateTime('2015-02-14');
    $diff = new DateInterval('P1D');
    $date->sub($diff);
    
    echo $date->format('Y-m-d'); // 2015-02-13
