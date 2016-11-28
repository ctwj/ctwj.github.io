---
layout: post
title: "phpmailer 问题"
data: 2016-09-09 11:09:11 
categories: php
tags: php 
---


## phpmailer 问题

1. 首先可以开通phpmailer的调试模式
		
		$mail->STMPDebug = 1
2. SMTPSecure  
	如果找不到问题, firefox能够发送成功, 用phpmailer不行
	有一下几点可能

	- php_openssl php_socket 扩展没有开启
	- fsocketopen 函数被禁用
	- 验证方式不对,尝试设置 SMTPAuth = 'tls'

	我这个遇到bug就是设置SMTPAuth='tls'解决的.
	提示错误为验证失败, 配置和firefox一模一样

