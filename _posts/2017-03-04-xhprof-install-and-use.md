
---
layout: post
title: "xhprof install and use"
data: 2017-03-04 11:09:11 
categories: php
tags: php
---


#xhprof 安装和使用

### 安装

下载地址:[http://pecl.php.net/package/xhprof/0.9.4](http://pecl.php.net/package/xhprof/0.9.4)

下载后解压， 按如下步骤编译

- 进入扩展目录**`cd xhprof/extension`**
- 找到php-config路 `which php-config`
- 运行 `phpize`
- 预编译 `./configure --with-php-config=/path/to/php-config`
- `make && make install`

编译成功后将打印一个路径，里面包含文件 xhprof.so

配置 php.ini 

添加配置

[xhprof]
extension=/path/to/xhprof/xhprof.so
xhprof.output_dir = /tmp/xhprof

创建目录并给权限

- `mkdir -p /tmp/xhprof`
- `chmod 777 /tm/xhprof`

重启 服务器， xhprof就装好了， 

### 使用

保存下面文件为 xhprof.php

	<?php

	xhprof_enable(XHPROF_FLAGS_CPU+XHPROF_FLAGS_MEMORY);

	function end_debug()
	{
	        $data = xhprof_disable();
	        $xhprof_root = "/var/www/html/xhprof";
	        include_once $xhprof_root . "/xhprof_lib/utils/xhprof_lib.php";
	        include_once $xhprof_root . "/xhprof_lib/utils/xhprof_runs.php";
	        $xhprof_runs = new XHprofRuns_Default();
	        $run_id = $xhprof_runs->save_run($data, "test");
	}

    register_shutdown_function('end_debug');

在 index.php 的第一行加载文件  `include "xhprof.php";`

访问网页后， 查看结果：

将 xhprof 目录下面的xhprof_html文件夹放置于可以浏览的地方，直接访问， 就能看到记录的结果了。

