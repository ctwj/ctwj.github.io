---
layout: post
title: "从wordpress到jekyll"
data: 2016-05-15 16:31:32
categories: uncategorized
tags: jekyll
---


## wordpress to jekyll ##

阿里云的免费数据库果断被关闭,还好有备份没有数据丢失,于是将bolg转为jekyll.

### step 1. wordpress数据库备份 ###

wordpres数据下载回来后,重新架设了一份,做最后的处理

- 将目录名称全部改为英文
- 安装插件 WP Slug Translate,并全选文章编辑保存, 将url变成英文
- 工具->导出 导出文章为xml备用

### step 2. 使用exitwp工具将xml转换成md格式

找了一个kali系统, 安转exitwp并完成了转换

- `apt-get install python-yaml python-bs4 python-html2text`
- `apt-get install libyaml-dev python-dev build-essential`
- `git clone https://github.com/thomasf/exitwp`
- 复制导出的xml文件到exitwp的**wordpress-xml**目录
- 执行`./exitwp` 自动在build目录生成相关目录和文件

相关帮助 [exitup in github](https://github.com/yourtion/exitwp)

### step 3 安装jekyll ###

参考 [Setup Jekyll on Windows](http://yizeng.me/2013/05/10/setup-jekyll-on-windows/)
参考 [在windows环境下从wordpress迁移到jekyll](http://blog.csdn.net/jarry046/article/details/43054219)

安装好后,本地运行成功(`jekll server`),访问`http://localhost:4000`没有问题

### step 4 生成网站 ###

安装无误后, 下载[模版](https://github.com/P233/3-Jekyll),

-  将模版替换到默认的文件夹中, 
-  跟换相关配置
- 转换出来的md文件放到**_posts**文件夹中
- 运行命令 `jekyll b` 编译网站
- 运行命令 `jekyll server` 启动网站
- http://localhost:4000 预览已经有文章的网站

各个步骤无误,wordpress已经基本被转换过来了,如果有问题还需要以后慢慢发现

### setp 5 将网站发布到服务器 ###

- 在coding.net新建一个项目
- 添加一个分支, 分支名字任意
- 开启pages服务,分支选新建的分支名
- 在本地clone回后切换分支,将所有的文件push到这个分支内
- 绑定一个自己的域名, 并将域名解析到`pages.coding.me`

线上运行成功

### step 6 编写文章 ###

需要一个支持`MarkDown`的编辑器, 下载了两个试用,**markdownpad** **farbox**
当前使用markdownpad,感觉还行.

完成文章后复制到_posts目录,git提交.

关于写文章,参考 
[Jekyll使用篇](http://www.jianshu.com/p/ffbbed22f984)
[认识与入门 Markdown](http://sspai.com/25137)
注意事项
- 保存文件格式, 时间_标题.md 其中不能有中文


