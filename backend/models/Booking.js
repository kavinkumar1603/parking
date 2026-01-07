const mongoose = require('mongoose');

// Booking Schema with status and endTime
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLocation', required: true },
  vehicleType: { type: String, required: true, enum: ['car', 'bike'] },
  vehicleNumber: { type: String, required: true },
  parkingSlot: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // hours
  price: { type: Number, required: true }, // total price in rupees
  status: { type: String, enum: ['open', 'reserved'], default: 'reserved' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
