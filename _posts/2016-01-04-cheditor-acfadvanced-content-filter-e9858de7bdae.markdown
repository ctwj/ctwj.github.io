---
author: ww
comments: true
date: 2016-01-04 06:55:51+00:00
layout: post
link: http://www.gl6.cc/blog/cheditor-acfadvanced-content-filter-%e9%85%8d%e7%bd%ae.html
slug: cheditor-acfadvanced-content-filter-%e9%85%8d%e7%bd%ae
title: ckeditor acf(Advanced Content Filter )配置
wordpress_id: 419
categories:
- uncategorized
tags:
- ckeditor
---

空标签会被过滤

[acf配置规则文档](http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules)

[config.extraAllowedContent](http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-extraAllowedContent)

[plugin integration tutorial](http://docs.ckeditor.com/#!/guide/plugin_sdk_integration_with_acf)

[official Advanced Content Filter guide](http://docs.ckeditor.com/#!/guide/dev_advanced_content_filter)



This turns off the filtering, it's working, but not a good idea...

config.allowedContent = true;
To play with a content string works fine for id, etc, but not for the class and style attributes, because you have () and {} for class and style filtering.

So my bet is for allowing any class in the editor is:

config.extraAllowedContent = '*(*)';
This allows any class and any inline style.

config.extraAllowedContent = '*(*);*{*}';
To allow only class="asdf1" and class="asdf2" for any tag:

config.extraAllowedContent = '*(asdf1,asdf2)';
(so you have to specify the classnames)

To allow only class="asdf" only for p tag:

config.extraAllowedContent = 'p(asdf)';
To allow id attribute for any tag:

config.extraAllowedContent = '*[id]';
etc etc

To allow style tag (

):

config.extraAllowedContent = 'style';
To be a bit more complex:

config.extraAllowedContent = 'span;ul;li;table;td;style;*[id];*(*);*{*}';
