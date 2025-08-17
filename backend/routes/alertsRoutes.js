import express from "express";
import Alert from "../model/Alert.js";

const router = express.Router();

// Create new alert
router.post("/", async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    await newAlert.save();
    res.status(201).json({ success: true, alert: newAlert });
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ success: false, message: "Failed to create alert" });
  }
});

// Get alerts by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.params.userId }).sort({ createdOn: -1 });
    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch alerts" });
  }
});

export default router;
