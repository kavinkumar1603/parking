const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Booking = require('../models/Booking');

// GET - Get all bookings for a user (protected)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create new booking (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { vehicleType, vehicleNumber, parkingSlot, startTime } = req.body;
    const booking = new Booking({
      userId: req.user.id,
      vehicleType,
      vehicleNumber,
      parkingSlot,
      startTime: startTime || new Date()
    });
    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
