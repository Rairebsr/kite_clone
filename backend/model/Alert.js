import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: String, // GOLDBEES
  condition: String, // "Last price of NSE:GOLDBEES ≥ 93.27"
  status: {
    type: String,
    default: "ENABLED",
  },
  type: {
    type: String,
    enum: ["SIMPLE", "ATO"],
    default: "SIMPLE",
  },
  triggered: {
    type: String,
    default: "N/A",
  },
  createdOn: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
});

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
