/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50721
Source Host           : localhost:3306
Source Database       : note_demo

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2021-11-29 17:15:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `note_list`
-- ----------------------------
DROP TABLE IF EXISTS `note_list`;
CREATE TABLE `note_list` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'noteId',
  `front_user_id` int(11) NOT NULL COMMENT '用户id',
  `title` varchar(50) NOT NULL COMMENT '标题',
  `note` text NOT NULL COMMENT '内容',
  `create_time` varchar(30) NOT NULL COMMENT '创建日期',
  `update_time` varchar(30) DEFAULT NULL COMMENT '更新日期',
  `state` int(11) DEFAULT NULL COMMENT '1:草稿，2:待审核，3:审核通过，4:审核不通过，5:已删除',
  PRIMARY KEY (`note_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of note_list
-- ----------------------------
INSERT INTO `note_list` VALUES ('7', '1', '123', '123', '2021-06-23 17:52:57', '2021-06-23 17:52:57', '1');
INSERT INTO `note_list` VALUES ('8', '1', 'dgfh', '345', '2021-06-23 17:53:18', '2021-06-23 17:53:27', '1');
INSERT INTO `note_list` VALUES ('9', '1', '111', 'sd sdfg ', '2021-06-23 18:10:23', '2021-11-29 17:14:57', '1');
