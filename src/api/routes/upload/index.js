const express = require('express');
const multer = require('multer');
const fs = require('fs');
const uploadApi = express();
// 配置minio
const Minio = require('minio') //minio分布式储存
let minioClient = new Minio.Client({
  endPoint: '8.139.5.190', // 本机内网ip 注意：不要携带http或https
  port: 9000,    //端口号默认为9000 如果有多个端口号需在服务器查看对应的端口
  useSSL: false, // false代表不需要https
  accessKey: '7bLfqXOM65GJOVAJvPXd',  // 账号
  secretKey: 'mh30iwf9vRALBqNTVlk9D3IWtP7Lc7RPAoxAxJFM' // 密码
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定文件上传的目录
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    // 指定文件的保存名称
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
uploadApi.post('/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  console.log(file);
  // 获取文件的Buffer数据和文件名
  const fileBuffer = fs.readFileSync(file.path);
  const filename = Date.now() + '-' + file.originalname;
  // 设置文件的元数据，包括Content-Type
  const metaData = {
    'Content-Type': 'image/jpeg'
  };

  // 将文件上传到Minio服务器
  minioClient.putObject('public', filename, fileBuffer, metaData, function (err, etag) {
    if (err) {
      console.error(err);
      return res.status(500).send('连接minio失败');
    }

    // 文件成功上传到Minio服务器
    console.log('文件上传成功！', filename);

    // 返回Minio服务器上文件的URL
    const fileUrl = `http://${minioClient.host}:${minioClient.port}/public/${filename}`;
    // const fileUrl = minioClient.presignedGetObject('public', filename, 24 * 60 * 60); // URL有效期为24小时
    console.log(fileUrl, 777);
    return res.status(200).send(fileUrl);
  });
});

module.exports = uploadApi;