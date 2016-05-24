---
author: ww
comments: true
date: 2016-03-08 00:09:00+00:00
layout: post
link: http://www.gl6.cc/blog/delphi-%e5%8c%bf%e5%90%8d%e7%ba%bf%e7%a8%8b.html
slug: delphi-%e5%8c%bf%e5%90%8d%e7%ba%bf%e7%a8%8b
title: '[delphi] 匿名线程'
wordpress_id: 512
categories:
- Delphi
- uncategorized
tags:
- delphi
- 线程
---



    
    TThread.CreateAnonymousThread(
      procedure()
      begin
        TThread.Synchronize(TThread.CurrentThread,
                              procedure()
                              begin
                                mmo1.Lines.Add('Thread start!');
                              end);
        for  iIndex := 0 to 65535 do
        begin
          try
             // do somthing useful
          except
    
          end;
        end;
        TThread.Synchronize(TThread.CurrentThread,
                              procedure()
                              begin
                                mmo1.Lines.Add('Thread finish!');
                              end);
      end
      ).Start;



