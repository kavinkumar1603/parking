const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Booking = require('../models/Booking');

// ========== PRICING RULES ==========
// Function to calculate price based on vehicle type and duration
function calculatePrice(vehicleType, hours) {
  const pricePerHour = vehicleType === 'car' ? 40 : 20; // Car: ₹40/hr, Bike: ₹20/hr
  return pricePerHour * hours;
}

// ========== AUTO-RELEASE LOGIC ==========
// Function to automatically release expired bookings
async function autoReleaseExpiredBookings() {
  try {
    const now = new Date();
    
    // Find all reserved bookings where endTime has passed
    const expiredBookings = await Booking.find({
      status: { $in: ['reserved', 'active'] }, // Handle both statuses
      endTime: { $lt: now } // endTime is less than current time
    });
    
    // Update status from 'reserved' to 'open' for expired bookings
    for (const booking of expiredBookings) {
      booking.status = 'open';
      await booking.save();
      console.log(`✓ Released slot ${booking.parkingSlot} - booking expired`);
    }
    
    return expiredBookings.length;
  } catch (err) {
    console.error('Error releasing expired bookings:', err);
    return 0;
  }
}

// ========== CONFIRM BOOKING ==========
// Function to confirm a new booking
async function confirmBooking(userId, locationId, vehicleType, vehicleNumber, parkingSlot, startTime, duration) {
  // Calculate endTime based on duration
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60 * 60 * 1000); // Add hours in milliseconds
  
  // Calculate price
  const price = calculatePrice(vehicleType, duration);
  
  // Create booking with 'reserved' status
  const booking = new Booking({
    userId,
    locationId,
    vehicleType,
    vehicleNumber,
    parkingSlot,
    startTime: start,
    endTime: end,
    duration,
    price,
    status: 'reserved'
  });
  
  await booking.save();
  return booking;
}

// ========== API ROUTES ==========

// GET - Get all bookings for a user (protected)
router.get('/', auth, async (req, res) => {
  try {
    // Auto-release expired bookings before fetching
    await autoReleaseExpiredBookings();
    
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create new booking (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { locationId, vehicleType, vehicleNumber, parkingSlot, startTime, duration } = req.body;
    
    // Validate required fields
    if (!locationId || !vehicleType || !vehicleNumber || !parkingSlot || !startTime || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Auto-release expired bookings first
    await autoReleaseExpiredBookings();
    
    // Check if slot is available (no active 'reserved' or 'active' bookings for this slot at this location)
    const now = new Date();
    const existingBooking = await Booking.findOne({
      locationId,
      parkingSlot,
      status: { $in: ['reserved', 'active'] }, // Handle both statuses
      endTime: { $gt: now } // Still active
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot is already reserved' });
    }
    
    // Confirm booking
    const booking = await confirmBooking(
      req.user.id,
      locationId,
      vehicleType,
      vehicleNumber,
      parkingSlot,
      startTime,
      duration
    );
    
    res.status(201).json({ 
      message: 'Booking confirmed successfully', 
      booking,
      price: `₹${booking.price}`,
      details: `${vehicleType} parking for ${duration} hour(s)`
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET - Get available slots (check which slots are not reserved)
router.get('/available', async (req, res) => {
  try {
    // Auto-release expired bookings
    await autoReleaseExpiredBookings();
    
    const now = new Date();
    const { vehicleType, locationId } = req.query; // Filter by vehicle type and location
    
    // Get all currently reserved/active slots (handle both statuses for backward compatibility)
    const query = {
      status: { $in: ['reserved', 'active'] }, // Include both statuses
      endTime: { $gt: now }
    };
    
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }
    
    // IMPORTANT: Filter by locationId to only show occupied slots for this specific location
    if (locationId) {
      query.locationId = locationId;
    }
    
    const reservedBookings = await Booking.find(query);
    const occupiedSlots = reservedBookings.map(b => b.parkingSlot);
    
    console.log(`Available slots requested for location ${locationId || 'all'}, ${vehicleType || 'all'}: ${occupiedSlots.length} occupied`, occupiedSlots);
    
    res.json({
      message: 'Slot availability retrieved',
      occupiedSlots,
      totalOccupied: occupiedSlots.length
    });
  } catch (err) {
    console.error('Error fetching available slots:', err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
