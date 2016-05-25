---
layout: post
title: "Chocolatey windows 下面的包管理器"
data: 2016-05-25 16:54:57 
categories: uncategorized
tags: powershell chocolatey
---

## Chocolatey

Chocolatey is a package manager for Windows (like apt-get or yum but for Windows). 

Chocolatey是一个windows下的包管理器, 就像linux系统的`apt-get`或`yum`一样.

Chocolatey需要一个Powershell的支持. 

### Powershell 简介 ###

>Powershell 是运行在windows机器上实现系统和应用程序管理自动化的命令行脚本环境。你可以把它看成是命令行提示符cmd.exe的扩充，不对，应当是颠覆。 powershell需要.NET环境的支持，同时支持.NET对象。微软之所以将Powershell 定位为Power，并不是夸大其词，因为它完全支持对象。其可读性，易用性，可以位居当前所有shell之首。 当前powershell有四版本，分别为1.0，2.0，3.0 ,4.0

### Powershell 下载地址 ###

Powershell 1.0 [下载地址](https://blogs.msdn.microsoft.com/powershell/2007/01/29/windows-powershell-1-0-for-windows-vista/)

Powershell 2.0 [下载地址](http://www.microsoft.com/download/en/details.aspx?id=9864)

powershell 3.0 [介绍](http://www.pstips.net/powershell-version-3.html),[下载](https://www.microsoft.com/en-us/download/details.aspx?id=34595) [安装教程](https://blogs.technet.microsoft.com/heyscriptingguy/2013/06/02/weekend-scripter-install-powershell-3-0-on-windows-7/)

powershell 4.0 [介绍](http://www.pstips.net/windows-management-framework-4-0-is-now-available.html),[下载](https://www.microsoft.com/en-us/download/details.aspx?id=40855)

- 如果您的系统是window7或者Windows Server 2008，那么PowerShell 2.0已经内置了，可以升级为3.0，4.0
- 如果您的系统是Windows 8 或者Windows server 2012，那么PowerShell 3.0已经内置了，可以升级为4.0。
- 如果您的系统为Windows 8.1或者Windows server 2012 R2，那默认已经是4.0了。

### Chocolatey 安装需求 ###

- Windows 7+ / Windows Server 2003+
- PowerShell v2+
- .NET Framework 4+ (the installation will attempt to install .NET 4.0 if you do not have it installed)
- That's it! All you need is choco.exe (that you get from the installation scripts) and you are good to go!. No Visual Studio required.

### Chocolatey 安装 ###

1 打开命令行 输入安装命令, 如果powershell 的路径没有加入环境变量,需要自行切换到powershell目录
	
	C:\Users\Administrator>cd %SystemRoot%\system32\WindowsPowerShell\v1.0\

	C:\Windows\System32\WindowsPowerShell\v1.0>@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin

参考文档 [https://chocolatey.org/install](https://chocolatey.org/install)

### Chocolatey 使用 ###

装个7zip
	
	C:\Windows\System32\WindowsPowerShell\v1.0>choco install 7zip.install

![](http://i4.buimg.com/af7ee9f0dd115bd6.jpg)

当前一共有 ***3950*** 个软件可以安装

安装包列表 [https://chocolatey.org/packages](https://chocolatey.org/packages)

参考文档 [https://chocolatey.org/docs/getting-started](https://chocolatey.org/docs/getting-started)

### 其它 ####

其它命令[https://chocolatey.org/docs/commands-reference#how-to-pass-options--switches](https://chocolatey.org/docs/commands-reference#how-to-pass-options--switches)

通过这些命令,可以快速找到想要的软件, 更新,和删除


