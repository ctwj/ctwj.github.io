---
layout: post
title: "Eric Window Install"
data: 2016-10-11 11:09:11 
categories: python
tags: python eric
---

## Eric Window 安装

Python 2.7
----
直接运行文件 `python-2.7.12.amd64.msi`  
选择安装所有特性

pip
----
解压 `pip-9.0.1.tar.gz`  
运行安装命令 `python setup.py install` 

安装完成显示 

	Installed c:\python27\lib\site-packages\pip-9.0.1-py2.7.egg
	Processing dependencies for pip==9.0.1
	Finished processing dependencies for pip==9.0.1

QT
----
直接运行文件 `qt-opensource-windows-x86-msvc2015_64-5.7.0.exe`  

PyQt4
----
直接运行文件 `PyQt4-4.11.4-gpl-Py2.7-Qt4.8.7-x64.exe`   
因为python版本为2.7 需要安装PyQt4, PyQt5是3.x版本的安装, 直接pip安装即可

eric6 安装
----
解压eric6, 解压语言包 `eric6-i18n-zh_CN-16.11.1.zip`将内容放到解压的eric6目录内替换更目录内容  (install-i18n.py应该会被替换)  
直接双击 install.py 文件. 

安装完成后,eric6 下面有个名字叫**eric**的目录, 可执行文件在那个目录下面  
双击 `eric6.pyw` 运行 eric6

## 遗留问题

编译窗体是提示:
> 无法启动pyuic5. 请保证它处在搜索路径中

