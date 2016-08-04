---
layout: post
title: "session阻塞等简单php性能优化"
data: 2016-05-26 11:09:11 
categories: safe
tags: php mysql 优化 session阻塞
---

## XDEBUG

配置
----
		[XDebug]
		zend_extension = "D:\xampp\php\ext\php_xdebug.dll"
		xdebug.profiler_append = 0
		xdebug.profiler_enable = 1
		xdebug.profiler_enable_trigger = 0
		xdebug.profiler_output_dir = "D:\xampp\tmp"
		xdebug.profiler_output_name = "cachegrind.out.%t-%s"
		xdebug.remote_enable = 0
		xdebug.remote_handler = "dbgp"
		xdebug.remote_host = "127.0.0.1"
		xdebug.trace_output_dir = "D:\xampp\tmp"

工具
----
WinCacheGrind   
直接能找到运行最耗时位置.

### session 阻塞

由于页面执行时间过长, 导致,第二个页面,阻塞在读取session中.

**解决session阻塞问题的办法：**  
在session操作完成后调用`session_write_close()`即可避免此问题;

### mysql慢查询调试

1. explain 能够查询索引等一些情况
	![](http://i.imgur.com/rH89sZw.png)
2. profile
	1. set profiling = 1;
	2. 查询
		![](http://i.imgur.com/dMYY0fE.png)
	3. show profiles;
		![](http://i.imgur.com/JC6XHIX.png)
	4. show profile for query 12;
		![](http://i.imgur.com/FYmNhJu.png)
