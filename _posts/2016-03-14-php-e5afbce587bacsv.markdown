---
author: ww
comments: true
date: 2016-03-14 08:37:42+00:00
layout: post
link: http://www.gl6.cc/blog/php-%e5%af%bc%e5%87%bacsv.html
slug: php-%e5%af%bc%e5%87%bacsv
title: '[php] 导出csv'
wordpress_id: 536
categories:
- PHP
---



    
    <?php
    
    $data['data'] = array(
    	array('first'=>345,'second'=>123),
    	array('first'=>'sdf','second'=>'sdfdfd'),
    );
    exportCsv($data);
    function exportCsv( $data ){
    	$csv_string = null;
    	$csv_row    = array();
    	$csv_head   = array();
    	foreach( $data['data'] as $key => $csv_item ) {
    		if( $key === 0 ) {
    			foreach( $csv_item AS $k=>$item ) {
    				$current[] = is_numeric( $item ) ? "\"".$item."\t\"" : '"' . str_replace( '"', '""', $item ) . '"';
    			}
    			$csv_row[] = implode( "\t" , $current );
    			continue;
    		}
    		$current = array();
    		foreach( $csv_item AS $k=>$item ) {
    			if( $key == 1 ) {
    				$csv_head[] = is_numeric( $k ) ? $k : '"' . str_replace( '"', '""', $k ) . '"'; //标题
    			}
    			$current[] = is_numeric( $item ) ? "\"".$item."\"" : '"' . str_replace( '"', '""', $item ) . '"';
    		}
    		$csv_row[] = implode( "\t" , $current );
    	}
    	array_unshift($csv_row,implode( "\t" , $csv_head ));
    	$csv_string = implode( "\r\n", $csv_row );
    	header("Content-type:text/csv");
    	header("Content-Type: application/force-download");
    	header("Content-Disposition: attachment; filename=".date('YmdHis').".csv");
    	header('Expires:0');
    	header('Pragma:public');
    	echo "\xFF\xFE".mb_convert_encoding( $csv_string, 'UCS-2LE', 'UTF-8' );
    	break;
    }
    				
    ?>



