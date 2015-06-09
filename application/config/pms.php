<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['pms'] = array();

/**
 * 限制单个用户的同时在线设备数
 **/
$config['pms']['sub']['user_max_connections'] = 30;

/**
 * 当单个用户同时在线设备数超限时的处理方式
 * 1 -> 踢走最早登录的连接
 * 2 -> 禁止创建新连接
 **/
$config['pms']['sub']['user_over_connections_rule'] = 1;

/**
 * 当连接超过指定秒数没有发送心跳包后，服务器会主动断开该连接
 **/
$config['pms']['sub']['connection_timeout'] = 120;
