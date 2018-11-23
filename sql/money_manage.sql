/*
SQLyog Trial v13.1.1 (64 bit)
MySQL - 8.0.12 : Database - money_manage
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`money_manage` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `money_manage`;

/*Table structure for table `t_cash_flow` */

DROP TABLE IF EXISTS `t_cash_flow`;

CREATE TABLE `t_cash_flow` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `money` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(10) NOT NULL COMMENT '1:收入；2支出',
  `event_type` int(10) NOT NULL COMMENT '与props表对应',
  `desc` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `type` (`type`),
  KEY `eventType` (`event_type`),
  KEY `createdBy` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `t_cash_total` */

DROP TABLE IF EXISTS `t_cash_total`;

CREATE TABLE `t_cash_total` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `money` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` bigint(20) NOT NULL DEFAULT '0' COMMENT '生成此条记录的事件类型',
  `desc` text COLLATE utf8mb4_unicode_ci,
  `extra` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eventType` (`event_type`),
  KEY `createdBy` (`created_by`),
  KEY `createdAt` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `t_props` */

DROP TABLE IF EXISTS `t_props`;

CREATE TABLE `t_props` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` bigint(20) NOT NULL,
  `pid` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci,
  `value1` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '字符串类型的值',
  `value2` bigint(100) DEFAULT NULL COMMENT '数字类型的值',
  `value3` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON类型的值',
  `is_delete` int(11) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `typeKey` (`type`),
  KEY `pidKey` (`pid`),
  KEY `createdBy` (`created_by`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `t_shop_plan` */

DROP TABLE IF EXISTS `t_shop_plan`;

CREATE TABLE `t_shop_plan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消费（物品）名称',
  `money` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(10) NOT NULL DEFAULT '0',
  `event_type` int(20) NOT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`created_by`),
  KEY `name` (`name`),
  KEY `status` (`status`),
  KEY `eventType` (`event_type`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `t_user` */

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `mail` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱',
  `type` int(20) NOT NULL DEFAULT '1' COMMENT '用户类型：0：超级管理员；1：管理员，默认为1',
  `is_enable` int(20) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_by` int(20) NOT NULL DEFAULT '0' COMMENT '0:注册；非0则为user_id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mobile` (`mobile`),
  KEY `name` (`name`),
  KEY `isEnable` (`is_enable`),
  KEY `mail` (`mail`),
  KEY `createdBy` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
