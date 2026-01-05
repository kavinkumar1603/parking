const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  parkingSlot: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
