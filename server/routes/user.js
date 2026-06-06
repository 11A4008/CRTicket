import express from "express";
const router = express.Router();
import db from "../db/db.js";
import bcrypt from "bcryptjs";

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

    // 查询用户
    const user = db.prepare(`
        SELECT * FROM users WHERE username = ?
    `).get(username);

    // 用户不存在
    if (!user) {
        return res.json({
            success: false,
            message: "用户名或密码错误"
        });
    }

    // 验证密码
    const isValid = bcrypt.compareSync(password, user.password);

    if (isValid) {
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } else {
        res.json({
            success: false,
            message: "用户名或密码错误"
        });
    }
});

// 用户资料更新接口（用户名和密码二选一或同时修改）
router.post("/update-profile", (req, res) => {
    const { id, username, password } = req.body;

    if (!id) {
        return res.json({ success: false, message: "缺少用户ID" });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (!user) {
        return res.json({ success: false, message: "用户不存在" });
    }

    const nextUsername = typeof username === "string" ? username.trim() : "";
    const nextPassword = typeof password === "string" ? password.trim() : "";

    if (!nextUsername && !nextPassword) {
        return res.json({ success: false, message: "没有可更新的内容" });
    }

    if (nextUsername && nextUsername !== user.username) {
        const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(nextUsername);
        if (existingUser) {
            return res.json({ success: false, message: "用户名已存在" });
        }
    }

    const finalUsername = nextUsername || user.username;
    const finalPassword = nextPassword ? bcrypt.hashSync(nextPassword, 10) : user.password;

    try {
        db.prepare("UPDATE users SET username = ?, password = ? WHERE id = ?").run(finalUsername, finalPassword, id);
        return res.json({
            success: true,
            message: "修改成功",
            user: {
                id: user.id,
                username: finalUsername
            }
        });
    } catch (err) {
        return res.json({ success: false, message: "更新失败，请重试" });
    }
});

// 删除账户接口（仅验证）
router.post("/delete-account", (req, res) => {
    const { id, password } = req.body;

    if (!id) {
        return res.json({ success: false, message: "缺少用户ID" });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (!user) {
        return res.json({ success: false, message: "用户不存在" });
    }

    if (!password) {
        return res.json({ success: false, message: "请输入密码" });
    }

    // 验证密码
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
        return res.json({ success: false, message: "密码错误" });
    }

    return res.json({ success: true, message: "验证通过" });
});

// 确认删除账户接口
router.post("/confirm-delete", (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.json({ success: false, message: "缺少用户ID" });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (!user) {
        return res.json({ success: false, message: "用户不存在" });
    }

    try {
        // 先删除用户的所有车票记录
        db.prepare("DELETE FROM tickets WHERE user_id = ?").run(id);
        // 再删除用户
        db.prepare("DELETE FROM users WHERE id = ?").run(id);
        return res.json({ success: true, message: "账户已删除" });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: "删除失败，请稍后重试" });
    }
});

export default router;
