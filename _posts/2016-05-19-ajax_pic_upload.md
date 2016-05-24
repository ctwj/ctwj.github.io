---
layout: post
title: "ajax图片上传"
data: 2016-05-19 16:31:32
categories: php
tags: php
---

## ajax 图片上传 ##

ajax上传主要分为3部分, html表单, javascript提交, php处理

1. html代码部分
	{% highlight html %}
	<div class="row cl">
                    <label class="form-label col-2"><span class="c-red">*</span>活动图片：</label>
                    <div class="formControls col-5">
                        <div class="demo">
                            <input type="hidden" name="pic" value="{$data['pic']}">
                            <div id="showimg" style="margin-left: 70px">
                                <notempty  name="data['custom_picture']">
                                    <img src="{:C('STATIC_DOMAIN')}{$data['custom_picture']}">
                                </notempty>
                            </div>
                            <div class="btn">
                                <a data-toggle="modal" href="#myModal" class="btn btn-secondary radius"><i class="Hui-iconfont Hui-iconfont-add Hui-iconfont"></i>  活动图片 </a>
                                <input id="fileupload" type="file" name="mypic">
                            </div>
                            允许上传gif/jpg/png格式的图片，不能超过10M。
                        </div>
                    </div>
                </div>
	{% endhighlight %}

2. javascript部分
	{% highlight javascript %}
	<script>
	var bar = $('.bar');
    var percent = $('.percent');
    var showimg = $('#showimg');
    var progress = $(".progress");
    var files = $(".files");
    var btn = $(".btn span");
    $("#fileupload").wrap("<form id='myupload' action='{:U('activity/upload_image')}' method='post' enctype='multipart/form-data'></form>");
    $("#fileupload").change(function(){
        $("#myupload").ajaxSubmit({
            dataType:  'json',
            beforeSend: function() {
                showimg.empty();
                progress.show();
                var percentVal = '0%';
                bar.width(percentVal);
                percent.html(percentVal);
                btn.html("上传中...");
            },
            uploadProgress: function(event, position, total, percentComplete) {
                var percentVal = percentComplete + '%';
                bar.width(percentVal);
                percent.html(percentVal);
            },
            success: function(data) {
                files.html("<b>"+data.name+"("+data.size+"k)</b> <span class='delimg' rel='"+data.pic+"'>删除</span>");
                $("input[name='custom_picture']").val(data.file_path);
                var img = "{:C('STATIC_DOMAIN')}"+data.file_path;
                showimg.html("<img src='"+img+"'>");
                btn.html("活动图片");
            },
            error:function(xhr){
                btn.html("上传失败");
                bar.width('0')
                files.html(xhr.responseText);
            }
        });
    });
	</script>
	{% endhighlight %}

3. php 部分
	{% highlight php %}
	//上传活动图片
    public function upload_image(){
        $type = array( 'image/gif','image/jpg','image/jpeg','image/pjpeg','image/png' );
        $type_suffix = array('.gif','.jpg','.png');
        $action = I('get.act');
        $path   =  C('UPLOAD_PATH');
        if( $action == 'delimg' ){
            $filename = $_POST['imagename'];
            if( !empty($filename) ){
                unlink($path.$filename);
                exit('1');
            }else{
                exit('删除失败.');
            }
        } else {
            $picname = $_FILES['mypic']['name'];
            $picsize = $_FILES['mypic']['size'];
            if ( $picname != "" ) {
                if( $picsize > 1024000*100 ) {
                    exit(json_encode(array('file_path'=>'','info'=>'图片大小不能超过1M' ,'state'=>4762)));
                }
                $type = strstr($picname, '.');
                if (  !in_array( $type , $type_suffix ) ) {
                    exit(json_encode(array('file_path'=>'','info'=>'图片格式不对！' ,'state'=>4762)));
                }
                $d_name = date('Ymd');
                if ( !file_exists(C('UPLOAD_PATH').$d_name) ) {
                    mkdir(C('UPLOAD_PATH').$d_name,0777,true);
                }
                $f_name = round(00000,99999).time().rand(000000,999999).'.'.substr(strrchr($_FILES["mypic"]["name"], '.'), 1);
                if( !move_uploaded_file($_FILES["mypic"]["tmp_name"], C('UPLOAD_PATH').$d_name.'/'.$f_name)) {
                    exit(json_encode(array('file_path'=>'','info'=>'上传失败' ,'state'=>1860)));
                }
                exit(json_encode(
                    array(
                        'file_path' => '/upload/upload/'.$d_name.'/'.$f_name,
                        'info'      => '上传成功' ,
                        'state'     => 0,
                    )));
            }
        }
    }
	{% endhighlight %}