---
layout: post
title: "php迅雷迅雷下载"
data: 2016-05-26 11:09:11 
categories: safe
tags: php thunder
---

## php将url转为迅雷地址

>规则很简单 url 前面加 `AA` 后面加 `BB` 进行**base_64encode**

	function ThunderEncode($url) {
		return "thunder://".base64_encode("AA".$url."ZZ");
	}
	$url ='http://www.gl6.cc';
	echo Thunder($url);



