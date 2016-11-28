---
layout: post
title: "DVWA  Vulnerabilityh: Command Injection"
data: 2016-10-11 11:09:11 
categories: php
tags: php 
---

Vulnerability: Command Injection(命令注入漏洞)
----

命令注入和sql注入, 都有注入这个词, 实际上也差不多, sql注入是将查询语句注入到sql语句中, 从而查询出我们需要的信息,而命令注入将命令注入到命令中, 从而执行我们的命令. 

1. Security Level [low]  
----

	if( isset( $_POST[ 'Submit' ]  ) ) {
		// Get input
		$target = $_REQUEST[ 'ip' ];
	
		// Determine OS and execute the ping command.
		if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
			// Windows
			$cmd = shell_exec( 'ping  ' . $target );
		}
		else {
			// *nix
			$cmd = shell_exec( 'ping  -c 4 ' . $target );
		}
	
		// Feedback for the end user
		$html .= "<pre>{$cmd}</pre>";
	}	

看下代码

	$target = $_REQUEST[ 'ip' ];
	$cmd = shell_exec( 'ping  ' . $target );

实际就这两句, 无论传什么过来 前面直接加`ping`就完事了, 然而事情并没有这么简单, 命令是可以组合的  `ping 127.0.0.1 && dir` ping完以后还会执行`dir`命令,所以问题很严重.

2. Security Level [medium]   
----
代码就不全贴了

	$target = $_REQUEST[ 'ip' ];

	// Set blacklist
	$substitutions = array(
		'&&' => '',
		';'  => '',
	);

	// Remove any of the charactars in the array (blacklist).
	$target = str_replace( array_keys( $substitutions ), $substitutions, $target );

在中级里面多了一个黑名单, 过滤了一些字符,低级的时候我们用的命令就过不去了. 但是黑名单最大的问题就是容易漏过一些字符. `||` 就被漏过了, `||` 后面执行的条件是前面的命令执行失败.

3. Security Level [high]   
----

	$target = trim($_REQUEST[ 'ip' ]);

	// Set blacklist
	$substitutions = array(
		'&'  => '',
		';'  => '',
		'| ' => '',
		'-'  => '',
		'$'  => '',
		'('  => '',
		')'  => '',
		'`'  => '',
		'||' => '',
	);

	// Remove any of the charactars in the array (blacklist).
	$target = str_replace( array_keys( $substitutions ), $substitutions, $target );

高级里面提供了一个更加强大的黑名单, 看起来已经无懈可击了,但是确实还有点小问题, 实际上 组合的命令之间,并不需要空格也能够执行.一般输入 `ping 127.0.0.1 | dir` 能够执行成功, 但是去掉空格,照样能执行 `ping 127.0.0.1 |dir`, 所以简单的传个 `|dir`就能突破了.

4. Security Level [impossible]
----

	$target = $_REQUEST[ 'ip' ];
	$target = stripslashes( $target );

	// Split the IP into 4 octects
	$octet = explode( ".", $target );

	// Check IF each octet is an integer
	if( ( is_numeric( $octet[0] ) ) && ( is_numeric( $octet[1] ) ) && ( is_numeric( $octet[2] ) ) && ( is_numeric( $octet[3] ) ) && ( sizeof( $octet ) == 4 ) ) {
		// If all 4 octets are int's put the IP back together.
		$target = $octet[0] . '.' . $octet[1] . '.' . $octet[2] . '.' . $octet[3];

不可能入侵的代码, 这个不是简单的过滤了, 而是必须是ip格式,什么东西都加不经来,很安全.

参考
>[www.safecode.cc 命令注入](http://www.safecode.cc/index.php?p=/discussion/47/dvwa-%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E8%BF%87%E5%85%B3%E6%AD%A5%E9%AA%A4%E5%92%8C%E8%A7%86%E5%B1%8F#latest)