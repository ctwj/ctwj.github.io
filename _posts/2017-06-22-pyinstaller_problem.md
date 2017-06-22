---
author: ww
date: 2017-01-10 01:15:57+00:00
title: Pyinstaller 打包，程序一闪而过
categories:
- python
tags:
- python
- pyinstaller
---

#0x00 前言 
----

最近写的一个小程序，用pyinstaller3.2打包，一开始正常，后来新加了一个库`langdetect`用来检测语言，打包过程没有问题，运行程序后一闪而过。

#0x01 错误定位
----

命令行中运行程序，提示错误
>File "site-packages\langdetect\utils\messages.py", line 9, in __init__
IOError: [Errno 2] No such file or directory: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\_MEI12~2\\langdetect\\utils\\messages.properties'

定位到库中`messages.py`发现如下代码


    MESSAGES_FILENAME = path.join(path.dirname(__file__), 'messages.properties')

    def __init__(self):
        self.messages = {}
        with open(self.MESSAGES_FILENAME, 'r') as f:

库里面是有`messages.properties`这个文件的， 而程序打包后并没有。

#0x02 解决办法
----

问题很清楚，文件缺失，  
要想解决自然需要代码找到这个文件  ，很容易想到解决办法有两个， 

1. 修改代码，让这个库不再需要这个文件
2. 打包的时候，带上这个文件

经过对pyinstaller文档的阅读，和搜索的结果，没有有发现好的方法，能带上这个资源文件。

#0x03 实施
----

最后选择方法1

1. `messages.py`

	>MESSAGES_FILENAME = path.join(path.dirname(__file__), 'messages.properties')

	修改为

	>MESSAGES_FILENAME = path.join(getcwd(), 'messages.properties')

2. `detector_factory.py`

	>PROFILES_DIRECTORY = path.join(path.dirname(__file__), 'profiles')
	
	修改为
	
	>PROFILES_DIRECTORY = path.join(os.getcwd(), 'profiles')

3. 将`langdetect`目录下相关资源拷贝到打包程序目录

4. 重新打包

5. 运行正常






 