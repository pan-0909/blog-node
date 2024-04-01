const UserModel = require('../../model/user')
const jwt = require('jsonwebtoken');
const { formatDate } = require('../../../utils/formatDate.js');
const { connectRedis, setAsync, getAsync } = require('../../config/redis.js');
const { key } = require('../../../utils/key.js')
const { decrypt } = require('../../../utils/decrypt.js')
/**
 * 将令牌存储到 Redis 中
 * @param userId 用户ID，作为 Redis 中存储令牌的键
 * @param token  需要存储的 JWT 令牌
 * 该函数不返回任何内容
 */

class UserController {

    /******* 
     * @description: 更新用户资料
     * @param {*} req
     * @param {*} res
     */
    static async updateUserInfo(req, res) {
        console.log(req.body);
        try {
            const newUsername = req.body.username;
            const newGithub = req.body.github;
            const newEmail = req.body.email;
            const newLabel = req.body.label;
            const newIntroduction = req.body.introduction;
            const newFaceImg = req.body.faceImg;
            const userId = req.userId;
            console.log(userId);
            const user = await UserModel.findOneAndUpdate(
                { _id: userId },
                {
                    username: newUsername,
                    github: newGithub,
                    email: newEmail,
                    label: newLabel,
                    introduction: newIntroduction,
                    faceImg: newFaceImg
                },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ error: '用户不存在！' });
            }
            return res.status(200).json({ msg: "修改成功！", data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    /******* 
     * @description: 根据用户id查询用户资料
     * @param {*} req
     * @param {*} res
     */
    static async getInfoById(req, res) {
        const userId = req.userId; // 获取存储在请求对象中的用户 ID
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: '用户不存在！' });
            }
            res.send(user);
            return
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /******* 
     * @description: 查询所有用户
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @param {*} function
     * @param {*} data
     */
    static async getUserList(req, res, next) {
        UserModel.find({}, function (req, data) {
            res.send(data)
        })
    }

    /******* 
     * @description: 用户注册
     * @param {*} req
     * @param {*} res
     */
    static async register(req, res) {
        const { username, email, password } = req.body;
        try {
            // 检查是否存在相同的用户名或电子邮件
            const existingUser = await UserModel.findOne({ $or: [{ email }] });
            if (existingUser) {
                return res.status(201).json({ msg: '此电子邮箱已被注册' });
            }
            const createTime = formatDate(new Date());
            // 创建新用户
            const newUser = new UserModel({ username, email, password, createTime });
            const savedUser = await newUser.save();
            return res.status(200).json({ msg: "注册成功！", data: savedUser });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // 要处理一个用户只对应一token的问题 map集合
    // const userMap = new Map();
    /******* 
     * @description: 登录
     * @param {*} req 
     * @param {*} res
     */


    static async login(req, res) {
        const { email, password } = req.body;
        let token = ''
        let userId = ''
        // 在用户集合中查找匹配的用户
        const user = await UserModel.findOne({ email, password });
        console.log(user);
        if (!user) {
            return res.status(201).json({ msg: '邮箱或密码错误' });
        } else {
            userId = user._id.toString()
            const username = user.username.toString()
            const faceImg = user.faceImg.toString()
            const email = user.email.toString()
            const github = user.github.toString()
            const introduction = user.introduction.toString()
            const label = user.label.toString()
            // 生成 JWT 令牌
            token = jwt.sign({ userId: userId }, key, { expiresIn: '24h' });
            // 将 JWT 令牌存入 Redis
            // console.log(userId, token);
            // 返回令牌给客户端
            try {
                const client = await connectRedis();
                await setAsync(client, userId, token);
                client.quit();
            } catch (error) {
                console.error('操作出错:', error);
            }
            res.status(200).json({ token: token, msg: '登录成功！', userId: userId, userInfo: { username: username, faceImg: faceImg, email: email,github:github,introduction:introduction,label:label } });
        }
    }

    /******* 
     * @description: 修改密码接口
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    static async changePassword(req, res) {
        const { email, oldPassword, newPassword } = req.body;
        try {
            // 在用户集合中查找匹配的用户
            const user = await UserModel.findOne({ email, password: oldPassword });
            if (!user) {
                return res.status(401).json({ error: '邮箱或密码错误' });
            }
            // 更新用户密码
            user.password = newPassword;
            await user.save();
            return res.status(200).json({ message: '密码修改成功' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '服务器错误' });
        }
    }

}




module.exports = { UserController }



