  /*
  * @Author: panrunjun
  * @Date: 2024-03-18 22:37:44
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-03-29 22:54:47
  * @Description: 关于图片的接口
 * @FilePath: \blog-node\src\api\routes\upload\index.js
  */
  const express = require('express');
  const multer = require('multer');
  const fs = require('fs');
  const uploadApi = express();
  var minioClient = require("../../config/minio")
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
    // 获取文件的Buffer数据和文件名
    const fileBuffer = fs.readFileSync(file.path);
    const filename = Date.now() + '-' + file.originalname;
    // 设置文件的元数据，包括Content-Type
    const metaData = {
      'Content-Type': 'image/jpeg'
    };

    // 将文件上传到Minio服务器
    minioClient.putObject('blogimg', filename, fileBuffer, metaData, function (err, etag) {
      if (err) {
        console.error(err);
        return res.status(500).send('连接minio失败');
      }

      // 文件成功上传到Minio服务器
      console.log('文件上传成功！', filename);

      // 返回Minio服务器上文件的URL
      const fileUrl = `http://${minioClient.host}:${minioClient.port}/blogimg/${filename}`;
      // const fileUrl = minioClient.presignedGetObject('public', filename, 24 * 60 * 60); // URL有效期为24小时
      console.log(fileUrl, 777);
      return res.status(200).send(fileUrl);
    });
  });

  module.exports = uploadApi;