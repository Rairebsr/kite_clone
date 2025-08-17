import express from "express";
import GsecApplication from "../model/GsecApplication.js";
import jwt from "jsonwebtoken";

const Grouter = express.Router();

Grouter.post("/apply", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { symbol, name, price, amount } = req.body;

    if (!symbol || !name || !price || !amount) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newApplication = new GsecApplication({
      userId,
      symbol,
      name,
      price,
      amount,
    });

    await newApplication.save(); // ✅ This saves the document

    return res.status(200).json({ message: "Bid placed successfully" });
  } catch (err) {
    console.error("GSEC apply error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default Grouter;
