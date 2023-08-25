var mongoose = require('../config/db');
var Schema = mongoose.Schema;
// 声明一个数据集 对象
var blogSchema = new Schema({
    blogname: {
        type: String,
    },
    password:{
        type:String
    },
    email:{
        type:String
    }
});


const blogModel = mongoose.model('blog', blogSchema, "Blogs")
// 将数据模型暴露出去
module.exports = blogModel