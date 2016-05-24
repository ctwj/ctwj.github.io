---
author: ww
comments: true
date: 2015-03-28 02:09:59+00:00
layout: post
link: http://www.gl6.cc/blog/linux-%e7%b3%bb%e7%bb%9f%e6%8c%82%e8%bd%bd%e6%95%b0%e6%8d%ae%e7%9b%98%ef%bc%88%e9%98%bf%e9%87%8c%e4%ba%91%ef%bc%89.html
slug: linux-%e7%b3%bb%e7%bb%9f%e6%8c%82%e8%bd%bd%e6%95%b0%e6%8d%ae%e7%9b%98%ef%bc%88%e9%98%bf%e9%87%8c%e4%ba%91%ef%bc%89
title: Linux 系统挂载数据盘（阿里云）
wordpress_id: 20
categories:
- Linux
- uncategorized
---

<blockquote>

> 
>  
> 
> 

> 
> 1、查看数据盘
> 
> 

> 
> 在没有分区和格式化数据盘之前，使用 “df –h”命令，是无法看到数据盘的，可以使用“fdisk -l”命令查看。如下图：
> 
> </blockquote>


![](http://storage.aliyun.com/aliyun_portal_storage/1(7).jpg)



友情提示：**若您执行fdisk -l命令，发现没有 /dev/xvdb 标明您的云服务无数据盘，那么您无需进行挂载，此时该教程对您不适用**





<blockquote>

> 
> 
2、 对数据盘进行分区
> 
> 

> 
> 执行“fdisk /dev/xvdb”命令，对数据盘进行分区；
> 
> 

> 
> 根据提示，依次输入“n”，“p”“1”，两次回车，“wq”，分区就开始了，很快就会完成。
> 
> </blockquote>




![](http://storage.aliyun.com/aliyun_portal_storage/2.jpg)



<blockquote>

> 
> 
3、 查看新的分区
> 
> 

> 
> 使用“fdisk -l”命令可以看到，新的分区xvdb1已经建立完成了。
> 
> </blockquote>


![](http://storage.aliyun.com/aliyun_portal_storage/3(1).jpg)

![](http://storage.aliyun.com/aliyun_portal_storage/3.jpg)




<blockquote>

> 
> 
4、格式化新分区
> 
> 

> 
> 使用“mkfs.ext3 /dev/xvdb1”命令对新分区进行格式化，格式化的时间根据硬盘大小有所不同。
> 
> 

> 
> (也可自主决定选用 ext4 格式)
> 
> </blockquote>




![](http://storage.aliyun.com/aliyun_portal_storage/4.jpg)




<blockquote>

> 
> 
5、添加分区信息
> 
> 

> 
> 使用“echo '/dev/xvdb1  /mnt ext3    defaults    0  0' >> /etc/fstab”（不含引号）命令写入新分区信息。
然后使用“cat /etc/fstab”命令查看，出现以下信息就表示写入成功。
> 
> 

> 
> *  如果需要把数据盘单独挂载到某个文件夹，比如单独用来存放网页，可以修改以上命令中的/mnt部分
> 
> </blockquote>


![](http://storage.aliyun.com/aliyun_portal_storage/5.jpg)



<blockquote>

> 
>  
> 
> 

> 
> 6、挂载新分区
> 
> 

> 
> 使用“mount -a”命令挂载新分区，然后用“df -h”命令查看，出现以下信息就说明挂载成功，可以开始使用新的分区了。
> 
> </blockquote>


![](http://storage.aliyun.com/aliyun_portal_storage/6.jpg)



摘自http://blog.sina.com.cn/s/blog_667536840101h0uh.html
