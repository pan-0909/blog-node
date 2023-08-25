const express = require('express');
const router = express.Router();
const User = require('../../model/user')
/* 查 */
// 查询所有用户
router.get('/', function (req, res, next) {
        User.find({}, function (req, data) {
                res.send(data)
        })
});

/* 查用户数据 */
router.get('/getUserInfo/:id', async function (req, res) {
        // _id要和数据库中的字段保持一致
        const _id = req.params.id;
        try {
                const user = await User.findById(_id);
                if (!user) {
                        return res.status(404).json({ error: 'User not found' });
                }
                res.send(user);
                return
        } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
        }
});

// updateById
router.put('/updateUserInfo', async (req, res) => {
        const newUsername = req.body.username;
        const userId = req.body.id
        try {
                const user = await User.findOneAndUpdate(
                        { _id: userId },
                        { username: newUsername },
                        { new: true }
                );
                if (!user) {
                        return res.status(404).json({ error: 'User not found' });
                }
                return res.json(user);
        } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
        }
});

router.post('/register', async (req, res) => {
        const { username, email, password } = req.body;
        try {
                // 检查是否存在相同的用户名或电子邮件
                const existingUser = await User.findOne({ $or: [{ email }] });
                if (existingUser) {
                        return res.status(400).json({ error: '电子邮件重复' });
                }
                // 创建新用户
                const newUser = new User({ username, email, password });
                const savedUser = await newUser.save();
                return res.status(201).json(savedUser);
        } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
        }
});


module.exports = router;