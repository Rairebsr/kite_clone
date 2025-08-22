// controllers/sipController.js
import SIP from "../model/SIP.js";

export const createSIP = async (req, res) => {
  try {
    const { userId, name, baskets, schedules } = req.body;

    const newSIP = new SIP({
      userId,
      name,
      baskets,   // array of basket IDs
      schedules, // array of { date, time }
      status: "ACTIVE",
    });

    await newSIP.save();
    res.status(201).json(newSIP);
  } catch (err) {
    res.status(500).json({ message: "Error creating SIP", error: err.message });
  }
};

export const getUserSIPs = async (req, res) => {
  try {
    const { userId } = req.params;
    const sips = await SIP.find({ userId })
      .populate("baskets", "name") // populate basket names
      .sort({ createdAt: -1 });

    res.json(sips);
  } catch (err) {
    res.status(500).json({ message: "Error fetching SIPs", error: err.message });
  }
};
