---
author: ww
comments: true
date: 2015-12-24 16:10:57+00:00
layout: post
link: http://www.gl6.cc/blog/delphidelphi-xe2-%e7%bc%96%e8%af%91%e5%90%8e%e7%a8%8b%e5%ba%8f%e5%a4%a7%e5%b0%8f%e9%97%ae%e9%a2%98.html
slug: delphidelphi-xe2-%e7%bc%96%e8%af%91%e5%90%8e%e7%a8%8b%e5%ba%8f%e5%a4%a7%e5%b0%8f%e9%97%ae%e9%a2%98
title: '[delphi]Delphi XE2 编译后程序大小问题'
wordpress_id: 392
categories:
- Delphi
- uncategorized
tags:
- delphi
---

说说编译后的程序大小。其实最终得到的程序并不大，由于编译器的变化，XE2里Debug版程序比Release版程序大很多，要减小程序体积，就使用Release版。下面给出稍微具体点的信息（都是空程序）：

Win32 Debug版 VCL程序大约6M           FireMonkey程序大约8M
Win32 Release版 VCL程序大约1.5M       FireMonkey程序大约3M
Win64 Debug版 VCL程序大约7M           FireMonkey程序大约9M
Win64 Release版 VCL程序大约2M          FireMonkey程序大约4M

 

减小体积的方法：

1、最终使用Release编译模式

2、关闭RTTI反射机制减少EXE文件尺寸在Interface下面加如下代码

{ 关闭RTTI反射机制减少EXE文件尺寸 }
{$IF CompilerVersion >= 21.0}
{$WEAKLINKRTTI ON}
{$RTTI EXPLICIT METHODS([]) PROPERTIES([]) FIELDS([])}
{$IFEND}

3、最终发布程序可再使用Free_UPX（推荐）或ASPACK再次压缩。

这样下来，使用Delphi XE2编译的程序体积可小很多了。虽然还是比Delphi 7大，但可接受了。
