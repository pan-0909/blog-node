const crypto = require('crypto');

// 生成一个包含指定长度的随机字符串
function generateRandomString(length:string) {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('hex');
  }

export default generateRandomString