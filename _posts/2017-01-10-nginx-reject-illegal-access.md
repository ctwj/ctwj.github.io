---
author: ww
date: 2017-01-10 01:15:57+00:00
title: Nginx 拉黑非法访问解决方案
categories:
- PHP
- linux
tags:
- linux
- nginx
---

##Nginx 拉黑非法访问解决方案

1. Nginx 配置记录非法访问

		location ~* .*\.(asp|cer|aspx|jsp|do|jspx) {
			error_log /tmp/error.log error;
			deny all;
		}

2. Bash脚本实现iptable拉黑

	
		#!/bin/bash
		#by zengfl 20170109
		#update 20170110   add refused by 403error to iptables
		
		
		date1=`date +%Y%m%d`
		date=`date +%H%M`
		nginx_logs_dir=/tmp
		error_file=error.log
		#iptables.sh 这个是原始iptables配置, 放到script_dir中
		#nginx_iptabls.sh 这个是生成的拉黑记录
		script_dir=/home/work/script/
		
		#> $script_dir/log/ip.tmp
		#> $script_dir/log/ip.log
		cat $script_dir/iptables.sh > $script_dir/nginx_iptabls.sh
		echo "" >> $script_dir/nginx_iptabls.sh
		echo "# This is drop IP !!" >> $script_dir/nginx_iptabls.sh
			
		#生成403访问拒绝iptables
		if [ -s $nginx_logs_dir/$error_file ];then
		    cat $nginx_logs_dir/$error_file |awk '{print $11}' |awk -F "," '{print $1}' |sort -n |uniq |while read c
		    do
		        cat $script_dir/nginx_iptabls.sh|grep "\-I"|grep -v "\#"|grep $c
		        if [ $? -ne 0 ];then
		            echo "/sbin/iptables -I INPUT -s $c -p tcp -j DROP" >> $script_dir/nginx_iptabls.sh
		        fi
		    done
		fi
		
		sh $script_dir/nginx_iptabls.sh
		
		#每日凌晨记录当天拒绝IP日志
		if [ !-d $script_dir/log ];then
			mkdir $script_dir/log
		fi
		if [ $date -eq 2355 ];then
			echo "--------------$date1----------------" >> $script_dir/log/drop_ip.log
			cat $script_dir/nginx_iptabls.sh |grep DROP |grep -v "\-P" |awk '{print $5}' >> $script_dir/log/drop_ip.log
		fi
