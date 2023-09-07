var mongoose = require('../config/db');
var Schema = mongoose.Schema;
// 声明一个数据集 对象
var blogSchema = new Schema({
    title: {
        type: String,
    },
    label: {
        type: String
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
        type: Number
    },
    labelId: {
        type: Number
    },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    collects: { type: Number, default: 0 },
    collectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


const BlogModel = mongoose.model('blog', blogSchema, "Blogs")
// 将数据模型暴露出去
module.exports = BlogModel