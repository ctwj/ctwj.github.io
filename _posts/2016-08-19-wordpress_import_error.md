---
layout: post
title: "wordpress 导入错误 DOMDocument"
data: 2016-08-17 11:09:11 
categories: wordpress
tags: wordpress error
---

### wordpress导入错误

1. 错误
 
		Fatal error: Class 'DOMDocument' not found 

2. 错误代码
		
		// parsers.php 60 行左右

		$dom = new DOMDocument;
		$old_value = null;
		if ( function_exists( 'libxml_disable_entity_loader' ) ) {
		$old_value = libxml_disable_entity_loader( true );
		}
		$success = $dom->loadXML( file_get_contents( $file ) );
		if ( ! is_null( $old_value ) ) {
		libxml_disable_entity_loader( $old_value );
		}
		
		if ( ! $success || isset( $dom->doctype ) ) {
		return new WP_Error( 'SimpleXML_parse_error', __( 'There was an error when reading this WXR file', 'wordpress-importer' ), libxml_get_errors() );
		}
		
		$xml = simplexml_import_dom( $dom );
		unset( $dom );

3. 解决办法(**测试有效**)

	替换为

		$xml = simplexml_load_file($file);

4. 另外一个解决办法,安装扩展(**未测试**)

		//php53-common conflicts with php-common
		php-xml
		