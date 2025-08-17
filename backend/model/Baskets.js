import mongoose from "mongoose";

const basketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
},
{ timestamps: true }
);

const Basket = mongoose.model("Basket", basketSchema);
export default Basket;
