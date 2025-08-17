// backend/model/GsecApplication.js
import mongoose from "mongoose";

const gsecApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const GsecApplication = mongoose.model("GsecApplication", gsecApplicationSchema);
export default GsecApplication;
