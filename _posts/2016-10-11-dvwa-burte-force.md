---
layout: post
title: "DVWA  Vulnerabilityh: Brute Force"
data: 2016-10-11 11:09:11 
categories: php
tags: php dvwa
---

## [DVWA] 暴力破解漏洞 Vulnerability: Brute Force 


DVWA 这这样解释这个关卡的
>Brute Force: HTTP Form Brute Force login page; used to test password
brute force tools and show the insecurity of weak passwords.

1. Security Level [low]   
----
代码如下

	if( isset( $_GET[ 'Login' ] ) ) {
		// Get username
		$user = $_GET[ 'username' ];
	
		// Get password
		$pass = $_GET[ 'password' ];
		$pass = md5( $pass );
	
		// Check the database
		$query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
		$result = mysql_query( $query ) or die( '<pre>' . mysql_error() . '</pre>' );
	
		if( $result && mysql_num_rows( $result ) == 1 ) {
			// Get users details
			$avatar = mysql_result( $result, 0, "avatar" );
	
			// Login successful
			$html .= "<p>Welcome to the password protected area {$user}</p>";
			$html .= "<img src=\"{$avatar}\" />";
		}
		else {
			// Login failed
			$html .= "<pre><br />Username and/or password incorrect.</pre>";
		}
	
		mysql_close();
	}
	
这个代码有什么问题呢? 
 
- 很明显 $user, $pass, 存在注入漏洞, 万能密码(admin' or ''=')  
- 没有csrf token校验  
- 没有验证码
	
因此,可以通过不停测试账号密码, 来找出弱口令, 现在用一个简单代码测试下.

2. Security Level [medium]   
----
代码

	if( isset( $_GET[ 'Login' ] ) ) { 
	    // Sanitise username input 
	    $user = $_GET[ 'username' ]; 
	    $user = mysql_real_escape_string( $user ); 
	
	    // Sanitise password input 
	    $pass = $_GET[ 'password' ]; 
	    $pass = mysql_real_escape_string( $pass ); 
	    $pass = md5( $pass ); 
	
	    // Check the database 
	    $query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
	    $result = mysql_query( $query ) or die( '<pre>' . mysql_error() . '</pre>' ); 
	
	    if( $result && mysql_num_rows( $result ) == 1 ) { 
	        // Get users details 
	        $avatar = mysql_result( $result, 0, "avatar" ); 
	
	        // Login successful 
	        echo "<p>Welcome to the password protected area {$user}</p>"; 
	        echo "<img src=\"{$avatar}\" />"; 
	    } 
	    else { 
	        // Login failed 
	        sleep( 2 ); 
	        echo "<pre><br />Username and/or password incorrect.</pre>"; 
	    } 
	
	    mysql_close(); 
	} 

可以看到, 传过来的参数,都用 `mysql_real_escape_string` 进行了过滤, 事实上这个跟暴力破解没任何关系, 但是修复了low 时的,注入问题(并非完全修复)

**mysql_real_escape_string()** 函数转义 SQL 语句中使用的字符串中的特殊字符。  
下列字符受影响：  
\x00  
\n  
\r  
\  
'  
"  
\x1a  
如果成功，则该函数返回被转义的字符串。如果失败，则返回 false。

所以 万能密码, 经过函数转义后, `admin' or ''='`变成了 `admin\' or \'\'=\'`, 万能密码失效. 但是暴力破解的问题依旧.

3. Security Level [high]   
----

代码  

	// Check Anti-CSRF token
	checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

	// Sanitise username input
	$user = $_GET[ 'username' ];
	$user = stripslashes( $user );
	$user = mysql_real_escape_string( $user );

	// Sanitise password input
	$pass = $_GET[ 'password' ];
	$pass = stripslashes( $pass );
	$pass = mysql_real_escape_string( $pass );
	$pass = md5( $pass );

	// Check database
	$query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
	$result = mysql_query( $query ) or die( '<pre>' . mysql_error() . '</pre>' );

	if( $result && mysql_num_rows( $result ) == 1 ) {
		// Get users details
		$avatar = mysql_result( $result, 0, "avatar" );

		// Login successful
		$html .= "<p>Welcome to the password protected area {$user}</p>";
		$html .= "<img src=\"{$avatar}\" />";
	}
	else {
		// Login failed
		sleep( rand( 0, 3 ) );
		$html .= "<pre><br />Username and/or password incorrect.</pre>";
	}

	mysql_close();

相比middle 来说, 添加了 CSRF token, 使得部分工具攻击失效.前部分写的攻击代码在这已经失效.对于参数过滤来说, 增加了一个函数`stripslashes`,其它并没有什么大的变化, 然而, 对于暴力破解,并没有什么抵抗性, 同样的, 通过代码,还是能爆破.

4. Security Level [impossible]
----
从名字上看, 这个是不可能被入侵的.
代码就不贴了,代码量增了很多. 同样, 有CSRF token,   而sql语句使用了PDO 的预处理参数绑定, 可以说, sql注入已经被杜绝了.  

	// Check the database (if username matches the password) 
    $data = $db->prepare( 'SELECT * FROM users WHERE user = (:user) AND password = (:password) LIMIT 1;' ); 
    $data->bindParam( ':user', $user, PDO::PARAM_STR); 
    $data->bindParam( ':password', $pass, PDO::PARAM_STR ); 
    $data->execute(); 
    $row = $data->fetch();

登录失败后, 进行了处理

	// Login failed
	sleep( rand( 2, 4 ) );

	// Give the user some feedback
	$html .= "<pre><br />Username and/or password incorrect.<br /><br/>Alternative, the account has been locked because of too many failed logins.<br />If this is the case, <em>please try again in {$lockout_time} minutes</em>.</pre>";

	// Update bad login count
	$data = $db->prepare( 'UPDATE users SET failed_login = (failed_login + 1) WHERE user = (:user) LIMIT 1;' );
	$data->bindParam( ':user', $user, PDO::PARAM_STR );
	$data->execute();

登录失败的次数被记录了. 而在登录之前, 检测了登录失败次数

	// Check to see if the user has been locked out.
	if( ( $data->rowCount() == 1 ) && ( $row[ 'failed_login' ] >= $total_failed_login ) )  {
		// User locked out.  Note, using this method would allow for user enumeration!
		//$html .= "<pre><br />This account has been locked due to too many incorrect logins.</pre>";

		// Calculate when the user would be allowed to login again
		$last_login = $row[ 'last_login' ];
		$last_login = strtotime( $last_login );
		$timeout    = strtotime( "{$last_login} +{$lockout_time} minutes" );
		$timenow    = strtotime( "now" );

		// Check to see if enough time has passed, if it hasn't locked the account
		if( $timenow > $timeout )
			$account_locked = true;
	}

登录成功之后, 充值了失败次数.

	// Reset bad login count
	$data = $db->prepare( 'UPDATE users SET failed_login = "0" WHERE user = (:user) LIMIT 1;' );
	$data->bindParam( ':user', $user, PDO::PARAM_STR );
	$data->execute();

不得不说,挺安全.直接阻止用户比阻止ip更加有效!除非密码实在简单得不行, 一下就出来, 否则是爆破不出来的.