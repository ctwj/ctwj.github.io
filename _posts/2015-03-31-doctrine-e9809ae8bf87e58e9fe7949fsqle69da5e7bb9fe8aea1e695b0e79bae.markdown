---
author: ww
comments: true
date: 2015-03-31 11:34:37+00:00
layout: post
link: http://www.gl6.cc/blog/doctrine-%e9%80%9a%e8%bf%87%e5%8e%9f%e7%94%9fsql%e6%9d%a5%e7%bb%9f%e8%ae%a1%e6%95%b0%e7%9b%ae.html
slug: doctrine-%e9%80%9a%e8%bf%87%e5%8e%9f%e7%94%9fsql%e6%9d%a5%e7%bb%9f%e8%ae%a1%e6%95%b0%e7%9b%ae
title: Doctrine 通过原生SQL来统计数目
wordpress_id: 49
categories:
- PHP
tags:
- doctrine
---

一.
使用DBAL查询，
$this->getEntityManager()->getConnect();
获取一个DBAL连接，再查询

二.
通过NativeQuery查询
因为ORM是不允许数据库操作返回的不是Object的，所以ResultSetMapping就是数据库数据和Object的结构映射。

//函数在repository中
/**
* 检测文章是否已经被收藏过
* @param \Ctwj\Entity\Member $member
* @param \Ctwj\Entity\Article $article
*/
public function isArticleCollected(\Ctwj\Entity\Member $member,\Ctwj\Entity\Article $article) {
$rsm = new ResultSetMapping();
$rsm->addScalarResult('count', 'count');
$sql = 'select count(1) as count from member m,article a, member_collect_article ma where ' .
    'm.id = ma.member_id and a.id=ma.article_id and m.id='.$member->getId().
    ' and a.id = '. $article->getId();
$query = $this->getEntityManager()->createNativeQuery($sql,$rsm);
$result = $query->getResult();
return $result[0]['count'];
}
