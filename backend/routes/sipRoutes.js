// routes/sipRoutes.js
import express from "express";
import SIP from "../model/SIP.js";
import Basket from "../model/Baskets.js"; // your existing basket model
const router = express.Router();

/**
 * POST /api/sips
 * body: { userId, name, baskets: [basketId], schedules: [{ date: "8th", time: "09:30" }, ...] }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, name, baskets = [], schedules = [] } = req.body;

    if (!userId || !name || !Array.isArray(baskets) || baskets.length === 0) {
      return res.status(400).json({ message: "userId, name and baskets are required" });
    }
    if (baskets.length > 3) {
      return res.status(400).json({ message: "You can select up to 3 baskets" });
    }

    // Ensure selected baskets belong to the same user
    const count = await Basket.countDocuments({ _id: { $in: baskets }, userId });
    if (count !== baskets.length) {
      return res.status(400).json({ message: "Invalid basket selection" });
    }

    // Normalize schedules: "8th" -> 8
    const normalized = schedules.map((s) => ({
      day: parseInt(String(s.date).replace(/\D/g, ""), 10),
      time: s.time,
    }));

    const sip = await SIP.create({ userId, name, baskets, schedules: normalized });
    const populated = await sip.populate("baskets", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create SIP failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/sips/:userId
 * returns user SIPs with populated basket names
 */
router.get("/:userId", async (req, res) => {
  try {
    const sips = await SIP.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("baskets", "name");
    res.json(sips);
  } catch (err) {
    console.error("Get SIPs failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/sips/:id
router.delete("/:id", async (req, res) => {
  try {
    await SIP.findByIdAndDelete(req.params.id);
    res.json({ message: "SIP deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// PUT /api/sips/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, baskets, schedules, status } = req.body;
    const sip = await SIP.findByIdAndUpdate(
      req.params.id,
      { name, baskets, schedules, status },
      { new: true }
    ).populate("baskets", "name");
    res.json(sip);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;
