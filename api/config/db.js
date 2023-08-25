const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
mongoose.connect('mongodb://127.0.0.1:27017/demo')
var db = mongoose.connection;
// 连接成功
db.on('open', function(){
    console.log('--success');
});
// 连接失败
db.on('error', function(){
    console.log('--error');
});
 
 
// 共享
module.exports = mongoose;

