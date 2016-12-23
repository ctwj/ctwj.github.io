---
layout: post
title: "centos supervisor"
data: 2016-10-11 11:09:11 
categories: python
tags: python linux
---

## supervisor 使用

0. about supervisor
----
supervisor就是用Python开发的一套通用的进程管理程序，能将一个普通的命令行进程变为后台daemon，并监控进程状态，异常退出时能自动重启。

1. install
----
`pip install supervisor`

2. save config
----
`echo_supervisord_conf > /etc/supervisord.conf`

3. start supervisor
----
`supervisord -c /etc/supervisord.conf`

4. control supervisor
----
查看任务状态:`supervisorctl status`  
启动所有任务:`supervisorctl start all`  
停止所有任务:`supervisorctl stop all` 

5. add task
----

	[program:slowhttptest]
	command=slowhttptest -c 1000 -X -r 1000 -w 10 -y 20 -n 5 -z 32 -u https://www.test.com/bigfile.php -p 5 -l 350  
	autorstart=true
	redirect_stderr=true
	stdout_logfile=/var/log/supervisord_server.log
	directory=/tmp
	user=root
	priority=1

任务名:slowhttptest    
命令:`slowhttptest -c 1000 -X -r 1000 -w 10 -y 20 -n 5 -z 32 -u https://www.test.com/bigfile.php -p 5 -l 350`  
自动开始:true  
重定向错误输出:`/var/log/supervisord_server.log` 

6. 注意事项
----
 
>1. 启动前要注意停止所有supervisord的进程,否则启动失败  
2. `inet_http_server` 节点需要开放, 如果有nginx很有可能使用了9001端口,需要切换一个别的端口
3. `supervisorctl` 节点下的url需要将端口改为和`inet_http_server`节点的一致