import mongoose from 'mongoose';

// Sub-schema for cart items
const cartItemSchema = new mongoose.Schema(
  {
    symbol: String,
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    orderType: { type: String, default: 'Limit' },
    productType: { type: String, default: 'Intraday' },
    tabType: { type: String, default: 'Regular' },
    validity: { type: String, default: 'Day' },
    disclosedQty: { type: Number, default: 0 },
    stopLoss: { type: Number, default: null },
    segment: { type: String, default: 'EQUITY' },
    exchange: { type: String, default: 'NSE' },
    ltp: Number,
    reqMargin: Number,
  },
  { _id: true } // 👈 ensures _id is added to each item
);

// Main cart schema
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [cartItemSchema],
});

export default mongoose.model('Cart', cartSchema);