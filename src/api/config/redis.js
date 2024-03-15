const { promisify } = require('util');
const Redis = require('ioredis');

function connectRedis() {
    const client = new Redis({
        host: '8.138.112.139',
        port: 6379,
        password: '123456'
      });
      
    return new Promise((resolve, reject) => {
        client.on('connect', () => {
            console.log('Redis连接成功');
            resolve(client);
        });

        client.on('error', (err) => {
            console.error('Redis连接失败:', err);
            reject(err);
        });
    });
}

async function setAsync(client, key, value) {
    const setAsync = promisify(client.set).bind(client);

    try {
        const result = await setAsync(key, value);
        console.log('键值对设置成功');
        return result;
    } catch (error) {
        console.error('设置键值对出错:', error);
        throw error;
    }
}

async function getAsync(client, key) {
    const getAsync = promisify(client.get).bind(client);

    try {
        const result = await getAsync(key);
        console.log('获取到的值为:', result);
        return result;
    } catch (error) {
        console.error('获取值出错:', error);
        throw error;
    }
}

module.exports = {
    connectRedis,
    setAsync,
    getAsync
};
