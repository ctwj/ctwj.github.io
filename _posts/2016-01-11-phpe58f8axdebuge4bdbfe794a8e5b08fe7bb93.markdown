---
author: ww
comments: true
date: 2016-01-11 08:23:52+00:00
layout: post
link: http://www.gl6.cc/blog/php%e5%8f%8axdebug%e4%bd%bf%e7%94%a8%e5%b0%8f%e7%bb%93.html
slug: php%e5%8f%8axdebug%e4%bd%bf%e7%94%a8%e5%b0%8f%e7%bb%93
title: php及xdebug使用小结
wordpress_id: 429
categories:
- PHP
tags:
- php
- 调试
---

php下搭配使用xdebug是十分好的组合，用于php的调试工作，下面分别介绍之：
1 WINDOWS下的安装
下载站点http://www.xdebug.org/
要确定使用一个跟你的PHP配合的版本才行，比如xdebug中的5。2系列版本是跟5.2
的php搭配的，5.3系列的跟5.3的PHP搭配的。目前的版本是2。1，然后你会发现
有相应的线程安全和非安全两个版本。如何知道下载哪个版本呢，可以将你跑
PHPINFO时的显示出来网页的源代码，COPY到
http://www.xdebug.org/find-binary.php中，然后提交，然后XDEBUG为告诉你
应该下载哪个版本了

将下载的文件放到d:\php\ext目录，重命名为php_xdebug.dll。
然后修改PHP。INI如下：
[Xdebug]
zend_extension="D:\php\ext\php_xdebug.dll"
xdebug.profiler_output_dir="D:\php53\xdebug"
xdebug.profiler_enable=On
xdebug.profiler_enable_trigger=1
xdebug.default_enable=On
xdebug.show_exception_trace=On
xdebug.show_local_vars=1
xdebug.max_nesting_level=50
xdebug.var_display_max_depth=6
xdebug.dump_once=On
xdebug.dump_globals=On
xdebug.dump_undefined=On
xdebug.dump.REQUEST=*
xdebug.dump.SERVER=REQUEST_METHOD,REQUEST_URI,HTTP_USER_AGENT
xdebug.trace_output_dir="D:\php53\xdebug"

注意要建立一个xdebug目录放调试输出的文件。
重新启动apache，在phpinfo中就可以看到有关XDEBUG的部分了

2 LINUX下的安装
tar -xzf xdebug-2.0.0RC3.gz
cd xdebug-2.0.0RC3
/usr/local/php/bin/phpize
./configure --enable-xdebug
cp modules/xdebug.so /usr/local/php/lib/php/extensions/no-debug-non-zts-20020429/

注：/usr/local/php/lib/php/extensions/no-debug-non-zts-20020429/不同的PHP版本路径不同，也不一定要放在该路径，可以在zend_extension_ts中自行指定xdebug.so所在位置。


3 使用，可以写个简单程序去看效果，比如：
<?php
testXdebug();
function testXdebug() {
require_once('abc.php');
}
?>
运行后，可以看到是象JAVA一样，用堆栈的方式去输出错误的相关部分的。

4 分析xdbebug下面的输出文件
因为这个目录下的文件比较难理解，因此可以下载工具来分析之，比如：
KCacheGrind（适用于Linux）、WinCacheGrind（适用于Windows）和Webgrind（Web页面方式）。
我用的是WinCacheGrind（http://sourceforge.net/projects/wincachegrind)
之后就可以打开输出文件来去看了。

5 xdebug的一些配置
xdebug.default_enable
类型：布尔型 默认值：On
如果这项设置为On，堆栈跟踪将被默认的显示在错误事件中。你可以通过在代码中使用xdebug_disable()来禁止堆叠跟踪的显示。因为这是xdebug基本功能之一，将这项参数设置为On是比较明智的。

xdebug.max_nesting_level
类型：整型 默认值：100
The value of this setting is the maximum level of nested functions that are allowed before the script will be aborted.
限制无限递归的访问深度。这项参数设置的值是脚本失败前所允许的嵌套程序的最大访问深度。

xdebug.dump_globals
类型：布尔型 默认值：1
限制是否显示被xdebug.dump.*设置定义的超全局变量的值
例如，xdebug.dump.SERVER = REQUEST_METHOD,REQUEST_URI,HTTP_USER_AGENT 将打印 PHP 超全局变量 $_SERVER['REQUEST_METHOD']、$_SERVER['REQUEST_URI'] 和 $_SERVER['HTTP_USER_AGENT']。

xdebug.dump_once
类型：布尔型 默认值：1
限制是否超全局变量的值应该转储在所有出错环境(设置为Off时)或仅仅在开始的地方(设置为On时)

xdebug.dump_undefined
类型：布尔型 默认值：0
如果你想从超全局变量中转储未定义的值，你应该把这个参数设置成On，否则就设置成Off

xdebug.show_exception_trace
类型：整型 默认值：0
当这个参数被设置为1时，即使捕捉到异常，xdebug仍将强制执行异常跟踪当一个异常出现时。

xdebug.show_local_vars
类型：整型 默认值：0
当这个参数被设置为不等于0时，xdebug在错环境中所产生的堆栈转储还将显示所有局部变量，包括尚未初始化的变量在最上面。要注意的是这将产生大量的信息，也因此默认情况下是关闭的。


xdebug.profiler_append
类型：整型 默认值：0
当这个参数被设置为1时，文件将不会被追加当一个新的需求到一个相同的文件时(依靠xdebug.profiler_output_name的设置)。相反的设置的话，文件将被附加成一个新文件。

xdebug.profiler_enable
类型：整型 默认值：0
开放xdebug文件的权限，就是在文件输出目录中创建文件。那些文件可以通过KCacheGrind来阅读来展现你的数据。这个设置不能通过在你的脚本中调用ini_set()来设置。

xdebug.profiler_output_dir
类型：字符串 默认值：/tmp
这个文件是profiler文件输出写入的，确信PHP用户对这个目录有写入的权限。这个设置不能通过在你的脚本中调用ini_set()来设置。

xdebug.profiler_output_name
类型：字符串 默认值：cachegrind.out%p
这个设置决定了转储跟踪写入的文件的名称。

远程Debug
相关参数设置
xdebug.remote_autostart
类型：布尔型 默认值：0
一般来说，你需要使用明确的HTTP GET/POST变量来开启远程debug。而当这个参数设置为On，xdebug将经常试图去开启一个远程debug session并试图去连接客户端，即使GET/POST/COOKIE变量不是当前的。

xdebug.remote_enable
类型：布尔型 默认值：0
这个开关控制xdebug是否应该试着去连接一个按照xdebug.remote_host和xdebug.remote_port来设置监听主机和端口的debug客户端。

xdebug.remote_host
类型：字符串 默认值：localhost
选择debug客户端正在运行的主机，你不仅可以使用主机名还可以使用IP地址

xdebug.remote_port
类型：整型 默认值：9000
这个端口是xdebug试着去连接远程主机的。9000是一般客户端和被绑定的debug客户端默认的端口。许多客户端都使用这个端口数字，最好不要去修改这个设置。
