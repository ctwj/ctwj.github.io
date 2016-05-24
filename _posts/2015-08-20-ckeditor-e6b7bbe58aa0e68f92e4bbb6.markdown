---
author: ww
comments: true
date: 2015-08-20 03:17:06+00:00
layout: post
link: http://www.gl6.cc/blog/ckeditor-%e6%b7%bb%e5%8a%a0%e6%8f%92%e4%bb%b6.html
slug: ckeditor-%e6%b7%bb%e5%8a%a0%e6%8f%92%e4%bb%b6
title: ckeditor 添加插件
wordpress_id: 119
categories:
- uncategorized
tags:
- ckeditor
- 插件
---

在ckeditor中可以看到config.js 和 plugins 目录 这两个地方是需要修改的

1. 在plugins 目录中添加 自己的目录 autosave 所有插件相关文件都在这个目录里面，autosave 也是插件的名字

2. 在autosave中创建 plugins.js 添加自己的一个按钮图片autosave.png到这个目录

3. 在plugins.js中写入内容


    
    
    CKEDITOR.plugins.add('autosave',
        {
            requires : ['dialog'],   
            init : function (editor)
            {
                var pluginName = 'autosave';
    
                var command = {
                    exec:function(editor){
                        // 点击按钮后执行到这个地方
                        alert('这是自定义按钮')
                    }
                }
    
                /*
                // 如果点击按钮需要弹出窗体，需要新建一个dialogs目录，并将窗体写到这个目录下
                //加载自定义窗口
                CKEDITOR.dialog.add('myDialog',this.path + "/dialogs/mydialog.js");
    
                //给自定义插件注册一个调用命令
                editor.addCommand( pluginName, new CKEDITOR.dialogCommand( 'myDialog' ) );
                */
    
                // 注册按钮事件，点击按钮将执行command
                editor.addCommand( pluginName, command );
    
                //注册一个按钮，来调用自定义插件
                editor.ui.addButton('Recover',
                    {
                        //editor.lang.mine是我在zh-cn.js中定义的一个中文项，
                        //这里可以直接写英文字符，不过要想显示中文就得修改zh-cn.js
                        label : '点击恢复备份',
                        icon:this.path + 'autosave.png',
                        command : pluginName
                    });
            }
        }
    );
    



3. 写好插件后需要配置 config.js

    
    
    CKEDITOR.editorConfig = function(config) {
        // Define changes to default configuration here. For example:
        config.language = 'zh-cn';
        config.uiColor = '#AADC6E';
        config.width = 700;
        config.height = 350;
        config.extraPlugins = 'autosave';
        config.toolbar=
            [
                ['unlink','-','Save','unlink','Preview','-','Templates'],
                ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print','SpellChecker','Scayt'],
                ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
                ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
                ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
                ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
                ['Link','Unlink','Anchor'],
                ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
                ['Styles','Format','Font','FontSize'],
                ['TextColor','BGColor'],
                ['Maximize','ShowBlocks','-','About','-','Recover']
            ];
    };
    



4. 再次查看 可以发现编辑器多了一个按钮，点击后弹出一个alert框
