/*
 * @Author: xx
 * @Date: 2024-03-18 22:37:44
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-03-30 16:36:36
 * @Description: 
 * @FilePath: \blog-node\src\api\routes\user\index.js
 */
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../../middlewares/authMiddleware');
const {UserController}  = require('../../controller/UserController')
// 查询所有用户
router.get('/getUserList',authenticateToken,UserController.getUserList );

/* 查用户数据 */
router.get('/getUserInfo', authenticateToken, UserController.getInfoById);

// 更新用户资料
router.post('/updateUserInfo', authenticateToken, UserController.updateUserInfo);

// 注册添加
router.post('/register', UserController.register);

// 登录接口
router.post('/login', UserController.login);

// 修改密码
router.post('/changePassword',authenticateToken, UserController.changePassword);

module.exports = router;