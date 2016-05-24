---
author: ww
comments: true
date: 2015-12-30 07:40:09+00:00
layout: post
link: http://www.gl6.cc/blog/cheditor-widget%e4%b8%ad%e6%b7%bb%e5%8a%a0%e5%9b%be%e7%89%87%e5%92%8c%e7%bc%96%e8%be%91%e5%9b%be%e7%89%87%e5%b1%9e%e6%80%a7.html
slug: cheditor-widget%e4%b8%ad%e6%b7%bb%e5%8a%a0%e5%9b%be%e7%89%87%e5%92%8c%e7%bc%96%e8%be%91%e5%9b%be%e7%89%87%e5%b1%9e%e6%80%a7
title: ckeditor widget中添加图片和编辑图片属性
wordpress_id: 415
categories:
- uncategorized
tags:
- ckeditor
---

因为ckeditor使用acf(高级内容过滤机制)，需要配置allowedContent，允许使用img标签，这样，图片按钮才会亮，才能插入图片，同时如果不允许属性的话，图片的编辑属性功能也是没有效的。

图片的编辑属性是写在style中的

    
    editables:{
                    content: {
                        selector: '.ctwj_step',
                        allowedContent: 'img[alt,height,!src,title,width]{*}'
                    }
                },
