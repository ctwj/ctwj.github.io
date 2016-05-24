---
author: ww
comments: true
date: 2016-01-26 11:31:53+00:00
layout: post
link: http://www.gl6.cc/blog/delphi-delphi-%e8%a7%a3%e6%9e%90-json%e6%95%b0%e6%8d%ae.html
slug: delphi-delphi-%e8%a7%a3%e6%9e%90-json%e6%95%b0%e6%8d%ae
title: '[delphi] Delphi 解析 JSON数据'
wordpress_id: 455
categories:
- Delphi
- uncategorized
tags:
- delphi
- json
---

json 数据
`{"status":"Success", "resultsMethod":"database", "lastScrape":"2016-01-26 05:45:37", "domainCount":"346", "remoteAddress":"123.214.172.16", "remoteIpAddress":"123.214.172.16", "domainArray":[["01067333147.com", ""], ["0hwa.net", ""], ["15443824.com", ""], ["15wealth-club.com", ""], ["15wealth-club.net", ""], ["ywamkaratu.org", ""], ["zerodiv.cafe24.com", ""]]}`



引用单元:DBXJSON

    
    procedure TForm1.GetResult(data: String);
    var
      json : TJSONObject;
      domains,domain : TJSONValue;
      size : Integer;
      status : String;
      I: Integer;
    begin
    
      // 由字符串创建TJOSNObject对象
      json := TJSONObject.ParseJSONValue(TEncoding.ASCII.GetBytes(data), 0) as TJSONObject;
      try
        // 获取json中的字符串
        status := json.Get('status').JsonValue.Value;
        if status = 'Success' then
        begin
            // 获取　数组　domainArray 以及　数组大小
           domains := json.Get('domainArray').JsonValue;
           size := TJSONArray(domains).Size;
    
           // 遍历　domains
           for domain in TJSONArray(TJSONPair(TJSONArray(domains))) do
            begin
              //　domins　每一个元素都是一个数组，取数组的第一个数据
              ShowMessage(TJSONObject(domain).Get(0).ToString);
              ShowMessage(domain.ToString);
    
            end;
        end else
        begin
          ShowMessage(json.Get('message').JsonValue.Value);
        end;
        ShowMessage(status);
    
    
      finally
         json.Free;
      end;
    
    end;
