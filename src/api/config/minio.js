// 配置minio
const Minio = require('minio') //minio分布式储存

let minioClient = new Minio.Client({
    endPoint: '8.138.112.139', // 本机内网ip 注意：不要携带http或https
    port: 9000,    //端口号默认为9000 如果有多个端口号需在服务器查看对应的端口
    useSSL: false, // false代表不需要https
    accessKey: 'minioadmin',  // 账号
    secretKey: 'minioadmin' // 密码
  });

module.exports = minioClient;