---
layout: post
title: "thinkphp 操作另外的数据库"
data: 2016-08-22 11:09:11 
categories: php
tags: yumcms 
---

		set_time_limit(0);
        $path = 'F:\yiyuan\statics\uploads\photo\20160821';
        $objects = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path), \RecursiveIteratorIterator::SELF_FIRST);
        $files = array();
        foreach($objects as $name => $object){
            if ( $object->getFileName() == '.' || $object->getFileName() == '..'){
                continue;
            }
            $files[] = 'photo/20160821/' . $object->getFileName();
        }

        $count = count($files);
        $ids = range(2,7705);
        $User = M('member', 'go_', 'mysql://root:@localhost/y#utf8');
        foreach ( $ids as $id ) {
            $data = array(
                'uid'    => $id,
                'img'    => $files[$id % $count]
            );
            $User->save($data);
            echo $id, $data['img'],'<br>';
        }