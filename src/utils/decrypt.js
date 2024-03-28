/*
 * @Author: xx
 * @Date: 2024-03-18 22:37:44
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-03-28 19:22:05
 * @Description: 
 * @FilePath: \blog-node\src\utils\decrypt.js
 */
const jwt = require('jsonwebtoken');
const { key } = require('./key')
// 用你的密钥解码 token
const secretKey = key;
function decrypt(token) {
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Token 解析失败:', err);
        } else {
            // console.log('Token 解析成功:', decoded);
        }
    });
}

module.exports = {decrypt}
