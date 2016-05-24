---
author: admin
comments: true
date: 2015-11-10 07:12:57+00:00
layout: post
link: http://www.gl6.cc/blog/ckeditor-widget%e6%8c%82%e4%bb%b6%e7%bc%96%e5%86%99.html
slug: ckeditor-widget%e6%8c%82%e4%bb%b6%e7%bc%96%e5%86%99
title: ckeditor widget挂件编写
wordpress_id: 248
categories:
- uncategorized
tags:
- ckeditor
---

Ckeditor的挂件开发


### 什么是挂件


挂件是由一组能够被单独设置好的单元组成的的富文本内容单元，一旦开发好，结构便不可修改。整个单元可以被自由的选择删除或移动，并保持结构完整。同时所有的小单元可以编辑和配置，同时不影响整个单元的结构。

挂件和插件很类似，有相同的结构，能够被添加到编辑器。


### 挂件开发


1. 挂件的文件组成
在plugins目录添加ctwj_li目录，这里将放置pugin.js文件，这个文件包含挂件的逻辑代码。
创建一个icons目录存放挂件的图标，比如命名ctwj_li.png 。

2. plugin.js

当新建好文件后，为挂件创建代码

    
    CKEDITOR.plugins.add( ' ckwj_li ', {
        requires: 'widget',
        icons: 'ctwj_li',
        init: function( editor ) {
            editor.widgets.add( 'ctwj_li', {
                button: '列表',
                template:
                '<div class="ctwj"><ul class="ctwj_cicle_ul ctwj_li">'+
                '<li>Fast download videos from</li>'+
                '<li>1 click download all video</li>'+
                '<li>Convert videos to any fo</li>'+
                '<li>Please downloaded video</li>'+
                '</ul></div>',
                editables:{
                    content: {
                        selector: '.ctwj',
                        allowedContent: 'ul(!ctwj_cicle_ul); ul(!ctwj_li); li'
                    }
                }        })
        }} );
    





	
  1. 所有的ckeditor插件都是通过 CKEDITOR.plugins.add 函数创建的。这个函数应该包含插件的名字，init函数中加入插件的逻辑代码，这个init函数会在编辑器实例化是被执行。

	
  2. 其中button配置的是工具栏的按钮，其中显示的图标是icons配置的，icons配置要求是一个不加后缀名的png图片。

	
  3. Template 是显示的内容，点击button后，template的内容会被打印到编辑器中。

	
  4. Editables 是配置其中可编辑元素，根据元素的class来选取

	
  5. Editabes里面的allowedContent同样重要，因为ckeditor会自动过滤掉内联样式，如果不指明这些class，样式就会被过滤，啥都没有了。当然过滤机制还可以实现限制标签的作用。


3. 配置，还是和插件一样

`config.extraPlugins += (config.extraPlugins ? ',ctwj_li' : 'ctwj_li');`

4. 添加样式
在插件目录添加一个css文件widget.css

    
    .ctwj{
        background: red;
    }
    .ckww_li li{
        padding: 60px;
        /*color: gray;*/
    }
    .ckww_none_ul{
        list-style: none;
    }
    .ckww_cicle_ul {
        list-style: circle;
    }
    .ckww_disc_ul {
        list-style: disc;
    }
    .ckww_decimal_ul {
        list-style: decimal;
    }


并在配置并在配置文件中添加

    
    if (typeof CKEDITOR.config.contentsCss === 'string') {
        CKEDITOR.config.contentsCss = [CKEDITOR.config.contentsCss];
    }
    CKEDITOR.config.contentsCss.push(CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'ctwj_li/widget.css');
    


5. 到这挂件就添加好了，可以在编辑其中看到效果了

[![ctwj_li](http://www.gl6.cc/blog/wp-content/uploads/2015/11/ctwj_li-300x130.jpg)](http://www.gl6.cc/blog/wp-content/uploads/2015/11/ctwj_li.jpg)

[ckeditor添加挂件](http://www.gl6.cc/blog/wp-content/uploads/2015/11/ckeditor添加挂件.doc)
