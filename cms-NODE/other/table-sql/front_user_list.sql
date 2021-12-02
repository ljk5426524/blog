/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : localhost:3306
 Source Schema         : note_demo

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 02/12/2021 16:15:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for front_user_list
-- ----------------------------
DROP TABLE IF EXISTS `front_user_list`;
CREATE TABLE `front_user_list`  (
  `front_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '用户昵称',
  `age` int(11) NULL DEFAULT NULL,
  `sex` int(11) NOT NULL,
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `state` int(11) NULL DEFAULT NULL,
  `update_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '登录名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` int(11) NULL DEFAULT NULL COMMENT '类型：1 管理员 2 普通用户',
  PRIMARY KEY (`front_user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of front_user_list
-- ----------------------------
INSERT INTO `front_user_list` VALUES (1, 'No.1哦哦哦', 18, 1, '2021-11-29 00:00:00', 1, '2021-11-29 15:44:04', 'admin1', '21232f297a57a5a743894a0e4a801fc3', 1);
INSERT INTO `front_user_list` VALUES (2, 'No.2啊啊啊', 20, 2, '2021-11-29 14:05:55', 1, '2021-11-29 15:40:45', 'admin2', '21232f297a57a5a743894a0e4a801fc3', 1);
INSERT INTO `front_user_list` VALUES (3, 'No.3噗噗噗', 20, 1, '2021-11-29 15:06:01', 1, '2021-12-01 15:51:21', 'admin3', '21232f297a57a5a743894a0e4a801fc3', NULL);

SET FOREIGN_KEY_CHECKS = 1;
