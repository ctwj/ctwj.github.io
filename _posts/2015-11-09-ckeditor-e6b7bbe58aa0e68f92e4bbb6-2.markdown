---
author: ww
comments: true
date: 2015-11-09 03:54:31+00:00
layout: post
link: http://www.gl6.cc/blog/ckeditor-%e6%b7%bb%e5%8a%a0%e6%8f%92%e4%bb%b6-2.html
slug: ckeditor-%e6%b7%bb%e5%8a%a0%e6%8f%92%e4%bb%b6-2
title: ckeditor 添加插件
wordpress_id: 243
categories:
- uncategorized
tags:
- ckeditor
- 插件
---



为了在编辑内容的时候更加方便，加入自己的样式会使得内容样式更加统一，ckeditor可以通过自定义模板的方法，和添加插件的方法来实现。

添加一个 ck_ww 的插件


## 1 插件文件组成


插件的主js文件，插件图片，插件的窗口文件，在ckeditor/plugins 目录下新建 ck_ww目录。所有文件将放置在这


## 2 插件的配置


在 config.js 中加入如下内容

    
    config.toolbar_Mine =
        [
            { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates'] },
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
            { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
            '/',
    
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            '/',
            { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'] },
            { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
            { name: 'extent', items: ['ck_ww'] },
            '/',
            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
            { name: 'colors', items: ['TextColor', 'BGColor'] },
            { name: 'tools', items: ['Maximize', 'ShowBlocks', '-', 'About'] }
        ];
    config.toolbar = 'Mine';
    config.extraPlugins += (config.extraPlugins ? ',ck_ww' : 'ck_ww');
    




## 3 pulugin.js 文件


在ck_ww 目录下添加plugin.js，文件定义了插件的基本情况，按钮图表，指明了插件的窗口，新建images目录添加16*16 的小图标ck_ww.png作为插件图片

    
    CKEDITOR.plugins.add( 'ck_ww', {
        requires:['dialog'],
        init: function ( editor ) {
            editor.addCommand( 'ck_ww', new CKEDITOR.dialogCommand( 'ck_ww' ) );
            editor.ui.addButton( 'ck_ww' ,{
                label: '自定义工具栏',
                command: 'ck_ww',
                icon: this.path + 'images/ck_ww.png'
            });
            CKEDITOR.dialog.add( 'ck_ww', this.path + 'dialogs/ck_ww.js' );
        }
    });
    




## 4 定义窗体


在ck_ww目录下新建dialogs目录，添加ck_ww.js文件
可以看到在 onOk 函数里面最终返回值将被写入到编辑器中光标的位置，主要处理过程在onOk函数，content为显示的表单

    
    CKEDITOR.dialog.add( 'ck_ww', function(editor){
        var _escape = function( value ){
            return value;
        };
        return {
            title: '自定义样式',
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
            minWidth: 300,
            minHeight: 80,
            contents: [{
                id: 'ck',
                name: 'ck',
                label: 'ck',
                title: 'ck',
                elements: [{
                    type : 'text',
                    label : '请选择样式',
                    id : 'val',
                    required : true
                },{
                    type : 'html',
                    html: '<span>hello</span>'
                }]
            }],
            onOk : function (){
                lang = this.getValueOf( 'ck', 'val' );
                editor.insertHtml("<p>"+ lang + "</p>");
            },
            onLoad: function (){
    
            }
        };
    } );
    


更多dialogs窗体的自定义，可以参考ckeditor自带的插件。

[![qqqqq](http://www.gl6.cc/blog/wp-content/uploads/2015/11/qqqqq.png)](http://www.gl6.cc/blog/wp-content/uploads/2015/11/qqqqq.png)


