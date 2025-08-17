import mongoose from 'mongoose'

const segmentSchema = new mongoose.Schema({
  openingBalance: {
    type: Number,
    default: 0
  },
  usedMargin: {
    type: Number,
    default: 0
  },
  availableMargin: {
    type: Number,
    default: 0
  },
  payin: {
    type: Number,
    default: 0
  },
  payout: {
    type: Number,
    default: 0
  },
  span: {
    type: Number,
    default: 0
  },
  delivery: {
    type: Number,
    default: 0
  },
  exposure: {
    type: Number,
    default: 0
  },
  options: {
    type: Number,
    default: 0
  },
  collateralLiquid: {
    type: Number,
    default: 0
  },
  collateralEquity: {
    type: Number,
    default: 0
  }
}, { _id: false });

const fundSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // adjust according to your actual user model
    required: true,
    unique: true
  },
  equity: {
    type: segmentSchema,
    default: () => ({})
  },
  commodity: {
    type: segmentSchema,
    default: () => ({})
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Fund', fundSchema);