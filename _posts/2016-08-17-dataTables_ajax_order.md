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

4. 回调函数

	- fnDrawCallback	 绘制表格完成后调用
	- fnInitComplete 表格初始化时调用

5. 分页


	相关文档 [page.info()](https://datatables.net/reference/api/page.info()) [page()](https://datatables.net/reference/api/page())

	**相关属性**   
	-----------
	[paging](https://datatables.net/reference/option/paging) 是否显示翻页  
	[info](https://datatables.net/reference/option/info) 是否显示页数信息   
	[lengthChange](https://datatables.net/reference/option/lengthChange) 是否可以修改每页显示记录数  
	[lengthMenu](https://datatables.net/reference/option/lengthMenu) 设置每页记录数的大小  
	[pagingType](https://datatables.net/reference/option/pagingType) 分页显示的格式  
	- number 只显示数字按钮
	- simple 只显示上一页下一页
	- simple_numbers  上一页,下一页, 数字按钮
	- full 上一页, 下一页, 第一页最后一页
	- full_numbers上一页, 下一页, 第一页,最后一页,数字按钮


	**回调函数**
	-----------
	[infoCallback](https://datatables.net/reference/option/infoCallback) infoCallback( settings, start, end, max, total, pre ) 翻页信息回调



### 实例

1. html

		<table class="table table-border table-bordered table-hover table-bg table-sort">
            <thead>
            <tr class="text-c">
                <th width="25">
                    <input type="checkbox" name="" value="">
                </th>
                <th>手机号</th>
                <th>姓名</th>
                <th>用户名</th>
                <th>年龄</th>
                <th>注册时间</th>
                <th>登录次数</th>
                <th title="账户总额：等于待收本金+冻结金额+可用余额">账户总额</th>
                <th>可用金额</th>
                <th>直接推荐人</th>
                <th>跟进人</th>
                <th>最后一次跟进时间</th>
                <th title="客户标签：重点意向、充值问题、活动客户、持续跟进、无人接听、通话、停机、放弃">客户标签</th>
                <!--<th>跟进状态</th>-->
                <th>跟进分数</th>
                <th title="最近回款时间：最近即将回款日期">最近回款时间</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <notempty name="list">
                <volist name="list" id="vo">
                    <tr class="text-c">
                        <td><label><input type="checkbox" value="{$vo.id}" ></label></td>
                        <td>{$vo.mobile_number}</td>
                        <td>{$vo.realname}</td>
                        <td><span class="show-pop-win-btn" user-id="{$vo.id}" url="{:U('User/base_info',array('user_id'=>$vo['id']))}">{$vo.username}</span></td>
                        <td>{$vo.birthday|birthday_to_age}</td>
                        <td>{$vo.register_time|strtotime|date="Y-m-d",###}</td>

                        <td>{$vo.login_count}</td>

                        <td class="text-r">{$vo.sediment_assets|money_format_str}</td>
                        <td class="text-r">{$vo.balance|money_format_str}</td>

                        <td>{$vo.referer}</td>
                        <td>
                            <if condition="$vo.last_be_visited_time AND $vo.visitor_id NEQ $vo.inboxer">
                                <span class="c-orange" title="最近回访人：{$vo.visitor_id}">{$vo.inboxer}</span>
                            <else/>
                                <span>{$vo.inboxer}</span>
                            </if>
                        </td>

                        <td <notempty name="vo.last_be_visited_time">title="最近回访人：{$vo.visitor_id}"</notempty> >
                        <notempty name="vo.last_be_visited_time">
                            {$vo.last_be_visited_time}
                        </notempty>
                        </td>
                        <td>{$not_invest_visit_tag_list[$vo['client_tag']]}</td>

                        <td>{$vo.trail_score}</td>

                        <td title="{$vo.last_repay_time}">
                            <notempty name="vo.last_repay_time">
                                <span <if condition="strtotime($vo['last_repay_time']) LT time()">class="c-orange" title="已逾期"</if> >
                                {$vo.last_repay_time|strtotime|date="Y-m-d",###}
                                </span>
                            </notempty>
                        </td>

                        <td>
                            <empty name="vo.inboxer">
                                <button add-inbox-url="{:U('User/edi_data_track',array('id'=>$vo['id']))}" class="btn btn-primary size-MINI radius add-inbox-btn">分配</button>
                            <else/>
                                <button class="btn btn-default size-MINI radius">分配</button>
                            </empty>
                            <button show_visit-url="{:U('not_invest_trail_visit',array('user_id'=>$vo['id']))}" class="btn btn-primary size-MINI radius show-visit-btn">跟进</button>
                        </td>
                    </tr>
                </volist>
            <else/>
                <tr>
                    <td class="text-c" colspan="100%">没有符合条件的记录存在</td>
                </tr>
            </notempty>
            </tbody>
        </table>



2. javascript

		$('.table-sort').dataTable({
        "info"    : false,	// 不显示页数信息
		"aaSorting": [[ 11, "desc" ]],//默认第几个排序
        "aoColumnDefs": [            // 制定列不参与排序
            {"orderable":false,"aTargets":[0,1,2,3,4,5,6,7,8,9,10,12,13,14,15]}
        ],
        "searching": false, // 关闭搜索
        "paging" : true,	// 显示分页
        "lengthMenu" : [10,15,20,30,50,100,200,1000],
        "bStateSave": true,//状态保存
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
        ],
        "processing" : true,
        "serverSide" : true,

        "ajax" : function (data, callback, settings) {
            var request_url = '/user/not_invest_trail.json' + location.search;
            var param = {};
            param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length) + 1;//当前页码

            // 排序  DataTables_DataTables_Table_0_/user/not_invest_trail.html
            // aaSorting
            param.sort_column = settings.aaSorting[0][0];
            param.sort_type = settings.aaSorting[0][1];

            param.draw = settings.iDraw;

            console.log(settings);
            $.ajax({
                type: "POST",
                url: request_url,
                cache: false, //禁用缓存
                data: param, //传入组装的参数
                dataType: "json",
                success: function (result) {
                    setTimeout(function () {
                        var returnData = {};
                        returnData.draw = data.draw;
                        returnData.recordsTotal = result.total;
                        returnData.recordsFiltered = result.total;
                        returnData.data = result.data;
                        callback(returnData);
                    }, 200);
                }
            })
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
            {"data" : "last_repay_time","name":"last_repay_time",
                "render" : function (data, type, row) {
                    /*<notempty name="vo.last_repay_time">
                     <span <if condition="strtotime($vo['last_repay_time']) LT time()">class="c-orange" title="已逾期"</if> >
                     {$vo.last_repay_time|strtotime|date="Y-m-d",###}
                     </span>
                     </notempty>*/
                    if ( row.last_repay_time != '' ) {
                        // 时间比较
                        var d_str = row.last_repay_time.substr(0,10);
                        console.log(d_str);
                        var arr = d_str.split("-");
                        var starttime = new Date(arr[0], arr[1], arr[2]);
                        var starttimes = starttime.getTime();
                        var d = new Date();
                        var ds = d.getTime();
                        var result = '<span';
                        if ( starttimes > ds ) {
                            result += ' class="c-orange" title="已逾期"';
                        }
                        return result + '>' + d_str + '</span>';
                    }
                    return "";
                }
            },
            {"data" : "op",
                "render" : function (data,type,row) {
                    var result = '';
                    if (row.inboxer == '') {
                        result = '<button class="btn btn-default size-MINI radius">分配</button>';
                    } else {
                        result = '<button add-inbox-url="/user/edi_data_track/id/'+row.id+'" class="btn btn-primary size-MINI radius add-inbox-btn">分配</button>';
                    }
                    result += '<button show_visit-url="/user/not_invest_trail_visit/user_id/'+row.id+'"  class="btn btn-primary size-MINI radius show-visit-btn">跟进</button>';
                    return result;
                }
            }
        ],
        "fnDrawCallback" : function ( data ) {
            // 完成表格还要绑定事件
            $(".add-inbox-btn").on("click",function(){
                add_inbox_win(this);
            });

            //绑定
            $(".show-pop-win-btn").on("click",function(){
                show_pop_win(this);
            });

            //绑定
            $(".show-visit-btn").on("click",function(){
                show_visit_win(this);
            });
        },
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_条",
            "sZeroRecords": "没有找到符合条件的数据",
            "sProcessing": "<img src='/static/images/loading_072.gif'>",
            "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
            "sInfoEmpty": "木有记录",
            "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
            "sSearch": "搜索：",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            }
        }
        });

3. php

		if ( IS_AJAX ) {
            $map = array();
            $date_time = strtotime(date('Y-m-d'));       //指定根据日期为今天

            //条件查询
            $mobile = I('get.mobile', I('get.mobile_number', NULL));      //用户手机号
            if ($mobile) {
                $map['a.mobile_number'] = array('like', '%' . $mobile . '%');
            }

            $User = M('User');
     
            $Not_invest_visit = M('Not_invest_visit');
            $visit_table = $Not_invest_visit->order('create_time DESC')->buildSql();
            $visit_table = M()->table($visit_table)->alias('visit_table')->group('user_id')->buildSql();      
            $left_join_3 = $visit_table . ' d ON d.user_id = a.id';     

            $fields = 'a.id,a.username,a.email,a.mobile_number,a.sex,a.birthday,a.id_card,a.realname,a.register_time,a.score,a.status'; 
            $order = 'a.register_time DESC,d.create_time desc';

            // 查询满足要求的总记录数
            if ($map) {
                $count = $User
                ->alias('a')
                    ->field($fields)
                    ->join($left_join_3, 'LEFT')
                    ->where($map)
                    ->count();
            } else {
                $count = $User//->cache(true,$this->ctime,$this->ctype)
                ->where(array('register_time' => array('elt', date('Y-m-d H:i:s', $pre_date_time))))->count();
            }


            // ajax 分页
            $limit = '';
            if ( isset($_POST['start']) && isset($_POST['limit']) ) {
                $start = max(intval($_POST['start']), 0);
                $_limit = max(intval($_POST['limit']), 1);
                $limit = "$start,$_limit";
            } else {
            }

            // 排序
            if ( isset($_POST['sort_column']) && intval($_POST['sort_column']) > 0 ) {
                if ( $_POST['sort_column'] == '11' ) {  // 按时间排序
                    if ( in_array( $_POST['sort_type'], array('asc', 'desc') ) ) {
                        $map['d.create_time'] = array('exp','is not null');
                        $order = 'd.create_time ' . $_POST['sort_type'];
                    }
                }
            }

            $user_list = $User
            ->alias('a')
                ->field($fields)
                ->join($left_join_3, 'LEFT')
                ->where($map)
                ->order($order)
                ->limit($limit)
                ->select();

            foreach ( $user_list as &$u ) {
                // 生日
                $u['birthday'] = birthday_to_age($u['birthday']);
                // tag
                $u['client_tag'] = isset($not_invest_visit_tag_list[$u['client_tag']])?$not_invest_visit_tag_list[$u['client_tag']]:'';
                // 金额
                $u['sediment_assets'] = money_format_str($u['sediment_assets']);
                // 余额
                $u['balance'] = money_format_str($u['balance']);

            }
  
            $page   = max(intval($_POST['page']), 1);
            $pages  = intval(ceil($count / intval($_POST['limit']) ));
            $start  = intval($_POST['start']);
            $end    = intval($_POST['start']) + intval($_POST['limit']);
            $length = intval($_POST['limit']);
            echo json_encode(array(
                'draw'=> isset($_POST['draw'])?intval($_POST['draw']):1,
                'page'=> $page,
                'pages'=> $pages,
                'start'=> $start,
                'end'   => $end,
                'length'=> $length,
                'recoredsTotal'=>$count,
                'recordsFiltered'=>$count,
                'data'=>$user_list,
            ));

        } else {
            $this->display();
        }