---
author: admin
comments: true
date: 2015-11-13 07:49:58+00:00
layout: post
link: http://www.gl6.cc/blog/qrcode-php%e7%94%9f%e6%88%90%e5%b8%a6logo%e4%ba%8c%e7%bb%b4%e7%a0%81.html
slug: qrcode-php%e7%94%9f%e6%88%90%e5%b8%a6logo%e4%ba%8c%e7%bb%b4%e7%a0%81
title: php生成带logo二维码
wordpress_id: 266
categories:
- PHP
tags:
- 二维码
---

## php生成带logo二维码


具体代码如下， 其中还是利用qrcode，然后再画logo。



	
  * 在下面代码中，二维码内容和logo路径都是经过base64加密后传过来的。

	
  * 注释的代码是做了一个小缓存。感觉没必要又注释掉了。

	
  * `QRcode::png`的第二个参数如果是一个路径就把二维码图片保存到路径，否则直接显示二维码。

	
  * imagecreatefrompng 函数直接接受一个路径，并创建一个图片流。如果图片是jpg的话，需要对应调用imagecreatefromjpeg函数，所以需要判断下logo的类型再调用。



    
    <?php
    
    define('IN_ECS', true);
    
    $value = base64_decode($_GET['value']);
    $logo = base64_decode($_GET['logo']);
    $goods_id = $_GET['id'];
    
    include_once( __DIR__ . "/includes/cls_qrcode.php");
    if($value){
        // 二维码
        // 纠错级别：L、M、Q、H
        $errorCorrectionLevel = 'L';
        // 点的大小：1到10
        $matrixPointSize = 4;
    
        $temp = 'data/qrcode/temp_' . $goods_id . '.png';
        $target = 'data/qrcode/goods_' . $goods_id . '.png';
    
        /*
        if ( file_exists( $target ) ) {
    
        } else {
            if ( file_exists($temp) ) {
    
            } else {
                QRcode::png($value, $temp, $errorCorrectionLevel, $matrixPointSize, 2);
            }
    
            //$temp_stream = file_get_contents($temp);
            $QR     = imagecreatefrompng( $temp );
    
            $ext = pathinfo($logo, PATHINFO_EXTENSION);
            if ( $ext == 'jpg' ) {
                $logo   = imagecreatefromjpeg( $logo );
            } elseif ( $ext == 'png' ) {
                $logo   = imagecreatefrompng( $logo );
            }
    
            $QR_width       = imagesx( $QR );
            $QR_height      = imagesy( $QR );
            $logo_width     = imagesx( $logo );
            $logo_height    = imagesy( $logo );
    
            $logo_qr_width  = $QR_width / 5;
            $scale          = $logo_width / $logo_qr_width;
            $logo_qr_height = $logo_height / $scale;
            $from_width     = ($QR_width - $logo_qr_width) / 2;
    
            imagecopyresampled( $QR, $logo, $from_width, $from_width, 0, 0, $logo_qr_width,
                $logo_qr_height, $logo_width, $logo_height);
    
            imagepng( $QR , $target );
        }
    
    
        //显示图片
        header('Content-type: image/png');
        echo file_get_contents($target);
        */
    
        QRcode::png($value, $temp, $errorCorrectionLevel, $matrixPointSize, 2);
    
        $QR     = imagecreatefrompng( $temp );
    
        $ext = pathinfo($logo, PATHINFO_EXTENSION);
        if ( $ext == 'jpg' ) {
            $logo   = imagecreatefromjpeg( $logo );
        } elseif ( $ext == 'png' ) {
            $logo   = imagecreatefrompng( $logo );
        }
    
    
    
        $QR_width       = imagesx( $QR );
        $QR_height      = imagesy( $QR );
        $logo_width     = imagesx( $logo );
        $logo_height    = imagesy( $logo );
    
        $logo_qr_width  = $QR_width / 5;
        $scale          = $logo_width / $logo_qr_width;
        $logo_qr_height = $logo_height / $scale;
        $from_width     = ($QR_width - $logo_qr_width) / 2;
    
        imagecopyresampled( $QR, $logo, $from_width, $from_width, 0, 0, $logo_qr_width,
            $logo_qr_height, $logo_width, $logo_height);
    
        header('Content-type: image/png');
        imagepng( $QR );
    }


直接访问 file.php?value=XXX&logo=XXX就能看到包含logo的二维码了。

php生成带logo二维码
