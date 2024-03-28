const BlogModel = require('../../model/blog')
const { formatDate } = require('../../../utils/formatDate')
class BlogController {

    /******* 
     * @description: 查找全部博客
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @param {*} function
     * @param {*} data
     */
    static async getBlogList(req, res, next) {
        BlogModel.find({}, function (req, data) {
            // 计算每篇博客的评论数量并添加到结果中
            const blogListWithCommentNum = data.map(blog => {
                const commentNum = blog.commentList.length;
                return { ...blog.toObject(), commentNum };
            });
            res.send(blogListWithCommentNum)
        })
    }

    /******* 
     * @description: 查某个blog
     * @param {*} req
     * @param {*} res
     */
    static async getBlogById(req, res) {
        // _id要和数据库中的字段保持一致
        const _id = req.params._id;
        try {
            const blog = await BlogModel.findById(_id);
            if (!blog) {
                return res.status(404).json({ error: '没有这个博客' });
            }
            res.send(blog);
            return
        } catch (error) {
            return res.status(500).json({ error: '网络错误' });
        }
    }

    /******* 
     * @description: 创建博客
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async createBlog(req, res) {
        const userId = req.userId; // 获取存储在请求对象中的用户 ID
        const { title, label, content, author } = req.body;
        try {
            const createTime = formatDate(new Date())
            const newBlog = new BlogModel({ title, label, content, createTime, author, userId });
            const savedBlog = await newBlog.save();
            return res.status(200).json({ msg: "创建成功", savedBlog });
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }

    /******* 
     * @description: 删除博客
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async deleteBlogById(req, res) {
        const blogId = req.params.id;
        try {
            const deletedBlog = await BlogModel.findByIdAndDelete(blogId);
            if (!deletedBlog) {
                return res.status(404).json({ error: '博客不存在' });
            }
            return res.json({ msg: '博客已成功删除!' });
        } catch (error) {
            return res.status(500).json({ error: '删除博客时出错' });
        }
    }

    /******* 
     * @description: 根据id更新博客
     * @param {*} req
     * @param {*} res
     */
    static async updateBlogById(req, res) {
        const blogId = req.params.id;
        const updatedData = req.body;

        try {
            const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, updatedData, {
                new: true,
            });
            if (!updatedBlog) {
                return res.status(404).json({ error: '博客不存在' });
            }
            res.json({ msg: '博客已成功更新', blog: updatedBlog });
        } catch (error) {
            res.status(500).json({ error: '更新博客时出错' });
        }
    }

    /******* 
     * @description: 根据用户id查找个人博客
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async getBlogByUserId(req, res) {
        const userId = req.params.id;
        try {
            const userBlogs = await BlogModel.find({ userId: userId });
            return res.json(userBlogs);
        } catch (error) {
            return res.status(500).json({ error: '查找个人博客时出错' });
        }
    }

    /******* 根据分类id查找博客
     * @description: 
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async getBlogByLabelId(req, res) {
        const labelId = req.params.id;
        try {
            const blogs = await BlogModel.find({ labelId: labelId });
            return res.json(blogs);
        } catch (error) {
            return res.status(500).json({ error: '查找博客时出错' });
        }
    }

    /******* 
     * @description: 根据博客的title模糊查询
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async getBlogByTitle(req, res) {
        const title = req.query.title;
        try {
            const blogs = await BlogModel.find({ title: { $regex: title, $options: 'i' } });
            return res.json(blogs);
        } catch (error) {
            return res.status(500).json({ error: '查询博客时出错' });
        }
    }

    /******* 
     * @description: 博客的点赞和取消
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async lickBlog(req, res) {
        try {
            const blogId = req.body.blogId;
            const userId = req.userId;
            // 查询博客
            const blog = await BlogModel.findById(blogId);
            if (!blog) {
                return res.status(404).json({ msg: '博客不存在' });
            }

            // 检查当前用户是否已经点赞了该博客
            const hasLiked = blog.likedBy.includes(userId);
            if (hasLiked) {
                // 减少点赞数
                blog.likes--;
                blog.likedBy = blog.likedBy.filter((id) => { id !== userId });
                // 保存更新后的博客
                await blog.save();
                // 将当前用户添加到已点赞用户列表中
                return res.status(200).json({ msg: '取消点赞成功！', likes: blog.likes });
            } else {
                // 增加点赞数
                blog.likes++;
                // 将当前用户添加到已点赞用户列表中
                blog.likedBy.push(userId);
                // 保存更新后的博客
                await blog.save();
                return res.json({ msg: '点赞成功！', likes: blog.likes });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: '服务器错误' });
        }

    }

    /******* 
     * @description: 博客的收藏
     * @param {*} req
     * @return {*}
     */
    static async collectBlog(req, res) {
        try {
            const blogId = req.body.blogId;
            const userId = req.body.userId;
            // 查询博客
            const blog = await BlogModel.findById(blogId);
            if (!blog) {
                return res.status(404).json({ msg: '博客不存在' });
            }

            // 检查当前用户是否已经点赞了该博客
            const hasCollected = blog.collectedBy.includes(userId);
            if (hasCollected) {
                // 减少点赞数
                blog.collects--;
                blog.collectedBy = blog.collectedBy.filter((id) => { id !== userId });
                // 保存更新后的博客
                await blog.save();
                // 将当前用户添加到已点赞用户列表中
                return res.status(200).json({ msg: '取消收藏成功！', collects: blog.collects });
            } else {
                // 增加点赞数
                blog.collects++;
                // 将当前用户添加到已点赞用户列表中
                blog.collectedBy.push(userId);
                // 保存更新后的博客
                await blog.save();
                return res.json({ msg: '收藏成功', collects: blog.collects });
            }
        } catch (error) {
            return res.status(500).json({ msg: error });
        }

    }

    /******* 
     * @description: 查询用户收藏的博客
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async getCollectBlogByUserId(req, res) {
        const userId = req.params.userId
        try {
            const collectedBlogs = await BlogModel.find({ likedBy: userId });
            return res.status(200).json({ collectedBlogs });
        } catch (error) {
            return res.status(500).json({ msg: error });
        }
    }

    /******* 
     * @description: 根据博客id插入评论
     * @param {*} req
     * @param {*} res
     * @return {*} res
     */
    static async getcommentListByBlogId(req, res) {
        try {
            console.log(req.body);
            const blogId = req.body.blogId;
            const content = req.body.content;
            const userId = req.userId;
            const faceImg = req.body.faceImg;
            const username = req.body.username;
            const createTime = formatDate(new Date())
            const newComment = {
                content: content,
                userId: userId,
                username,
                faceImg,
                createTime
            }
            // 查询博客
            const blog = await BlogModel.findById(blogId);
            if (!blog) {
                return res.status(404).json({ msg: '博客不存在' });
            }

            // 将评论插入到博客的评论列表中newComment
            blog.commentList.push(newComment);

            await blog.save();
            // 将当前用户添加到已点赞用户列表中
            return res.status(200).json({ msg: '评论成功！' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: '服务器错误' });
        }
    }
}
module.exports = { BlogController }