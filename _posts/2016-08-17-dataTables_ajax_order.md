---
layout: post
title: "dataTables ajax 排序"
data: 2016-08-17 11:09:11 
categories: javascript
tags: javascript datatables
---

## dataTable

Datatables是一款jquery表格插件。它是一个高度灵活的工具，可以将任何HTML表格添加高级的交互功能。  

[Datatables中文网](http://datatables.club/)  

### 常规配置

[文档](http://datatables.club/reference/option/)

**searching**  
boolean值,是否搜索  
**paging**  
boolean值,是否分页  
**aaSorting**  
为一个或多个列编制定义。

	{
        "aaSorting": [[ 6, "desc" ]],//默认第几个排序
        "aoColumnDefs": [            // 制定列不参与排序
            {"orderable":false,"aTargets":[0,1,2,3,4,5,9,10,12,13,14,15]}
        ],
        "searching": false, // 关闭搜索
        "paging" : false,   // 关闭翻页
        "bStateSave": true,//状态保存
	}



### 多列排序

[文档](https://datatables.net/examples/basic_init/multi_col_sort.html)  

**columnDefs属性**  
为一个或多个列编制定义。
  
**targets选项**   
可以指定多个目标列

**columns.orderData选项**   
可以指定多个目标列, 比如targets为1时,此时,按照第二列,排序再按照第一列排序

	{
        "aaSorting": [[ 1, "desc" ]],//默认第几个排序
        "aoColumnDefs": [            // 制定列不参与排序
            {"orderable":false,"aTargets":[0,1,2,3,4,5,9,10,12,13,14,15]}
        ],
        "columnDefs" : [
            {
                "targets" : [6], //登录次数
                "orderData":[6,7]
            },
            {
                "targets" : [7], // 账户总额
                "orderData":[7,8]
            },
            {
                "targets" : [8], // 可用金额
                "orderData":[8,7]
            }
            ,
            {
                "targets" : [11], // 最后一次跟进时间
                "orderData":[11]
            }
        ]
    });

**columns**  
和 `columnDefs`属性类似

**columns.data**

**columns.name**

**columns.render**  
渲染,这个属性, 对返回的数据进行二次处理,按照需要的格式显示 .

render 为一个函数有****3****个参数
  
-	data 需要显示的内容
-	type 类型,display为显示
-	row 整个行的数据, 需要其他配合可从这个对象里面拿


		"columns":[
            {"data" : "id","name":"id",
                "render":function(data,type,row){
                    return '<label><input type="checkbox" value="'+data+'" ></label>';
                }
            },
            {"data" : "mobile_number","name":"mobile_number"},
            {"data" : "realname","name":"realname"},
            {"data" : "username","name":"username"},
            {"data" : "birthday","name":"birthday"},
            {"data" : "register_time","name":"register_time"},
            {"data" : "login_count","name":"login_count"},
            {"data" : "sediment_assets","name":"sediment_assets"},
            {"data" : "balance","name":"balance"},
            {"data" : "referer","name":"referer"},
            {"data" : "inboxer","name":"inboxer"},
            {"data" : "last_be_visited_time","name":"last_be_visited_time"},
            {"data" : "client_tag","name":"client_tag"},
            {"data" : "trail_score","name":"trail_score"},
            {"data" : "last_repay_time","name":"last_repay_time"},
            {"data" : "op"}
        ]



### 服务器处理


[文档](http://datatables.club/manual/server-side.html)  
[ajax列子1](https://datatables.net/examples/server_side/custom_vars.html)

1. 先来个配置

		var request_url = '/user/not_invest_trail.json' + location.search;
		// 上面这句带上额外的查询参数

		"ajax"       : {
            "url" : request_url,
            "type": "POSt",
            "dataSrc" : 'data'
        },
        "columns":[
            {"data" : "id","name":"id",
                "render":function(data,type,row){
                    return '<label><input type="checkbox" value="'+data+'" ></label>';
                }
            },
            {"data" : "mobile_number","name":"mobile_number"},
            {"data" : "realname","name":"realname"},
            {"data" : "username","name":"username",
                "render" : function (data,type,row) {
                   return  '<span class="show-pop-win-btn" user-id="'+row.id+'" url="/user/base_info/user_id/'+row.id+'">'+data+'</span>';
                }
            },
            {"data" : "trail_score","name":"trail_score"},
            {"data" : "op",
                "render" : function (data,type,row) {
                    var result = '';
                    if (row.inboxer == '') {
                        result = '<button add-inbox-url="/user/edi_data_track/id/'+row.id+'" class="btn btn-primary size-MINI radius add-inbox-btn">分配</button>';
                    } else {
                        result = '<button class="btn btn-default size-MINI radius">分配</button>';
                    }
                    result += '<button show_visit-url="/user/not_invest_trail_visit/user_id'+row.id+'"  class="btn btn-primary size-MINI radius show-visit-btn">跟进</button>';
                    return result;
                }
            }
        ]


2. Ajax配置

	[文档](http://datatables.club/reference/option/ajax.html)  
	[手册](https://datatables.net/manual/ajax)

	- **ajax.url**   要提交的地址
	- **ajax.type**   提交的类型, 用POST提交, 否则url会很长
	- **dataSrc**   和返回数据有关  
		如果 dataSrc 设置为 `data1` 那么服务器端的数据部分应该这样返回  

			$data = $result_array;
			die(json_encode(array('data1'=>$result_array)));


	除了数据,还有其他一些属性,用户返回数据

	- draw 必要。上面提到了，Datatables发送的draw是多少那么服务器就返回多少。 这里注意，作者出于安全的考虑，强烈要求把这个转换为整形，即数字后再返回，而不是纯粹的接受然后返回，这是 为了防止跨站脚本（XSS）攻击。
	- recordsTotal 必要。即没有过滤的记录数（数据库里总共记录数）
	- recordsFiltered 必要。过滤后的记录数（如果有接收到前台的过滤条件，则返回的是过滤后的记录数）
	- error 可选。你可以定义一个错误来描述服务器出了问题后的友好提示
	
			$data = $result_array;
			die(json_encode(array(
				'draw' => 1,
				'recoredsTotal'=>100,
				'recordsFiltered'=>20,
				'data1'=>$result_array
			)));

3. ajax 配置进阶

	除了上面的配置, ajax还支持函数

		"ajax" : function (data, callback, settings) {
            //封装请求参数
            var param = {};
            param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length) + 1;//当前页码
            //ajax请求数据
            $.ajax({
                type: "POST",
                url: request_url,
                cache: false, //禁用缓存
                data: param, //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                    //setTimeout仅为测试延迟效果
                    setTimeout(function () {
                        //封装返回数据
                        var returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.total;//返回数据全部记录
                        returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data;//返回的数据列表
                        //console.log(returnData);
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                    }, 200);
                }
            })
        },