import express from "express";
const router = express.Router();
import db from "../db/db.js";  // 确保 db.js 也改成了 ES 模块语法

// 添加车票
router.post("/add", (req, res) => {
    const t = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO tickets (
                user_id, ticket_number, train_no,
                departure_station, arrival_station,
                travel_date, departure_time,
                price, use_credit,
                seat_type, has_conditioner,
                seat_no, sell_place, gate_info,
                message, theme
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            t.user_id,
            t.ticket_number,
            t.train_no,
            t.departure_station,
            t.arrival_station,
            t.travel_date,
            t.departure_time,
            t.price,
            t.use_credit,
            t.seat_type,
            t.has_conditioner,
            t.seat_no,
            t.sell_place,
            t.gate_info,
            t.message,
            t.theme
        );

        res.json({ success: true, message: "保存成功" });
    } catch (err) {
        res.json({ success: false, message: "保存失败" });
    }
});

// 查询车票
router.get("/list/:userId", (req, res) => {
    const userId = req.params.userId;

    const list = db.prepare(`
        SELECT * FROM tickets WHERE user_id = ?
        ORDER BY created_at DESC
    `).all(userId);

    res.json(list);
});

// 删除车票
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.prepare(`DELETE FROM tickets WHERE id = ?`).run(id);

    res.json({ success: true });
});

export default router;