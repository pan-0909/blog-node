const jwt = require('jsonwebtoken');
const { key } = require('./key')
// 用你的密钥解码 token
const secretKey = key;
function decrypt(token) {
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Token 解析失败:', err);
        } else {
            console.log('Token 解析成功:', decoded);
        }
    });
}

module.exports = {decrypt}
