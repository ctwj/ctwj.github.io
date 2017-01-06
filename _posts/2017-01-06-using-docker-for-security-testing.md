---
layout: post
title: "Using Docker For Security Testing"
data: 2016-10-11 11:09:11 
categories: linux
tags: linux
---

# 使用docker进行安全测试

现在docker已经在很多领域非常有用了, 属于近年来比较火的项目, 确实是一个不错的东西,对资源的利用率比传统的虚拟机好很多,并且使用方便.

首先在解决了安全测试程序的环境问题,很多有用的安全测试工具只需要`git clone` 就能取回.同时又能隔离环境,不会因为安装的工具影响环境.

现在[Docker Hub](https://hub.docker.com/) 已经能够找到很多工具容器了, 比如 [OpenVAS](http://www.openvas.org/)工具, 就有好几个版本比如[这个](https://hub.docker.com/r/mikesplain/openvas/).

docker的一个优点就是能够自己构建容易, 通过dockerfile可以自己构建需要的镜像, 只需要构建一次, 以后都能够简单的获得这个构建的工具,具体构建方法网上已经有很多资料.

一些有用的docker容器列表:

- [Dradis community](https://registry.hub.docker.com/u/raesene/auto-docker-dradis/)      IT安全专家协作和报告平台
- [OWASP ZAP](https://hub.docker.com/r/owasp/zap2docker-stable/)      一个易于使用交互式的用于web应用程序漏洞挖掘的渗透测试工具
- [Kali Linux](https://hub.docker.com/r/kalilinux/kali-linux-docker/)      基于Ubuntu的渗透测试平台
- [WPScan](https://hub.docker.com/r/wpscanteam/wpscan/)      wordpress漏洞扫描工具使用