---
author: ww
comments: true
date: 2016-02-22 05:51:22+00:00
layout: post
link: http://www.gl6.cc/blog/mysql-%e4%bd%bf%e7%94%a8load-data-infile%e5%91%bd%e4%bb%a4%e6%89%b9%e9%87%8f%e5%af%bc%e5%85%a5%e6%96%87%e6%9c%ac%e6%95%b0%e6%8d%ae.html
slug: mysql-%e4%bd%bf%e7%94%a8load-data-infile%e5%91%bd%e4%bb%a4%e6%89%b9%e9%87%8f%e5%af%bc%e5%85%a5%e6%96%87%e6%9c%ac%e6%95%b0%e6%8d%ae
title: '[mysql] 使用load data infile命令批量导入文本数据'
wordpress_id: 482
categories:
- database
- uncategorized
tags:
- mysql
---

load data infile "E:\\BaiduYunDownload\\1600W\\1600W.txt" ignore into table `md` fields terminated by ',' ;



terminated by ','　　表示两个字段之间用逗号分割

如果字段有双引号包围可以使用

enclosed by '"'  来去掉插入时两边的引号

如果导入的表不设置主键，将比设置主键快很多，1600W数据设置主键需要４分钟，不设置只要１０多秒
