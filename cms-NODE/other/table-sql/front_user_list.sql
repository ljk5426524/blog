/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50721
Source Host           : localhost:3306
Source Database       : note_demo

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2021-11-29 16:20:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `front_user_list`
-- ----------------------------
DROP TABLE IF EXISTS `front_user_list`;
CREATE TABLE `front_user_list` (
  `front_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `nick_name` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '用户昵称',
  `age` int(11) DEFAULT NULL,
  `sex` int(11) NOT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `update_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`front_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of front_user_list
-- ----------------------------
INSERT INTO `front_user_list` VALUES ('1', 'No.1哦哦哦', '18', '1', '2021-11-29 00:00:00', '1', '2021-11-29 15:44:04');
INSERT INTO `front_user_list` VALUES ('2', 'No.2啊啊啊', '20', '2', '2021-11-29 14:05:55', '1', '2021-11-29 15:40:45');
INSERT INTO `front_user_list` VALUES ('3', 'No.3噗噗噗', '20', '1', '2021-11-29 15:06:01', '1', '2021-11-29 15:55:45');
