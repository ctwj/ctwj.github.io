---
author: ww
comments: true
date: 2016-02-20 17:19:15+00:00
layout: post
link: http://www.gl6.cc/blog/%ef%bc%bbmysql%ef%bc%bd-%e4%bd%bf%e7%94%a8%e5%ad%98%e5%82%a8%e8%bf%87%e7%a8%8b%e6%89%b9%e9%87%8f%e6%8f%92%e5%85%a5md5%e6%95%b0%e6%8d%ae.html
slug: '%ef%bc%bbmysql%ef%bc%bd-%e4%bd%bf%e7%94%a8%e5%ad%98%e5%82%a8%e8%bf%87%e7%a8%8b%e6%89%b9%e9%87%8f%e6%8f%92%e5%85%a5md5%e6%95%b0%e6%8d%ae'
title: ［mysql］ 使用存储过程批量插入md5数据
wordpress_id: 479
categories:
- database
tags:
- 存储过程
---

1. 先入库再说
如果是字典直接导入即可，sql语句直接运行．



2. 将密码选取出来插入到一个表中
表需要两个字段id主键自增长，另外一个字段放数
insert ignore into test (n) (select n from test1)



3. 使用存储过程将每个密码生成md5并插入对应的表中

 

    
    begin
    
    DECLARE Done,c,_err Int DEFAULT 0;
    /*用来接收查询结果*/
    DECLARE username ,passhash VARCHAR(16);
    /*用来放临时表名*/
    DECLARE tablename VARCHAR(5);
    /* 声明游标 */
    DECLARE rs CURSOR FOR SELECT n FROM test where LENGTH(`n`) = CHARACTER_LENGTH(`n`);
    /* 异常处理 */
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET Done = 1;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION, SQLWARNING, not found set _err=1; 
    /* 打开游标 */
    OPEN rs;
    
    REPEAT
    
    /* 逐个取出当前记录 */
    FETCH NEXT FROM rs INTO username;
    
    set passhash=SUBSTR(md5(username), 9, 16);
    set tablename= CONCAT('md_', SUBSTR(passhash,1,2));
    
    set @STMT := CONCAT('insert ignore into ',tablename, ' (`n`,`m`) values( "', username,'","',passhash,'");');
    PREPARE STMT FROM @STMT; 
    EXECUTE STMT;
    
    UNTIL Done END REPEAT;
    
    
    CLOSE rs;
    
    end



