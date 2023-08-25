var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res, next) {
  res.send({
    status:0, //0 表示处理成功，1 表示处理失败
    msg:'GETHome请求成功', //状态的描述
  })
});

module.exports = router;
