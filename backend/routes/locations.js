const express = require('express');
const router = express.Router();
const ParkingLocation = require('../models/ParkingLocation');
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');
const auth = require('../middlewares/auth');

// ========== AUTO-RELEASE EXPIRED SLOTS ==========
async function autoReleaseExpiredSlots() {
  try {
    const now = new Date();
    
    // Find all reserved slots where reservedUntil has passed
    const expiredSlots = await ParkingSlot.find({
      status: 'reserved',
      reservedUntil: { $lt: now }
    });
    
    for (const slot of expiredSlots) {
      slot.status = 'open';
      slot.reservedUntil = null;
      slot.currentBookingId = null;
      await slot.save();
      console.log(`✓ Released slot ${slot.slotId} - reservation expired`);
    }
    
    return expiredSlots.length;
  } catch (err) {
    console.error('Error releasing expired slots:', err);
    return 0;
  }
}

// ========== GET NEARBY PARKING LOCATIONS ==========
// GET /api/locations/nearby?lat=11.0168&lng=76.9558&radius=5
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in kilometers
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusInKm = parseFloat(radius);
    
    // Get all locations (for small datasets, calculate distance in code)
    // For production, use MongoDB geospatial queries
    const allLocations = await ParkingLocation.find();
    
    // Filter by distance (Haversine formula)
    const nearbyLocations = allLocations.filter(location => {
      const distance = calculateDistance(
        userLat, userLng,
        location.coordinates.lat, location.coordinates.lng
      );
      return distance <= radiusInKm;
    }).map(location => ({
      _id: location._id,
      name: location.name,
      address: location.address,
      coordinates: location.coordinates,
      totalSlots: location.totalSlots,
      pricePerHour: location.pricePerHour,
      distance: calculateDistance(
        userLat, userLng,
        location.coordinates.lat, location.coordinates.lng
      ).toFixed(2) + ' km'
    }));
    
    res.json({
      message: 'Nearby locations retrieved',
      locations: nearbyLocations,
      count: nearbyLocations.length
    });
  } catch (err) {
    console.error('Error fetching nearby locations:', err);
    res.status(500).json({ message: err.message });
  }
});

// ========== GET AVAILABLE SLOTS FOR A LOCATION ==========
// GET /api/locations/:locationId/slots?vehicleType=car
router.get('/:locationId/slots', async (req, res) => {
  try {
    const { locationId } = req.params;
    const { vehicleType } = req.query;
    
    if (!vehicleType || !['car', 'bike'].includes(vehicleType)) {
      return res.status(400).json({ message: 'Valid vehicleType (car/bike) is required' });
    }
    
    // Auto-release expired slots first
    await autoReleaseExpiredSlots();
    
    // Get all slots for this location and vehicle type
    const allSlots = await ParkingSlot.find({
      locationId,
      vehicleType
    });
    
    // Separate open and reserved slots
    const openSlots = allSlots.filter(slot => slot.status === 'open');
    const reservedSlots = allSlots.filter(slot => slot.status === 'reserved');
    
    res.json({
      message: 'Slots retrieved successfully',
      slots: allSlots,
      openSlots: openSlots.map(s => s.slotId),
      reservedSlots: reservedSlots.map(s => s.slotId),
      available: openSlots.length,
      total: allSlots.length
    });
  } catch (err) {
    console.error('Error fetching slots:', err);
    res.status(500).json({ message: err.message });
  }
});

// ========== BOOK A PARKING SLOT ==========
// POST /api/locations/book
router.post('/book', auth, async (req, res) => {
  try {
    const { locationId, slotId, vehicleType, vehicleNumber, duration } = req.body;
    
    // Validate input
    if (!locationId || !slotId || !vehicleType || !vehicleNumber || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Auto-release expired slots
    await autoReleaseExpiredSlots();
    
    // Find the slot
    const slot = await ParkingSlot.findOne({ slotId, locationId });
    
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    if (slot.status === 'reserved') {
      return res.status(400).json({ message: 'Slot is already reserved' });
    }
    
    if (slot.vehicleType !== vehicleType) {
      return res.status(400).json({ message: `Slot is for ${slot.vehicleType} only` });
    }
    
    // Get location for pricing
    const location = await ParkingLocation.findById(locationId);
    const pricePerHour = location.pricePerHour[vehicleType];
    const totalPrice = pricePerHour * duration;
    
    // Calculate times
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
    
    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      vehicleType,
      vehicleNumber,
      parkingSlot: slotId,
      startTime,
      endTime,
      duration,
      price: totalPrice,
      status: 'reserved'
    });
    
    await booking.save();
    
    // Update slot status
    slot.status = 'reserved';
    slot.reservedUntil = endTime;
    slot.currentBookingId = booking._id;
    await slot.save();
    
    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking: {
        id: booking._id,
        slotId: slot.slotId,
        location: location.name,
        vehicleType,
        duration: `${duration} hour(s)`,
        price: `₹${totalPrice}`,
        startTime,
        endTime
      }
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ========== HELPER FUNCTION: Calculate Distance ==========
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;
