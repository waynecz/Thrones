## table user

create table user(
	id int auto_increment primary key comment '主键id',
	username varchar(100) not null comment '用户名',
	password varchar(100) not null comment '密码',
	name varchar(100) not null comment '姓名',
	mobile varchar(100) not null comment '联系电话',
	dept int not null comment '部门',
	gmt_create datetime comment '注册时间',
	pid int comment '直接领导'
);

create table apply(
	id int auto_increment primary key comment '主键id',
	user_id int not null comment '申请人',
	pid int not null comment '直接领导',
	state int not null comment '状态,0:未审批，1：领导已审批，2：安全已审批，3：全部通过,-1:领导拒绝，-2:安全拒绝，-3:最后拒绝',
	auth varchar(100) not null comment '权限:如网络权限、机器权限、代码权限、日志权限',
	auth_detail varchar(100) not null comment '具体权限:如stark代码权限',
	reason varchar(200) not null comment '申请理由', 
	remarks varchar(200) not null comment '备注',
	pid_reason varchar(200) comment '领导理由',
	safe_reason varchar(200) comment '安全部门理由',
	final_reason varchar(200) comment '最后的理由',
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

## table code

create table code(
	id int auto_increment primary key comment '主键id',
	name varchar(100) not null comment '代码库名称'
)

## table role

create table role(
	id int auto_increment primary key comment '主键id',
	code varchar(100) not null comment '角色code',
	name varchar(100) not null comment '角色名称'
)

create table user_role(
	id int auto_increment primary key comment '主键id',
	user_id int not null comment '用户id',
	role_id int not null comment '角色id'
)
