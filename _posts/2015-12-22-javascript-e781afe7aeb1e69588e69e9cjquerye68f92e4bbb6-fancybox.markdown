---
author: ww
comments: true
date: 2015-12-22 06:47:45+00:00
layout: post
link: http://www.gl6.cc/blog/javascript-%e7%81%af%e7%ae%b1%e6%95%88%e6%9e%9cjquery%e6%8f%92%e4%bb%b6-fancybox.html
slug: javascript-%e7%81%af%e7%ae%b1%e6%95%88%e6%9e%9cjquery%e6%8f%92%e4%bb%b6-fancybox
title: '[javascript] 灯箱效果jquery插件 fancybox'
wordpress_id: 377
categories:
- Javascript
---

[fancyapps-fancyBox-18d1712](http://www.gl6.cc/blog/wp-content/uploads/2015/12/fancyapps-fancyBox-18d1712.rar)


### 注意事项


需要添加css js 和图片，如果不添加图片，那么会不显示关闭按钮
插件需要图片外面有一个a标签包裹，如果没有，可以通过js批量添加一个

    
    $(".articles_main").find('img').each( function (){
                if ( $(this).parent().is('a') );
                  // 父元素本来是a的不处理
                else {
                    //没有经过处理的图片通通包裹a标签
                    var img = $(this).attr('src');
                    $(this).wrap('<a class="fancybox" href="'+img+'"></a>');
                }
    
            });
            $(".fancybox").fancybox({
                'hideOnContentClick': true
            });


官方网站：http://fancyapps.com/fancybox/ 
