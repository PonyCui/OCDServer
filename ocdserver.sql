-- phpMyAdmin SQL Dump
-- version 4.0.5
-- http://www.phpmyadmin.net
--
-- 主机: 127.0.0.1
-- 生成日期: 2015 年 06 月 08 日 15:48
-- 服务器版本: 5.6.14
-- PHP 版本: 5.4.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `ocdserver`
--

-- --------------------------------------------------------

--
-- 表的结构 `ocd_pub`
--

CREATE TABLE IF NOT EXISTS `ocd_pub` (
  `pub_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sub_user_id` bigint(20) NOT NULL,
  `sub_service` varchar(32) NOT NULL,
  `sub_method` varchar(32) NOT NULL,
  `sub_params` text NOT NULL,
  PRIMARY KEY (`pub_id`),
  KEY `sub_user_id` (`sub_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ocd_token`
--

CREATE TABLE IF NOT EXISTS `ocd_token` (
  `user_id` bigint(20) unsigned NOT NULL,
  `session_token` varchar(128) NOT NULL,
  `session_access` varchar(128) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `ocd_token`
--

INSERT INTO `ocd_token` (`user_id`, `session_token`, `session_access`) VALUES
(1, 'testToken', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
