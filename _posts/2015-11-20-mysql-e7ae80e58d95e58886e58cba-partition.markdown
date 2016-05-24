---
author: ww
comments: true
date: 2015-11-20 06:20:15+00:00
layout: post
link: http://www.gl6.cc/blog/mysql-%e7%ae%80%e5%8d%95%e5%88%86%e5%8c%ba-partition.html
slug: mysql-%e7%ae%80%e5%8d%95%e5%88%86%e5%8c%ba-partition
title: mysql 简单分区 partition
wordpress_id: 286
categories:
- database
- uncategorized
tags:
- mysql
---

## mysql partition


当一个表的数据量太大时可以考虑进行分区，来提高查询效率。

* **Range（范围）** – 这种模式允许DBA将数据划分不同范围。例如DBA可以将一个表通过年份划分成三个分区，80年代（1980's）的数据，90年代（1990's）的数据以及任何在2000年（包括2000年）后的数据。

* **Hash（哈希）** – 这中模式允许DBA通过对表的一个或多个列的Hash Key进行计算，最后通过这个Hash码不同数值对应的数据区域进行分区，。例如DBA可以建立一个对表主键进行分区的表。

* **Key（键值）** – 上面Hash模式的一种延伸，这里的Hash Key是MySQL系统产生的。

* **List（预定义列表）** – 这种模式允许系统通过DBA定义的列表的值所对应的行数据进行分割。例如：DBA建立了一个横跨三个分区的表，分别根据2004年2005年和2006年值所对应的数据。

*** Composite（复合模式）** - 很神秘吧，哈哈，其实是以上模式的组合使用而已，就不解释了。举例：在初始化已经进行了Range范围分区的表上，我们可以对其中一个分区再进行hash哈希分区。



    
    CREATE TABLE `test`.`ctwj_kr` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `username` VARCHAR(45) NULL COMMENT '用户名',
      `kr_name` VARCHAR(45) NULL COMMENT '韩文名',
      `password` VARCHAR(45) NULL COMMENT '密码',
      `email` VARCHAR(128) NULL COMMENT '邮箱',
      `zip` VARCHAR(6) NULL COMMENT 'zipcode',
      `address` VARCHAR(256) NULL COMMENT '地址',
      `phone` VARCHAR(45) NULL COMMENT '手机',
      `birthday` VARCHAR(10) NULL COMMENT '生日',
      `ssn` VARCHAR(256) NULL COMMENT '身份证号码',
      `source` VARCHAR(45) NOT NULL DEFAULT '100' COMMENT '来源',
      PRIMARY KEY (`id`),
      INDEX `krname_index` (`kr_name` ASC),
      INDEX `name_index` (`username` ASC))
    ENGINE = MyISAM
    DEFAULT CHARACTER SET = utf8
    COMMENT = '用户信息表' PARTITION BY HASH(id) PARTITIONS 20 ;
    


再怎么分区，其实数据还是在同一个库里面，只是表被拆分，变成很多个。

快速从一个存在表中插入数据

    
    INSERT INTO ctwj_kr (`username`,`kr_name`,`password`,`email`,`zip`,`address`,`phone`,`birthday`) SELECT `id` as username,`name` as kr_name,`pass1` as password,`email` as email,zip,`addre` as address,`hphone` as phone,concat(birthy,birthm,birthd) AS birthday FROM koso_member


可以从文件大小发现，数据很平均地被写入到每个分区内了

[![partition](http://www.gl6.cc/blog/wp-content/uploads/2015/11/partition-300x192.jpg)](http://www.gl6.cc/blog/wp-content/uploads/2015/11/partition.jpg)

对于建立社工库的人来说 range 是一个非常好的解决方案，可以新建一个source表保存每个数据的来源，每次添加数据时可以新加一个分区，通过range(source)保证不同数据保存在不同分区，对查询来说又是透明的。维护也方便。

对于一个每天都有大量数据产生的网站来说，按时间range是一个好办法。

但是只是好像除了hash，没有根据字符串更自由的分区方法。


## 一些常见错误


A PRIMARY KEY must include all columns in the table's partitioning function
分区要求分区字段为主键

ERROR 1659: Field 'username' is of a not allowed type for this type of partitioning
username的类型不允许用来分区
