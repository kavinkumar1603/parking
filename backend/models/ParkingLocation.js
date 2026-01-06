const mongoose = require('mongoose');

// Parking Location Schema
const ParkingLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  totalSlots: {
    car: { type: Number, default: 0 },
    bike: { type: Number, default: 0 }
  },
  pricePerHour: {
    car: { type: Number, default: 40 },
    bike: { type: Number, default: 20 }
  }
}, { timestamps: true });

module.exports = mongoose.model('ParkingLocation', ParkingLocationSchema);
