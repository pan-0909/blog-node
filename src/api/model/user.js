var mongoose = require('../config/db');
var Schema = mongoose.Schema;
// 声明一个数据集 对象
var userSchema = new Schema({
    username: {
        type: String,
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    createTime:{
        type:Date
    },
    github:{
        type:String,
        default:''
    },
    label:{
        type:Array,
        default:[],
    },
    faceImg:{
        type:String,
        default:''
    }

});


/******* 
 * @description:  *'user' 是模型名称，用于在代码中引用该模型。
    userSchema 是定义模型结构的模式对象。
    "demo" 是与模型关联的集合名称。数据库中
 */
const UserModel = mongoose.model('user', userSchema, "Users")
// 将数据模型暴露出去
module.exports = UserModel