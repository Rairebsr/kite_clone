// models/IpoApplication.js
import mongoose from 'mongoose';

const ipoApplicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  upiId: {
    type: String,
    required: true,
  },
  upiProvider: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const IpoApplication = mongoose.model('IpoApplication', ipoApplicationSchema);

export default IpoApplication;
