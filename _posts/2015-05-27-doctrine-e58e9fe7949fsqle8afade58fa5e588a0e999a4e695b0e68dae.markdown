---
author: ww
comments: true
date: 2015-05-27 10:56:39+00:00
layout: post
link: http://www.gl6.cc/blog/doctrine-%e5%8e%9f%e7%94%9fsql%e8%af%ad%e5%8f%a5%e5%88%a0%e9%99%a4%e6%95%b0%e6%8d%ae.html
slug: doctrine-%e5%8e%9f%e7%94%9fsql%e8%af%ad%e5%8f%a5%e5%88%a0%e9%99%a4%e6%95%b0%e6%8d%ae
title: Doctrine 原生sql语句删除数据
wordpress_id: 97
categories:
- PHP
tags:
- doctrine
- php
---

$sql = 'delete from member_has_article where article=:article';
$params = array('article'=>$article->getId());
$stmt = $em->getConnection()->prepare($sql);
$stmt->execute($params);
