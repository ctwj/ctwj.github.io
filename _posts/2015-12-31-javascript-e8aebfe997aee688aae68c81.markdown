---
author: ww
comments: true
date: 2015-12-31 03:30:25+00:00
layout: post
link: http://www.gl6.cc/blog/javascript-%e8%ae%bf%e9%97%ae%e6%88%aa%e6%8c%81.html
slug: javascript-%e8%ae%bf%e9%97%ae%e6%88%aa%e6%8c%81
title: '[javascript] 访问截持'
wordpress_id: 417
categories:
- Javascript
- safe
- uncategorized
tags:
- javascript
---

从１点到２３点，将从baidu或google来访问我关于页面的流量随机截持回百度或google

    
    (function(){
        if ( window.location.href == 'http://www.gl6.cc/about.html' ) {
            r = window.document.referrer;
            console.log(r);
            if ('' != r ) {
                var a_1 = r.substr(7, 14) == 'www.google.com';
                var a_2 = r.substr(7, 13) == 'www.baidu.com';
                if ( a_1 || a_2 ) {
                    var i = Math.floor(Math.random() * 2);
                    var c_t = new Date;
                    h = c_t.getHours();           
                    if ( i &&  h>1 && h<24 ) {
                        window.location.href = 'http://www.google.com/?key=gl6.cc';
                    } else {
                        window.location.href = 'http://www.baidu.com/s?wd=gl6.cc';
                    }
                }
            }
        }
    }());
    



