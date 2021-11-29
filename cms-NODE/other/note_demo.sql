/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 50640
 Source Host           : localhost:3306
 Source Schema         : note_demo

 Target Server Type    : MySQL
 Target Server Version : 50640
 File Encoding         : 65001

 Date: 27/05/2021 10:38:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for note_list
-- ----------------------------
DROP TABLE IF EXISTS `note_list`;
CREATE TABLE `note_list` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'noteId',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `title` varchar(50) NOT NULL COMMENT '标题',
  `note` text NOT NULL COMMENT '内容',
  `create_time` varchar(30) NOT NULL COMMENT '创建日期',
  `update_time` varchar(30) DEFAULT NULL COMMENT '更新日期',
  PRIMARY KEY (`note_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_list
-- ----------------------------
DROP TABLE IF EXISTS `user_list`;
CREATE TABLE `user_list` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(20) NOT NULL COMMENT '用户名',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `create_time` varchar(30) NOT NULL COMMENT '注册日期',
  `update_time` varchar(30) DEFAULT NULL COMMENT '更新日期',
  `is_ban` int(1) DEFAULT '0' COMMENT '是否被禁用',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
