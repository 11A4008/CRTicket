import express from "express";
const router = express.Router();
import db from "../db/db.js";

// 注册接口
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (existingUser) {
        return res.json({ success: false, message: "用户名已存在" });
    }

    // 密码加密
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 插入新用户
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    try {
        stmt.run(username, hashedPassword);
        res.json({ success: true, message: "注册成功" });
    } catch (err) {
        res.json({ success: false, message: "注册失败，请重试" });
    }
});

// 登录接口
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = db.prepare(`
        SELECT * FROM users WHERE username = ? AND password = ?
    `).get(username, password);

    if (user) {
        res.json({
            success: true,
            user: { id: user.id, username: user.username }
        });
    } else {
        res.json({
            success: false,
            message: "用户名或密码错误"
        });
    }
});

export default router;