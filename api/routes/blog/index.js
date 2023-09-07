const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../../middlewares/authMiddleware');
const {BlogController} = require('../../controller/BlogController')

// 查询所有blog
router.get('/getBlogList',BlogController.getBlogList);

/* 查某个blog */
router.get('/getBlogById/:id',BlogController.getBlogById );

/* 创建blog */
router.post('/createBlog',authenticateToken,BlogController.createBlog );

// 删除博客
router.delete('/deleteBlog/:id',authenticateToken,BlogController.deleteBlogById );

// 修改博客
router.put('/updateBlog/:id',authenticateToken,BlogController.updateBlogById)

// 根据用户id查找个人博客
router.get('/getBlogByUserId/:id',authenticateToken,BlogController.getBlogByUserId)

// 根据分类id查找博客
router.get('/getBlogByLabelId/:id',BlogController.getBlogByLabelId)

// 根据博客的title模糊查询
router.get('/getBlogByTitle',BlogController.getBlogByTitle)

// 点赞博客or取消
router.post('/lickBlog',authenticateToken,BlogController.lickBlog)

//收藏博客or取消
router.post('/collectBlog',authenticateToken,BlogController.collectBlog)

//查询用户收藏的博客
router.get('/getCollectBlogByUserId/:userId',authenticateToken,BlogController.getCollectBlogByUserId)
module.exports = router;