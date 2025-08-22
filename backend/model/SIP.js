// models/SIP.js
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 1, max: 31, required: true }, // 1..31
    time: { type: String, required: true },                  // "HH:mm"
  },
  { _id: false }
);

const sipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    baskets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Basket", required: true }],
    schedules: { type: [scheduleSchema], default: [] },
    status: { type: String, enum: ["ACTIVE", "PAUSED", "CANCELLED"], default: "ACTIVE" },
  },
  { timestamps: true }
);

const SIP = mongoose.model("SIP", sipSchema);
export default SIP;
