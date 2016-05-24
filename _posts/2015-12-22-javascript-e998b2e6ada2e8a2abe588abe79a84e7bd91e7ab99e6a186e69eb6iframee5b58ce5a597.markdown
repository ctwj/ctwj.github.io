---
author: ww
comments: true
date: 2015-12-22 03:12:19+00:00
layout: post
link: http://www.gl6.cc/blog/javascript-%e9%98%b2%e6%ad%a2%e8%a2%ab%e5%88%ab%e7%9a%84%e7%bd%91%e7%ab%99%e6%a1%86%e6%9e%b6iframe%e5%b5%8c%e5%a5%97.html
slug: javascript-%e9%98%b2%e6%ad%a2%e8%a2%ab%e5%88%ab%e7%9a%84%e7%bd%91%e7%ab%99%e6%a1%86%e6%9e%b6iframe%e5%b5%8c%e5%a5%97
title: '[javascript] 防止被别的网站框架(iframe)嵌套'
wordpress_id: 373
categories:
- Javascript
- uncategorized
tags:
- javascript
---

## javascirpt anti iframe , and crack way
**1. js如何判断是否在iframe中**






	
  1. //方式一

	
  2. if (self.frameElement && self.frameElement.tagName == "IFRAME") {

	
  3.          alert('在iframe中');

	
  4. }

	
  5. //方式二

	
  6. if (window.frames.length != parent.frames.length) {

	
  7.          alert('在iframe中');

	
  8. }

	
  9. //方式三

	
  10. if (self != top) {

	
  11.      alert('在iframe中');

	
  12. }







**2. 防止网页被别站用 iframe嵌套**



将下面的代码加到您的页面 <head></head> 位置即可：






	
  1.  <script language="javascript">

	
  2. <!--

	
  3. if (top.location != location)

	
  4. {

	
  5. top.location.href = location.href;

	
  6. }

	
  7. //-->

	
  8. </script>

	
  9. 
	
  10. //或

	
  11. 
	
  12. <script language="javascript">

	
  13. if(self!=top){top.location.href=self.location.href;}

	
  14. </script>







这个就能让别人无法用iframe嵌套你网站的任何页面,实现的效果是：输入盗链你网站的那个地址后会自动跳到你的网站。



不可靠的原因：
当别人用如下类似代码做IFRAME嵌套调用时，就可能躲过你的页面的javascript代码。






	
  1. <iframe src="你的页面地址" name="tv" marginwidth="0" marginheight="0" scrolling="No" noResize frameborder="0" id="tv"  framespacing="0" width="580" height="550" VSPACE=-145 HSPACE=-385></iframe>

	
  2. <script language="javascript">

	
  3. var location="";

	
  4. var navigate="";

	
  5. frames[0].location.href="";

	
  6. </script>





2.最可靠的方法：
为了彻底防止别人用IFRAME框架嵌套调用自己的网页，如下方法是最可靠的.
这里赋值为空页面,也可赋值为你的页面的URL地址.






	
  1. <script language="javascript">

	
  2. if(top != self){

	
  3.     location.href = "about:blank";

	
  4. }

	
  5. </script>







还有一个完全屏蔽被iframe的方法就是添加：






	
  1. header("X-Frame-Options: deny");

	
  2. header("X-XSS-Protection: 0");







这个也是加载iframe是产生错误“Load denied by X-Frame-Options: http://localhost/××××.php does not permit framing.”的原因！



破解方法

 1. 使用js

    
    <script type="text/javascript">
    	    var prevent_bust = 0  
    	    window.onbeforeunload = function() { prevent_bust++ }  
    	    setInterval(function() {  
    	      if (prevent_bust > 0) {  
    	        prevent_bust -= 2  
    	        window.top.location = '204.php'  
    	      }  
    	    }, 1)  
    	</script>


 

    
    <?php
     sleep(1000);
     header("HTTP/1.0 204 No Content");



2. 使用html5的sandbox
``
考虑到别人使用sandbox来iframe你的网站，可以使用如下js破解
 

    
    <style id="antiClickjack">body{display:none !important;}</style>
    <script type="text/javascript">
       if (self === top) {
           var antiClickjack = document.getElementById("antiClickjack");
           antiClickjack.parentNode.removeChild(antiClickjack);
       } else {
           top.location = self.location;
       }
    </script>




[测试代码](http://www.gl6.cc/blog/wp-content/uploads/2015/12/测试代码.rar)

