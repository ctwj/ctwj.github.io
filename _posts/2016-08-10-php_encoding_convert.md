---
layout: post
title: "php 编码问题"
data: 2016-08-10 11:09:11 
categories: php
tags: php encoding
---

## php 编码转换问题

php已经提供了检测编码和转码的函数,可惜用的不好还是乱码

有问题代码:

	$encode = mb_detect_encoding($content, array('UTF-8','GB2312','BIG-5','GBK'));
	if ( $encode != 'UTF-8' ) {
		$content = mb_convert_encoding($content, 'UTF-8', $encode);
	}

解决当前问题的代码:

	$encode = detect_encoding($content);
	if ( $encode != 'UTF-8' ) {
		$content = mb_convert_encoding($content, 'UTF-8', $encode);
	}

	function detect_encoding($str) {
		$list = array('GBK', 'UTF-8', 'gb2312' ,'UTF-16LE', 'UTF-16BE', 'ISO-8859-1');
		foreach ($list as $item) {
			$tmp = mb_convert_encoding($str, $item, $item);
			if (md5($tmp) == md5($str)) {
				return $item;
			}
		}
		return null;
	}