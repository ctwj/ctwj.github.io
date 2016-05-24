---
layout: post
title: "jekyll config highlight"
data: 2016-05-19 16:31:32
categories: uncategorized
tags: jekyll
---


# pygments语法高亮 #

1. 运行命令生成css文件  
	`$ pygmentize -S default -f html > your/path/pygments.css`

2. 将css文件拷贝到css目录中
3. 找到_include文件夹中head.html文件, 将css加入到文件中  
	`<link rel="stylesheet" href="{{ "/css/pygments.css" | prepend: site.baseurl }}">`
4. _config.yml 文件中加入配置  

```
highlighter: pygments  
markdown: redcarpet  
redcarpet:  
extensions: ["fenced_code_blocks", "tables", "highlight", "strikethrough"]
```

###　markdown中加入代码方式　###
	
- 使用  `{`% highlight php %`}{`% endhighlight %`}`包裹代码

{% highlight php %}
<?php
var good
echo 'p';
foreach($a as $b)
{
	echo $a;
}
{% endhighlight %}

- 使用```的方式,可以高亮c语言代码,但是php代码无效

```c
/* hello world demo */
#include <stdio.h>
int main(int argc, char **argv)
{
printf("Hello, World!\n");
return 0;
}
```


### 上传图片的图床 ### 

[Two.Yt](http://two.yt/)  支持拖拽,速度快

![image](http://two.yt/images/2016/05/17/vMA.jpg)

[imageeab](http://imageab.com/)   支持成人内容

![image](http://p2.imageab.com/2016/05/17/s/6c3960ff95121885baa8ccb80d75dcc7969304c0.jpg)

[photobucket](https://secure.photobucket.com/register?returnUrl=http%3A%2F%2Fphotobucket.com%2Fupload%3Fpostregister%3Dtrue) 文件名不修改,但是网页速度慢


