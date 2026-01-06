// Script to seed mock parking locations and slots
const mongoose = require('mongoose');
require('dotenv').config();

const ParkingLocation = require('./models/ParkingLocation');
const ParkingSlot = require('./models/ParkingSlot');

// Mock parking locations (around a central area - adjust coordinates for your city)
const mockLocations = [
  {
    name: 'City Center Parking',
    address: '123 Main Street, City Center',
    coordinates: { lat: 11.0168, lng: 76.9558 }, // Coimbatore coordinates
    totalSlots: { car: 50, bike: 100 }
  },
  {
    name: 'Mall Parking Plaza',
    address: '456 Shopping District',
    coordinates: { lat: 11.0240, lng: 76.9630 },
    totalSlots: { car: 80, bike: 150 }
  },
  {
    name: 'Tech Park Parking',
    address: '789 IT Corridor',
    coordinates: { lat: 11.0350, lng: 76.9700 },
    totalSlots: { car: 100, bike: 200 }
  },
  {
    name: 'Railway Station Parking',
    address: 'Station Road',
    coordinates: { lat: 11.0080, lng: 76.9650 },
    totalSlots: { car: 60, bike: 120 }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    // Clear existing data
    await ParkingLocation.deleteMany({});
    await ParkingSlot.deleteMany({});
    console.log('✓ Cleared old data');
    
    // Insert locations and create slots
    for (const locData of mockLocations) {
      const location = await ParkingLocation.create(locData);
      console.log(`✓ Created location: ${location.name}`);
      
      // Generate car slots
      const carSlots = [];
      for (let i = 1; i <= locData.totalSlots.car; i++) {
        carSlots.push({
          slotId: `${location._id.toString().slice(-2)}-C${String(i).padStart(3, '0')}`,
          locationId: location._id,
          vehicleType: 'car',
          status: 'open'
        });
      }
      
      // Generate bike slots
      const bikeSlots = [];
      for (let i = 1; i <= locData.totalSlots.bike; i++) {
        bikeSlots.push({
          slotId: `${location._id.toString().slice(-2)}-B${String(i).padStart(3, '0')}`,
          locationId: location._id,
          vehicleType: 'bike',
          status: 'open'
        });
      }
      
      await ParkingSlot.insertMany([...carSlots, ...bikeSlots]);
      console.log(`  ✓ Created ${carSlots.length} car slots and ${bikeSlots.length} bike slots`);
    }
    
    console.log('\n✓ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
