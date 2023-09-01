const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
mongoose.connect('mongodb://8.139.5.190:27017/blog')
var db = mongoose.connection;
// 连接成功blog
db.on('open', function(){
    console.log('--success');
});
// 连接失败
db.on('error', function(){
    console.log('--error');
});
 
 
// 共享
module.exports = mongoose;

