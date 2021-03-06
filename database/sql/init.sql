## table user

create table user(
	id int auto_increment primary key comment '主键id',
	username varchar(100) not null comment '用户名',
	password varchar(100) not null comment '密码',
	name varchar(100) not null comment '姓名',
	mobile varchar(100) not null comment '联系电话',
	superadmin tinyint(1) default 0,
	dept int not null comment '部门',
	gmt_create datetime comment '注册时间',
);

create table apply(
	id int auto_increment primary key comment '主键id',
	user_id int not null comment '申请人',
	pid int not null comment '直接领导',
	state int not null comment '状态,0:未审批，1：领导已审批，2：安全已审批，3：全部通过,-1:领导拒绝，-2:安全拒绝，-3:最后拒绝',
	auth varchar(100) not null comment '权限:如网络权限、机器权限、代码权限、日志权限',
	auth_detail varchar(100) not null comment '具体权限:如stark代码权限',
	content varchar(200) not null comment '申请内容',
	gmt_apply datetime comment '申请时间',
	gmt_pid datetime comment '领导审批时间',
	gmt_safe datetime comment '安全审批时间',
	gmt_end datetime comment '结束时间'
)

## table department

create table department(
	id int auto_increment primary key comment '主键id',
	name varchar(100) not null comment '部门名称'
)


## table apply_type
create table apply_type(
	id int auto_increment primary key comment '主键id',
	name varchar(100) not null comment '名称',
	type int not null comment '类型；0：申请类型，1：申请对象，2：申请内容',
	pid int not null
)


## table role

create table role(
	id int auto_increment primary key comment '主键id',
	code varchar(100) not null comment '角色code',
	name varchar(100) not null comment '角色名称'
)



## view   view_user

create view view_user as
    select
        t1.*,t2.name role_name,t3.name department_name
    from
        user t1
    left join
        role t2
        on t1.role = t2.code
    left join
        department t3
        on t1.department_id = t3.id;



## view_apply
SELECT
    t1.*,
    t2.name auth_name,
    t3.name auth_detail_name,
    t4.name user_name,
    t5.name pname,
    t6.name safe_name,
    t7.name op_name,
    t8.id department_id,
    t8.name department_name
FROM
    apply t1
        LEFT JOIN
    apply_type t2 ON t1.auth = t2.id
        LEFT JOIN
    apply_type t3 ON t1.auth_detail = t3.id
        LEFT JOIN
    user t4 ON t1.user_id = t4.id
        LEFT JOIN
    user t5 ON t1.pid = t5.id
        LEFT JOIN
    user t6 ON t1.sid = t6.id
        LEFT JOIN
    user t7 ON t1.oid = t7.id
        LEFT JOIN
    department t8 ON t4.department_id = t8.id
