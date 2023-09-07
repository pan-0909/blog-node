const UserModel = require('../../model/user')
const jwt = require('jsonwebtoken');
class UserController {

    /******* 
     * @description: 更新用户资料
     * @param {*} req
     * @param {*} res
     */
    static async updateUserInfo(req, res) {
        try {
            const token = req.headers.authorization;
            const newUsername = req.body.username;

            // 解码 JWT
            const decodedToken = jwt.decode(token, { complete: true });
            const userId = decodedToken.payload.userId;

            const user = await UserModel.findOneAndUpdate(
                { _id: userId },
                { username: newUsername },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: '用户不存在！' });
            }

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    /******* 
     * @description: 根据用户id查询用户资料
     * @param {*} req
     * @param {*} res
     */
    static async getInfoById(req, res) {
        // _id要和数据库中的字段保持一致
        const _id = req.params.id;
        try {
            const user = await UserModel.findById(_id);
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
                return res.status(400).json({ error: '电子邮件重复' });
            }
            // 创建新用户
            const newUser = new UserModel({ username, email, password });
            const savedUser = await newUser.save();
            return res.status(200).json(savedUser);
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
    static login(req, res) {
        const { email, password } = req.body;
        // 在用户集合中查找匹配的用户
        UserModel.findOne({ email, password }, function (req, data) {
            console.log(data);
            if (!data) {
                return res.status(401).json({ error: '邮箱或密码错误' });
            }
            // 生成 JWT 令牌
            const token = jwt.sign({ userId: data._id }, 'secret-key', { expiresIn: '24h' });
            // 返回令牌给客户端
            return res.status(401).json({ token });
        })
    }
}




module.exports = {UserController}



