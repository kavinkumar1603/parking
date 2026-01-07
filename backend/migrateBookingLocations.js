// Script to add locationId to existing bookings
const mongoose = require('mongoose');
require('dotenv').config();

const Booking = require('./models/Booking');
const ParkingLocation = require('./models/ParkingLocation');

async function migrateBookingLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    // Get the first parking location as default
    const defaultLocation = await ParkingLocation.findOne();
    
    if (!defaultLocation) {
      console.log('⚠ No parking locations found in database. Please seed locations first.');
      process.exit(1);
    }
    
    console.log(`Using default location: ${defaultLocation.name} (${defaultLocation._id})`);
    
    // Find bookings without locationId
    const bookingsWithoutLocation = await Booking.find({ 
      $or: [
        { locationId: { $exists: false } },
        { locationId: null }
      ]
    });
    
    console.log(`Found ${bookingsWithoutLocation.length} bookings without locationId`);
    
    if (bookingsWithoutLocation.length === 0) {
      console.log('✓ All bookings already have locationId!');
      process.exit(0);
    }
    
    // Update bookings with default locationId
    const result = await Booking.updateMany(
      { 
        $or: [
          { locationId: { $exists: false } },
          { locationId: null }
        ]
      },
      { $set: { locationId: defaultLocation._id } }
    );
    
    console.log(`✓ Updated ${result.modifiedCount} bookings with locationId`);
    console.log('✓ Migration complete!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

migrateBookingLocations();
