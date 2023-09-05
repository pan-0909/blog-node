const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser'); // 解析 req.body
const uploadApi = express();
const upload = multer();
// 配置minio
const Minio = require('minio') //minio分布式储存
let minioClient = new Minio.Client({
    endPoint: '8.139.5.190', // 本机内网ip 注意：不要携带http或https
    port: 9090,    //端口号默认为9000 如果有多个端口号需在服务器查看对应的端口
    useSSL: false, // false代表不需要https
    accessKey: '7bLfqXOM65GJOVAJvPXd',  // 账号
    secretKey: 'mh30iwf9vRALBqNTVlk9D3IWtP7Lc7RPAoxAxJFM' // 密码
});

bucketExists = minioClient.bucketExists("images");
console.log(bucketExists);
//   console.log(minioClient);
uploadApi.use(bodyParser.json());
uploadApi.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const file = req.file; // 获取上传文件
      console.log(file);
      const bucketName = 'public'; //自己创建的桶名
      const objectName = Date.now() + '_' + file.originalname; // 设置对象名称
      const data = await minioClient.putObject(bucketName, objectName, file.buffer); // 上传到MinIO
      res.send({
        code: 200,
        url: `http://8.139.5.190:9090/${bucketName}/${objectName}`, // 返回访问URL
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = uploadApi;