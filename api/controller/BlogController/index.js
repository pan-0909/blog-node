const BlogModel = require('../../model/blog')
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
            res.send(data)
        })
    }

    /******* 
     * @description: 查某个blog
     * @param {*} req
     * @param {*} res
     */
    static async getBlogById(req, res) {
        // _id要和数据库中的字段保持一致
        const _id = req.params.id;
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
        const { title, label, content, createTime, author } = req.body;
        try {
            // 创建新用户
            const newBlog = new BlogModel({ title, label, content, createTime, author });
            console.log(newBlog);
            const savedBlog = await newBlog.save();
            return res.status(200).json({ message: "创建成功", savedBlog });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
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
            return res.json({ message: '博客已成功删除!' });
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
            res.json({ message: '博客已成功更新', blog: updatedBlog });
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
        console.log(labelId);
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
        console.log(title);
        try {
            const blogs = await BlogModel.find({ title: { $regex: title, $options: 'i' } });
            return res.json(blogs);
        } catch (error) {
            return res.status(500).json({ error: '查询博客时出错' });
        }
    }

    static async lickBlog(req, res) {
        try {
            const blogId = req.body.BlogId;
            const userId = req.body.userId; 

            // 查询博客
            const blog = await Blog.findById(blogId);

            if (!blog) {
                return res.status(404).json({ message: '博客不存在' });
            }

            // 检查当前用户是否已经点赞了该博客
            const hasLiked = blog.likedBy.includes(userId);

            if (hasLiked) {
                return res.status(400).json({ message: '你已经点赞了该博客' });
            }

            // 增加点赞数
            blog.likes++;

            // 将当前用户添加到已点赞用户列表中
            blog.likedBy.push(userId);

            // 保存更新后的博客
            await blog.save();

            return res.json({ message: '点赞成功', likes: blog.likes });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '服务器错误' });
        }

    }

}
module.exports = { BlogController }