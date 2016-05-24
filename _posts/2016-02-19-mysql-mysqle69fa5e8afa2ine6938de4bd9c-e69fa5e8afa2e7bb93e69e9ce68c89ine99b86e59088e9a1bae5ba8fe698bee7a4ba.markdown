---
author: ww
comments: true
date: 2016-02-19 03:08:50+00:00
layout: post
link: http://www.gl6.cc/blog/mysql-mysql%e6%9f%a5%e8%af%a2in%e6%93%8d%e4%bd%9c-%e6%9f%a5%e8%af%a2%e7%bb%93%e6%9e%9c%e6%8c%89in%e9%9b%86%e5%90%88%e9%a1%ba%e5%ba%8f%e6%98%be%e7%a4%ba.html
slug: mysql-mysql%e6%9f%a5%e8%af%a2in%e6%93%8d%e4%bd%9c-%e6%9f%a5%e8%af%a2%e7%bb%93%e6%9e%9c%e6%8c%89in%e9%9b%86%e5%90%88%e9%a1%ba%e5%ba%8f%e6%98%be%e7%a4%ba
title: '[mysql] MySQL查询in操作 查询结果按in集合顺序显示'
wordpress_id: 475
categories:
- database
- uncategorized
tags:
- mysql
---



    
    select * from table where id IN (3,6,9,1,2,5,8,7) order by field(id,3,6,9,1,2,5,8,7); 



