---
author: ww
comments: true
date: 2015-11-25 07:57:12+00:00
layout: post
link: http://www.gl6.cc/blog/ckeditor-%e6%ad%a5%e9%aa%a4widget.html
slug: ckeditor-%e6%ad%a5%e9%aa%a4widget
title: ckeditor 步骤Widget
wordpress_id: 301
categories:
- uncategorized
tags:
- ckeditor
---

## 步骤挂件


主要逻辑在plugin.js中

    
    CKEDITOR.plugins.add('ctwj_step', {
        requires: 'widget',
        icons: 'ctwj_step',
        init: function( editor ) {
    
            CKEDITOR.dialog.add( 'ctwj_step', this.path + 'dialogs/ctwj_step.js');
    
            editor.widgets.add( 'ctwj_step', {
    
                dialog: 'ctwj_step',
    
                button: '步骤',
    			
    			requiredContent: 'div(ctwj_step)',
    
                allowedContent:
                    'div(!ckww_step);span(!ckww_circle_span);h5 strong span p;',
    
                template:
                    '<div class="ctwj_step">'+
    				'<div class="ckww_step">'+
    				'	<h5><span class="ckww_circle_span"></span>step0. launch</h5>'+
    				'	<p>Cisdem DVDBurner è un’applicazione che consente di creare DVD in modo molto semplice, ad esempio aggiungendo i menu che consentono di richiamare le clip da pulsanti personalizzabili in vari modi</p>'+
    				'</div>'+
    				'</div>',
    
                editables:{
    
                    content: {
                        selector: '.ckww_step',
                        allowedContent: 'h2 p br span',
                    }
                },
    
                upcast: function ( element ) {
                    return element.name == 'div' && element.hasClass('ctwj_step');
                },
    
                // 初始化窗体
                init: function ( ) {
                    var child = this.element.find('.ckww_step').getItem(0);
                    //console.log(child.getHTML());
                    //this.setData('stepcontent', "请输入步骤具体内容\n回车表示标题结束\n空行表示步骤结束");
                },
    
                // 打开窗体之前读取数据
                data: function() {
    
                    // 窗体中，显示的value 初始化应该是不存在的，
                    var value = this.data.stepcontent;
    
                    // 查找步骤的第一步，看看存在不。
                    var child = this.element.find('.ckww_step').getItem(0);
    
                    // 如果查到了，第一步，而且 值不为空，那么现在是修改了步骤的内容
                    if ( child && value != undefined ){
                        var child = this.element.find('.chww_li');
                        var ul = child.getItem(0);
                        var list = value.split("\n");
                        var start = 1;
                        var str = html = '';
                        for( var i=0; i<list.length; i++ )
                        {
                            str = list[i].replace(/^\s+/g,"").replace(/\s+$/g,"");
                            alert(str);
                            str = str.replace(/<span>&nbsp;<\/span>/g,"");
                            alert(str);
                            if ( str == '') {
                                html += '</div>';
                                start = 1;
                            } else {
                                if ( start == 1 ) {
                                    html += '<div class="ckww_step"><h5><span class="ckww_circle_span">&nbsp;</span>'+list[i]+'</h5>';
                                    start = 0
                                } else {
                                    html += '<p>'+list[i]+'</p>';
                                }
                            }
                        }
                        // 最后需要判断是不是少个</div>
                        if ( html.substr(-4,3) != 'div') {
                            html += '</div>';
                        }
                        console.log(html);
                        this.element.setHtml(html);
                    } else if ( child && value==undefined ) {
                        data = '';
                        // 如果有child 没有value 则可能是打开编辑器时候的初始化
                        var steps = this.element.getChildren();
                        for ( var i=0; i<steps.count(); i++)
                        {
                            var step = steps.getItem(i);
                            console.log(step);
                            for ( var j=0; j<step.getChildCount(); j++ )
                            {
                                if ( j == 0 && i>0 ){
                                    data += "\n";
                                }
                                data += step.getChild(j).getHtml().replace(/<span>&nbsp;<\/span>/g,"") + "\n";
                            }
                        }
                        this.setData('stepcontent', data);
                    }
                }
            });
        }
    });


弹出窗口逻辑

    
    /**
     * Created by Administrator on 2015/11/10 0010.
     */
    CKEDITOR.dialog.add('ctwj_step', function(editor){
        return {
            title: '步骤设置',
            minWidth: 300,
            minHeight: 300,
            contents : [
                {
                    id: 'info',
                    elements: [
                        {
                            id: 'stepcontent',
                            type: 'textarea',
                            label: '内容',
                            width: '100%',
                            setup: function ( widget ) {
                                this.setValue( widget.data.stepcontent );
                            },
                            commit: function ( widget ) {
                                widget.setData( 'stepcontent', this.getValue() );
                            }
                        }
                    ]
                }
            ]
        }
    });


样式 css 的定义

    
    .ctwj_step {
        padding-left: 20px;
        border-left: dashed 2px #cccccc;
        margin-left: 16px;
    }
    .ckww_circle_span {
        width: 15px;
        height: 15px;
        display: inline-block;
        border-radius: 50%;
        background-color: #484848;
        position: relative;
        left: -28px;
    }
    .ckww_step p {
        padding-left: 20px;
    }


配置,需要添加css

    
    if (typeof CKEDITOR.config.contentsCss === 'string') {
            CKEDITOR.config.contentsCss = [CKEDITOR.config.contentsCss];
        }
        CKEDITOR.config.contentsCss.push(CKEDITOR.basePath + 'widget.css');
    config.extraPlugins ='ctwj_step';


由于样式是额外写在文件中的，需要在显示页面也添加css才能正常显示

[ctwj_step](http://www.gl6.cc/blog/ckeditor-%e6%ad%a5%e9%aa%a4widget.html/ctwj_step)

[![ckeditor_ctwj_step](http://www.gl6.cc/blog/wp-content/uploads/2015/11/ckeditor_ctwj_step.jpg)](http://www.gl6.cc/blog/wp-content/uploads/2015/11/ckeditor_ctwj_step.jpg)
