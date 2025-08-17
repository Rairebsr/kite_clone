import express from "express";
import Basket from "../model/Baskets.js";

const brouter = express.Router();

// Create a basket
brouter.post("/create", async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: "Name and userId are required" });
    }

    const basket = await Basket.create({ name, userId });
    res.status(201).json(basket);
  } catch (err) {
    console.error("Error creating basket:", err);
    res.status(500).json({ message: "Failed to create basket" });
  }
});

// Get baskets for a user
brouter.get("/:userId", async (req, res) => {
  try {
    const baskets = await Basket.find({ userId: req.params.userId });
    res.json(baskets);
  } catch (err) {
    console.error("Error fetching baskets:", err);
    res.status(500).json({ message: "Failed to fetch baskets" });
  }
});

// Delete basket
// Delete a basket
brouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const basket = await Basket.findById(id);
    if (!basket) return res.status(404).json({ message: "Basket not found" });

    await Basket.findByIdAndDelete(id);
    res.json({ message: "Basket deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default brouter;
