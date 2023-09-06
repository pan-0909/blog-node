const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
    console.log(token);
  if (token) {
    jwt.verify(token, 'secret-key', (err, decoded) => {
      if (err) {
        return res.sendStatus(401); // 令牌无效
      }
      req.user = decoded; // 将用户信息存储在请求对象中
      next();
    });
  } else {
    res.sendStatus(401); // 缺少令牌
  }
}

module.exports = {
  authenticateToken,
};
