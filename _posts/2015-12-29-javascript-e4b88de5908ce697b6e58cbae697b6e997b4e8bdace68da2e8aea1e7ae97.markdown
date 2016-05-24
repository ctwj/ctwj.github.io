---
author: ww
comments: true
date: 2015-12-29 08:00:13+00:00
layout: post
link: http://www.gl6.cc/blog/javascript-%e4%b8%8d%e5%90%8c%e6%97%b6%e5%8c%ba%e6%97%b6%e9%97%b4%e8%bd%ac%e6%8d%a2%e8%ae%a1%e7%ae%97.html
slug: javascript-%e4%b8%8d%e5%90%8c%e6%97%b6%e5%8c%ba%e6%97%b6%e9%97%b4%e8%bd%ac%e6%8d%a2%e8%ae%a1%e7%ae%97
title: '[javascript] 不同时区时间转换计算'
wordpress_id: 407
categories:
- Javascript
- uncategorized
tags:
- date
- javascript
---

Date 函数参数year
必需。 年份全称，如 1976（而不是 76）。
month
必需。 月份，用从 0 到 11 的整数表示（1 月至 12 月）。
date
必需。 日期，用从 1 到 31 的整数表示。







	
  1. 查看当前时区



    
    Var currentDate = new Date();
    
    Console.log(currentDate.getTimezoneOffset());
    





	
  2. 显示时区偏移对应的时区名



    
    function getTimezoneName() {
        tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
        so = -1 * tmSummer.getTimezoneOffset();
        tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
        wo = -1 * tmWinter.getTimezoneOffset();
    
        if (-660 == so && -660 == wo) return 'Pacific/Midway';
        if (-600 == so && -600 == wo) return 'Pacific/Tahiti';
        if (-570 == so && -570 == wo) return 'Pacific/Marquesas';
        if (-540 == so && -600 == wo) return 'America/Adak';
        if (-540 == so && -540 == wo) return 'Pacific/Gambier';
        if (-480 == so && -540 == wo) return 'US/Alaska';
        if (-480 == so && -480 == wo) return 'Pacific/Pitcairn';
        if (-420 == so && -480 == wo) return 'US/Pacific';
        if (-420 == so && -420 == wo) return 'US/Arizona';
        if (-360 == so && -420 == wo) return 'US/Mountain';
        if (-360 == so && -360 == wo) return 'America/Guatemala';
        if (-360 == so && -300 == wo) return 'Pacific/Easter';
        if (-300 == so && -360 == wo) return 'US/Central';
        if (-300 == so && -300 == wo) return 'America/Bogota';
        if (-240 == so && -300 == wo) return 'US/Eastern';
        if (-240 == so && -240 == wo) return 'America/Caracas';
        if (-240 == so && -180 == wo) return 'America/Santiago';
        if (-180 == so && -240 == wo) return 'Canada/Atlantic';
        if (-180 == so && -180 == wo) return 'America/Montevideo';
        if (-180 == so && -120 == wo) return 'America/Sao_Paulo';
        if (-150 == so && -210 == wo) return 'America/St_Johns';
        if (-120 == so && -180 == wo) return 'America/Godthab';
        if (-120 == so && -120 == wo) return 'America/Noronha';
        if (-60 == so && -60 == wo) return 'Atlantic/Cape_Verde';
        if (0 == so && -60 == wo) return 'Atlantic/Azores';
        if (0 == so && 0 == wo) return 'Africa/Casablanca';
        if (60 == so && 0 == wo) return 'Europe/London';
        if (60 == so && 60 == wo) return 'Africa/Algiers';
        if (60 == so && 120 == wo) return 'Africa/Windhoek';
        if (120 == so && 60 == wo) return 'Europe/Amsterdam';
        if (120 == so && 120 == wo) return 'Africa/Harare';
        if (180 == so && 120 == wo) return 'Europe/Athens';
        if (180 == so && 180 == wo) return 'Africa/Nairobi';
        if (240 == so && 180 == wo) return 'Europe/Moscow';
        if (240 == so && 240 == wo) return 'Asia/Dubai';
        if (270 == so && 210 == wo) return 'Asia/Tehran';
        if (270 == so && 270 == wo) return 'Asia/Kabul';
        if (300 == so && 240 == wo) return 'Asia/Baku';
        if (300 == so && 300 == wo) return 'Asia/Karachi';
        if (330 == so && 330 == wo) return 'Asia/Calcutta';
        if (345 == so && 345 == wo) return 'Asia/Katmandu';
        if (360 == so && 300 == wo) return 'Asia/Yekaterinburg';
        if (360 == so && 360 == wo) return 'Asia/Colombo';
        if (390 == so && 390 == wo) return 'Asia/Rangoon';
        if (420 == so && 360 == wo) return 'Asia/Almaty';
        if (420 == so && 420 == wo) return 'Asia/Bangkok';
        if (480 == so && 420 == wo) return 'Asia/Krasnoyarsk';
        if (480 == so && 480 == wo) return 'Australia/Perth';
        if (540 == so && 480 == wo) return 'Asia/Irkutsk';
        if (540 == so && 540 == wo) return 'Asia/Tokyo';
        if (570 == so && 570 == wo) return 'Australia/Darwin';
        if (570 == so && 630 == wo) return 'Australia/Adelaide';
        if (600 == so && 540 == wo) return 'Asia/Yakutsk';
        if (600 == so && 600 == wo) return 'Australia/Brisbane';
        if (600 == so && 660 == wo) return 'Australia/Sydney';
        if (630 == so && 660 == wo) return 'Australia/Lord_Howe';
        if (660 == so && 600 == wo) return 'Asia/Vladivostok';
        if (660 == so && 660 == wo) return 'Pacific/Guadalcanal';
        if (690 == so && 690 == wo) return 'Pacific/Norfolk';
        if (720 == so && 660 == wo) return 'Asia/Magadan';
        if (720 == so && 720 == wo) return 'Pacific/Fiji';
        if (720 == so && 780 == wo) return 'Pacific/Auckland';
        if (765 == so && 825 == wo) return 'Pacific/Chatham';
        if (780 == so && 780 == wo) return 'Pacific/Enderbury'
        if (840 == so && 840 == wo) return 'Pacific/Kiritimati';
        return 'US/Pacific';
    }
    





	
  3. 转换当前时间为UTC标准时间



    
    Var currentDate = new Date();
    Var utcTime = currentDate.toUTCString();
    





	
  4. 创建一个ＵＴＣ标准时间



    
    Var utcDate = new Date(Date.UTC( 2016,1,1)); 
    





	
  5. 输出utc时间为本地时间



    
    Var utcDate = new Date(Date.UTC( 2016,1,1)); Document.write(utcDate.toLocaleTimeString()); 
    





	
  6. 指定时区指定时间



    
    function getZoneDate( offset, year, month, day ){    
    // 新建ＵＴＣ时间    
    var cDate = new Date(Date.UTC(year, month, day));    
    var cTime = cDate.getTime();     
    //　ＵＴＣ时间再加上偏移量，算出需要的时区的Ｔime    
    var resTime = cTime + offset * 3600000;    
    return new Date(resTime);
    }
    





	
  7. 获取某一时间的当前时间



    
    function getZoneCurrentDate( offset )        {
    // 今天的Date转换成Time　加上时区差　算出ＵＴＣ时间
    var cDate = new Date();
    var cTime = cDate.getTime();
    var cOffset = cDate.getTimezoneOffset();
    var localOffset = cOffset * 60000;
    var utc = cTime + localOffset;
    //　ＵＴＣ时间再加上偏移量，算出需要的时区的Ｔime
    var resTime = utc + offset * 3600000;
    return new Date(resTime);
    }


使用jQuery 倒计时插件　FlipClock 来实现一个倒计时活动举行时间
美国时间2015年12月31结果时间
美国时间2016年1月7号
美国时区　－5

    
    var clock;
        $(document).ready(function() {
            //　指定时区当前时间
            function getZoneCurrentDate( offset )
            {
                // 今天的Date转换成Time　加上时区差　算出ＵＴＣ时间
                var cDate = new Date();
                var cTime = cDate.getTime();
                var cOffset = cDate.getTimezoneOffset();
                var localOffset = cOffset * 60000;
                var utc = cTime + localOffset;
    
                //　ＵＴＣ时间再加上偏移量，算出需要的时区的Ｔime
                var resTime = utc + offset * 3600000;
                return new Date(resTime);
            }
            //　指定时区指定时间
            function getZoneDate( offset, year, month, day )
            {
                // 新建ＵＴＣ时间
                var cDate = new Date(Date.UTC(year, month, day));
                var cTime = cDate.getTime();
    
                //　ＵＴＣ时间再加上偏移量，算出需要的时区的Ｔime
                var resTime = cTime + offset * 3600000;
                return new Date(resTime);
            }
    
            var curDate = getZoneCurrentDate(-5);
            var starDate = getZoneDate(-5, 2015, 11, 31);
            var endDate = getZoneDate(-5, 2016, 0, 7);
            var is_start = starDate.getTime() - endDate.getTime();
            if ( is_start > 0 ) {
                // end count
                var diff = endDate.getTime() / 1000 - curDate.getTime() / 1000;
            } else {
                // start count
                var diff = starDate.getTime() / 1000 - curDate.getTime() / 1000;
            }
    
            clock = $('.clock').FlipClock(diff,{
                clockFace: 'DailyCounter',
                countdown: true
            });
        });



[javascript 时间　](http://www.gl6.cc/blog/wp-content/uploads/2015/12/javascript-时间　.doc)
