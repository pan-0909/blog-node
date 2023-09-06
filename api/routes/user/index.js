const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../../middlewares/authMiddleware');
const {UserController}  = require('../../controller/UserController')
// 查询所有用户
router.get('/getUserList',authenticateToken,UserController.getUserList );

/* 查用户数据 */
router.get('/getUserInfo/:id', authenticateToken, UserController.getInfoById);

// 更新用户资料
router.put('/updateUserInfo', authenticateToken, UserController.updateUserInfo);

// 注册添加
router.post('/register', UserController.register);

// 登录接口
router.post('/login', UserController.login);



module.exports = router;