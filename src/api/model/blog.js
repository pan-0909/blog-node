/*
 * @Author: xx
 * @Date: 2024-03-18 22:37:44
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-03-28 19:04:45
 * @Description: 
 * @FilePath: \blog-node\src\api\model\blog.js
 */
var mongoose = require('../config/db');
var Schema = mongoose.Schema;
// 声明一个数据集 对象
var blogSchema = new Schema({
    title: {
        type: String,
    },
    label: {
        type: Array
    },
    content: {
        type: String
    },
    createTime: {
        type: String
    },
    author: {
        type: String
    },
    userId: {
        type: String
    },
    commentNum:Number,
    commentList:Array,
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    


    collects: { type: Number, default: 0 },
    collectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


const BlogModel = mongoose.model('blog', blogSchema, "Blogs")
// 将数据模型暴露出去
module.exports = BlogModel