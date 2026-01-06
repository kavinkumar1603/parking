const mongoose = require('mongoose');

// Parking Slot Schema
const ParkingSlotSchema = new mongoose.Schema({
  slotId: { type: String, required: true, unique: true }, // e.g., "C101", "B201"
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLocation', required: true },
  vehicleType: { type: String, enum: ['car', 'bike'], required: true },
  status: { type: String, enum: ['open', 'reserved'], default: 'open' },
  reservedUntil: { type: Date }, // Timestamp when reservation expires
  currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
}, { timestamps: true });

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema);
