---
layout: post
title: "wordpress 添加QQ登录菜单到首页"
data: 2016-08-17 11:09:11 
categories: wordpress
tags: wordpress qq
---

## wordpress 添加QQ登录到首页

1. 申请QQ互联

2. 安装插件Open Social, 并使用申请到的参数配置

3. 修改模版 主题页眉 (header.php), 可能每个主题不一样, 这个是针对 Responsive Mobile 主题

		<?php if (!is_user_logged_in() ) { ?>
		<div id="top-menu-container" class="container-full-width">
		<div style="display:inline-block;padding-left:150px"><?php echo open_social_login_html();?></div>
		</div>
		<?php } ?>

4. 这个代码使用的 主题top_menu的样式,最终效果
	![](http://i.imgur.com/syABpiS.jpg) 

5. 默认open social 的qq登录图标不是长这个样子, 还需要自己手动修改下插件的样式, 下载个这样的图片. 