import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stockSymbol: { type: String, required: true },
  stockName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  stopLoss: { type: Number, default: null },
  orderType: { type: String, enum: ['Market', 'Limit', 'SL', 'SL-M'], required: true },
  productType: { type: String, enum: ['Intraday', 'Longterm'], required: true },
  tabType: { type: String, enum: ['Quick', 'Regular', 'Iceberg', 'Cover'], required: true },
  validity: { type: String, enum: ['Day', 'Immediate', 'Minutes'], default: 'Day' },
  disclosedQty: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  segment: { type: String, enum: ['EQUITY', 'COMMODITY'], required: true},
  exchange: {type: String, enum: ['NSE', 'BSE', 'MCX'], required: true},
  basketName: { type: String, default: null }
});

export default mongoose.model('Orders', orderSchema);