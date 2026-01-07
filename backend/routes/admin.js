const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/admin');
const Booking = require('../models/Booking');
const User = require('../models/User');
const ParkingLocation = require('../models/ParkingLocation');

// GET - Get all bookings with pagination and filters
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, vehicleType, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (vehicleType) query.vehicleType = vehicleType;
    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { parkingSlot: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('locationId', 'name address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBookings: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Get booking statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    // With current schema, status can be 'reserved' (active) or 'open' (released)
    const activeBookings = await Booking.countDocuments({ status: 'reserved' });
    const completedBookings = await Booking.countDocuments({ status: 'open' });
    const cancelledBookings = 0; // No explicit cancelled state yet

    const totalUsers = await User.countDocuments();
    const totalLocations = await ParkingLocation.countDocuments();
    
    // Calculate total revenue from both active and completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['reserved', 'open'] } } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalRevenue = (revenueData[0] && revenueData[0].total) || 0;

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('locationId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      totalUsers,
      totalLocations,
      totalRevenue,
      recentBookings
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update booking status
router.put('/bookings/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email phone')
     .populate('locationId', 'name address');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Cancel/Delete a booking
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Get all locations
router.get('/locations', adminAuth, async (req, res) => {
  try {
    const locations = await ParkingLocation.find().sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create new parking location
router.post('/locations', adminAuth, async (req, res) => {
  try {
    const location = new ParkingLocation(req.body);
    await location.save();
    res.status(201).json({ message: 'Location created successfully', location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update parking location
router.put('/locations/:id', adminAuth, async (req, res) => {
  try {
    const location = await ParkingLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location updated successfully', location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete parking location
router.delete('/locations/:id', adminAuth, async (req, res) => {
  try {
    const location = await ParkingLocation.findByIdAndDelete(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Get revenue report
router.get('/revenue', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: { $in: ['reserved', 'open'] } };

    if (startDate && endDate) {
      query.startTime = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const revenue = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$startTime' },
            month: { $month: '$startTime' },
            day: { $dayOfMonth: '$startTime' }
          },
          total: { $sum: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
    ]);

    res.json(revenue);
  } catch (err) {
    console.error('Admin revenue error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
