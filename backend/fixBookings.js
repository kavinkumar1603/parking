// Script to fix old bookings without endTime or with wrong status
const mongoose = require('mongoose');
require('dotenv').config();

const Booking = require('./models/Booking');

async function fixOldBookings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    // Find bookings without endTime
    const bookingsWithoutEndTime = await Booking.find({ endTime: { $exists: false } });
    
    console.log(`Found ${bookingsWithoutEndTime.length} bookings without endTime`);
    
    for (const booking of bookingsWithoutEndTime) {
      // Assume 1 hour duration if not specified
      const duration = booking.duration || 1;
      const endTime = new Date(booking.startTime.getTime() + duration * 60 * 60 * 1000);
      
      // Calculate price if missing
      const pricePerHour = booking.vehicleType === 'car' ? 40 : 20;
      const price = booking.price || pricePerHour * duration;
      
      booking.endTime = endTime;
      booking.duration = duration;
      booking.price = price;
      
      // Fix status: change 'active' to 'reserved'
      if (booking.status === 'active') {
        booking.status = 'reserved';
      }
      
      await booking.save();
      console.log(`✓ Fixed booking ${booking._id}: ${booking.parkingSlot} (${booking.vehicleType})`);
    }
    
    console.log('✓ All bookings fixed!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixOldBookings();
