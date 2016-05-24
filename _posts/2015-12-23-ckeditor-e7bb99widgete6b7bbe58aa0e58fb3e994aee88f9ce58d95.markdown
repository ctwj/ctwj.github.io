---
author: ww
comments: true
date: 2015-12-23 08:08:57+00:00
layout: post
link: http://www.gl6.cc/blog/ckeditor-%e7%bb%99widget%e6%b7%bb%e5%8a%a0%e5%8f%b3%e9%94%ae%e8%8f%9c%e5%8d%95.html
slug: ckeditor-%e7%bb%99widget%e6%b7%bb%e5%8a%a0%e5%8f%b3%e9%94%ae%e8%8f%9c%e5%8d%95
title: ckeditor 给widget添加右键菜单
wordpress_id: 380
categories:
- uncategorized
tags:
- ckeditor
---

主要分为几个步骤， 1, 添加功能，一个command， 2， 注册菜单

现在在编辑器里面回车，都是自动添加一个段落，现在做一个添加br的示例。

1. 添加command
 

    
    editor.addCommand( 'insertBr', {
                exec: function( editor ) {
                    editor.insertHtml('<br />');
                }
            } );



2. 添加菜单

  

    
    if(editor.addMenuItems)
            {
                editor.addMenuItems(  //have to add menu item first
                    {
                        insertBr:  //name of the menu item
                        {
                            label: '换行',
                            command: 'insertBr',
                            group: 'insertBr',  //have to be added in config
                            order : 22
                        }
                    });
            }



3. 添加监听事件，可以控制在什么时候应该显示菜单

 

    
    if(editor.contextMenu)
            {
                editor.contextMenu.addListener(function(element, selection)  //function to be run when context menu is displayed
                {
                    //if(! element || !element.is('strong'))
                        //return null;
                    return { insertBr: CKEDITOR.TRISTATE_OFF };
                });
            }



4. 最后将菜单写入配置文件，否则菜单不会显示

 

    
    config.menu_groups += ',insertBr';



5. 添加结束，可以使用了
[![addmenu](http://www.gl6.cc/blog/wp-content/uploads/2015/12/addmenu.jpg)](http://www.gl6.cc/blog/wp-content/uploads/2015/12/addmenu.jpg)
示例代码：
[ctwj_strong](http://www.gl6.cc/blog/wp-content/uploads/2015/12/ctwj_strong.zip)


