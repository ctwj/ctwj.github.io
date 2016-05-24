---
author: ww
comments: true
date: 2015-12-10 09:06:53+00:00
layout: post
link: http://www.gl6.cc/blog/jquery%e6%8f%92%e4%bb%b6-jquery-steps-%e5%88%b6%e4%bd%9c%e8%87%aa%e5%8a%a8%e5%ae%89%e8%a3%85%e8%84%9a%e6%9c%ac.html
slug: jquery%e6%8f%92%e4%bb%b6-jquery-steps-%e5%88%b6%e4%bd%9c%e8%87%aa%e5%8a%a8%e5%ae%89%e8%a3%85%e8%84%9a%e6%9c%ac
title: jQuery插件 jquery-steps 制作自动安装脚本
wordpress_id: 353
categories:
- PHP
tags:
- jquery
---

## 适合用来做安装脚本的jsquery插件


文档 ： https://github.com/rstaib/jquery-steps/wiki/Settings#events

[caption id="attachment_354" align="alignnone" width="716"][![jquery_steps](http://www.gl6.cc/blog/wp-content/uploads/2015/12/install.png)](http://www.gl6.cc/blog/wp-content/uploads/2015/12/install.png) jquery_steps[/caption]

 

    
    <?php
    header("Content-type:text/html;charset=utf-8");
    
    $url = 'http://' .$_SERVER['HTTP_HOST'] . str_replace('_install/install.php', '', $_SERVER['PHP_SELF']);
    
    
    // 系统安装验证
    if ( file_exists('../config.php') ) {
    	die('系统已安装！');
    }
    
    // 数据库ajax验证
    if ( isset($_POST['ajax']) )
    {
    	$act =  isset($_POST['act'])?$_POST['act']: '';
    
    
    	if ( $act == 'dbcheck'  ) 
    	{
    		$db = getDb($_POST['host'],$_POST['user'],$_POST['pass']);
    
    		if ( is_string($db) ) {
    
    			$data = array('status'=>400, 'info'=>$db);
    		} else {
    
    			// 切换数据库，如果没有就创建数据库
    			$need_create = 0;
    			$res = $db->exec('use '. $_POST['name']);
    			if ( $res === false ) {
    				$need_create = 1;
    			}
    			$data = array('status'=>200,'need_create'=>$need_create);
    		}
    	}
    
    	// 默认
    	else {
    		$data = array('status'=>400, 'info'=>'need act');
    	}
    	die(json_encode($data));
    }
    
    // 系统安装
    if ( isset($_POST['start']) ) 
    {
    	$db = getDb($_POST['host'],$_POST['user'],$_POST['pass']);
    	$db->query('set names utf8');
    	// 系统安装
    
    	// step 1. 测试目录可写 写入配置文件
    	if ( testWritable() )
    	{
    		if ( !wirteConfig() )
    		{
    			die(json_encode(array('status'=>400, 'info'=>'写入配置文件失败')));
    		}
    	} else {
    		die(json_encode(array('status'=>400, 'info'=>'配置文件目录不可写')));
    	}
    
    
    	// step 2. 连接数据库,选取数据库
    	try{
    		$dbname = $_POST['name'];
    		$res = $db->exec("use $dbname");
    		if ( $res === false ) {
    			$sql = 'CREATE DATABASE ' . $dbname . ' CHARSET utf8;';
    			$res = $db->exec($sql);
    			if ( false === $res ) {
    				die(json_encode(array('status'=>400, 'info'=>'创建数据库失败')));
    			}
    			$db->exec("use $dbname");
    		}
    	} catch (\Exception $e){
    		die(json_encode(array('status'=>400, 'info'=>'异常错误:' . $e->getMessage)));
    	}
    
    	// setp 3. 写入数据库
    	$result = writeDatabase($db);
    	if ( $result ===  true ) {
    		echo json_encode(array('status'=>200, 'info'=>'OK'));
    	} else {
    		echo json_encode(array('status'=>400, 'info'=>$result));
    	}
    	
    	die();
    }
    
    
    //UPDATE oc_module SET  code=REPLACE(code,'http://xsser.me','http://localhost/xss')
    ?>
    <html lang="zh-CN">
    <head>
    	<title>安装脚本</title>
    	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    	<link rel="stylesheet" href="simple.css">
    	<style type="text/css">
    		.container {
    			width: 60%;
    			height: 200px;
    			margin: auto auto;
    		}
    		.dbconfig label {
    			display: block;
    			width: 80%;
    			height: 32px;
    			font-weight: 700;
    			padding: 10px;
    			margin: 15px 15px;
    		}
    		.dbconfig label > input {
    			padding: 10px;
    			width: 100%;
    			height: 36px;
    			margin: 4px 4px;
    			margin-left: 20px;
    		}
    	</style>
    </head>
    <body>
    	<div style="text-align: center;"><h1>安装脚本</h1></div>
    	<form class="dbconfig" action="" method="post">
    	<div class="container">
    		<div id="example-basic">
    		    <h3>数据库配置</h3>
    		    <section>
    		        
    		        	<label for="host">数据库地址：<input id="host" name="dbhost" type="text" value="<?php echo isset($_POST['dbhost'])?$_POST['dbhost']:'localhost' ?>"></label>
    		        	<label for="name">数据库库名：<input id="name" name="dbname" type="text" value="<?php echo isset($_POST['dbname'])?$_POST['dbname']:'ctwj_xss' ?>"></label>
    		        	<label for="user">数据库用户：<input id="user" name="dbuser" type="text" value="<?php echo isset($_POST['dbuser'])?$_POST['dbuser']:'root' ?>"></label>
    		        	<label for="pwd">数据库密码：<input id="pwd" name="dbpwd" type="text" value="<?php echo isset($_POST['dbpwd'])?$_POST['dbpwd']:'root' ?>"></label>
    		    </section>
    		    <h3>参数配置</h3>
    		    <section>
    		    		<label for="host">站点网址：<input id="host" name="siteurl" type="text" value="<?php echo isset($_POST['siteurl'])?$_POST['siteurl']:$url; ?>"></label>
    		        	<label for="host">站点名字：<input id="host" name="sitename" type="text" value="<?php echo isset($_POST['sitename'])?$_POST['sitename']:'此题无解XSS实验室' ?>"></label>
    		        	<label for="name">站点描述：<input id="name" name="sitedesc" type="text" value="<?php echo isset($_POST['sitedesc'])?$_POST['sitedesc']:'一个简单的XSS平台' ?>"></label>
    		        	<label for="user">站点关系字：<input id="user" name="siteword" type="text" value="<?php echo isset($_POST['siteword'])?$_POST['siteword']:'XSS,跨站脚本攻击,Cross Site Scripting,XSS平台' ?>"></label>
    		        	<label for="pwd">管理员邮箱：<input id="pwd" name="managemail" type="text" value="<?php echo isset($_POST['dbpwd'])?$_POST['dbpwd']:'admin@gl6.cc' ?>"></label>
    		    </section>
    		</div>
    	</div>
    	</form>
    	<script type="text/javascript" src="jQuery-2.1.4.min.js"></script>
    	<script type="text/javascript" src="jquery.steps.min.js"></script>
    	<script type="text/javascript">
    	$.ajaxSetup({async:false});
    	$("#example-basic").steps({
    	    headerTag: "h3",
    	    bodyTag: "section",
    	    transitionEffect: "slideLeft",
    	    autoFocus: true,
    	    onStepChanging: 
    	    	// onStepChanging 在切换step之前触发
    	    	function (event, currentIndex, newIndex) 
    	    	{ 
    	    		var result = false;
    	    		// 当newIndex为1时，从第0切换到第1
    	    		if ( newIndex == 1 ) {
    	    			$.ajax({
    		    			type: "POST",
    		    			data: {
    		    				ajax: 1,
    		    				act: 'dbcheck',
    		    				host: document.forms[0].dbhost.value,
    		    				name: document.forms[0].dbname.value,
    		    				user: document.forms[0].dbuser.value,
    		    				pass: document.forms[0].dbpwd.value,
    		    			},
    		    			dataType: 'json',
    		    			success: function (data){
    
    		    				if ( data.status == 400 ) {
    		    					alert('数据库配置错误:'+data.info);
    		    				} else {
    		    					if ( data.need_create == 1 ) {
    		    						result = confirm('数据库不存在，自动创建选确定，选择取消重填');
    		    					} else {
    		    						result =  true;
    		    					}
    		    				}
    		    			}
    		    		})
    	    		} else {
    	    			result = true
    	    		}
    	    		return result;
    	    	},
    	    onFinished: 
    	    	// onFinished 点击Finish触发
    		    function (event, currentIndex) 
    		    { 
        			$.ajax({
    	    			type: "POST",
    	    			data: {
    	    				start: '1',
    	    				host: document.forms[0].dbhost.value,
    	    				name: document.forms[0].dbname.value,
    	    				user: document.forms[0].dbuser.value,
    	    				pass: document.forms[0].dbpwd.value,
    	    				sitename: document.forms[0].sitename.value,
    	    				siteword: document.forms[0].siteword.value,
    	    				sitedesc: document.forms[0].sitedesc.value,
    	    				mail: document.forms[0].managemail.value,
    	    				siteurl: document.forms[0].siteurl.value
    	    			},
    	    			dataType: 'json',
    	    			success: function (data){
    
    	    				if ( data.status == 200 ) {
    	    					window.location.href = '../index.php';
    	    				} else {
    	    					alert(data.info);
    	    				}
    	    			}
    	    		})
    		    }
    
    	});
    	</script>
    </body>
    </html>
    
    <?php
    
    function getDb($host, $user, $pass)
    {
    	try{
            //return new \PDO("mysql:host=". $host . ";dbname=" . $name, $user, $pass);
            return new \PDO("mysql:host=". $host . ";", $user, $pass);
        } catch ( \Exception $e ) {
            return $e->getMessage();
        }
    }
    
    function testWritable()
    {
    	$dir = realpath(__DIR__ . DIRECTORY_SEPARATOR . '..');
    	return is_writeable($dir);
    }
    
    function writeDatabase($pdo)
    {
    	$fp = @fopen('xss.sql',"r") or die("sql文件打不开");//打开文件
    	while($SQL = GetNextSQL($fp)){
    		
    		if(!$pdo->query($SQL)){
    			fclose($fp);
    			return $SQL;
    		}
    	}
    
    	fclose($fp);//关闭文件
    	return true;
    }
    
    //从文件中逐条取sql
    function GetNextSQL($fp){
    	$sql="";
    	while($line = @fgets($fp,40960)){
    		$line = trim($line);
    		$line = str_replace("////", "//", $line);
    		$line = str_replace("//r//n","chr(13).chr(10)",$line);
    		$line = stripcslashes($line);
    		if(strlen($line)>1){
    			if($line[0]=='-' && $line[1]=="-"){
    					continue;
    				}
    		}
    		$sql .= $line.chr(13).chr(10);
    		if(strlen($line)>0){
    			if($line[strlen($line)-1]==";")
    			{
    				break;
    			}
    		}
    	}
    	return $sql;
    }
    
    function wirteConfig()
    {
    	$content = file_get_contents('config.php');
    	$need_replace = array(
    		'RDBHOSTR',
    		'RDBUSERR',
    		'RDBPWDR',
    		'RDBNAMER',
    		'RSITENAMER',
    		'RSITEWORDR',
    		'RDESCRIPTR',
    		'RMAILR',
    		'RSITEURLR'
    		);
    	$replace = array(
    		$_POST['host'],
    		$_POST['user'],
    		$_POST['pass'],
    		$_POST['name'],
    		$_POST['sitename'],
    		$_POST['siteword'],
    		$_POST['sitedesc'],
    		$_POST['mail'],
    		$_POST['siteurl']
    		);
    	$content = str_replace($need_replace, $replace, $content);
    	return file_put_contents('../config.php', $content);
    }
    
    
    
    



用jquery_steps 制作的xss.me源码的自动安装脚本

[xss一键安装版 密码此题无解](http://www.gl6.cc/blog/wp-content/uploads/2015/12/xss一键安装版-密码此题无解.rar)
