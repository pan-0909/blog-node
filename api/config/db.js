/*
 * @Author: xx
 * @Date: 2023-09-01 20:39:57
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-12-16 16:30:26
 * @Description: 
 * @FilePath: \nodejs\api\config\db.js
 */
const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
mongoose.connect('mongodb://localhost:27017/reactblog')
var db = mongoose.connection;
// 连接成功blog
db.on('open', function(){
    console.log('数据库连接成功');
});
// 连接失败
db.on('error', function(){
    console.log('数据库连接失败');
});
 
 
// 共享
module.exports = mongoose;

