const express = require('express');
const router = express.Router();
const Blog = require('../../model/blog')
/* 查 */
// 查询所有blog
router.get('/', function (req, res, next) {
        Blog.find({}, function (req, data) {
                res.send(data)
        })
});

/* 查某个blog */
router.get('/:id', async function (req, res) {
        // _id要和数据库中的字段保持一致
        const _id = req.params.id;
        console.log(_id);
        try {
                const blog = await Blog.findById(_id);
                if (!blog) {
                        return res.status(404).json({ error: '没有这个博客' });
                }
                res.send(blog);
                return
        } catch (error) {
                return res.status(500).json({ error: '网络错误' });
        }
});

module.exports = router;