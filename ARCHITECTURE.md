# Smart Parking System - Architecture & Setup

## System Architecture

### Flow:
1. **Vehicle Selection** → User selects BIKE or CAR
2. **Map View** → Shows nearby parking locations on Google Maps
3. **Location Selection** → User clicks a parking marker
4. **Slot Selection** → Shows available slots for that location
5. **Booking** → Reserves slot with auto-expiry

---

## Backend Structure

### Models:
- **ParkingLocation** - Stores parking locations with coordinates
- **ParkingSlot** - Mock slots (slotId, locationId, vehicleType, status, reservedUntil)
- **Booking** - User bookings with duration and price
- **User** - Authentication

### API Endpoints:
```
GET  /api/locations/nearby?lat=11.0168&lng=76.9558&radius=5
GET  /api/locations/:locationId/slots?vehicleType=car
POST /api/locations/book
POST /api/login
POST /api/signup
```

### Auto-Release Logic:
- Runs before every slot fetch/booking
- Finds slots where `reservedUntil < current time`
- Changes status from `reserved` → `open`

### Pricing:
- Car: ₹40/hour
- Bike: ₹20/hour

---

## Frontend Structure

### Components:
- **LandingPage** - Home page
- **Login/SignUp** - Authentication
- **ParkingSelection** - Vehicle type selection
- **MapView** - Google Maps with parking markers
- **SlotSelection** - Available slots grid
- **CarBooking/BikeBooking** - Legacy direct booking (optional)

### Routes:
```
/                     → LandingPage
/login                → Login
/signup               → SignUp
/parking-selection    → Vehicle selection
/map/:vehicleType     → Map view
/slots/:locationId    → Slot selection
```

---

## Setup Instructions

### 1. Seed Database:
```bash
cd backend
node seedData.js
```

### 2. Get Google Maps API Key:
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Maps JavaScript API"
4. Create API key
5. Add to frontend/.env:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

### 3. Start Backend:
```bash
cd backend
npm install
node server.js
```

### 4. Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Key Features

✓ Google Maps integration for location discovery
✓ Mock parking slots stored in MongoDB
✓ Vehicle type filtering (BIKE/CAR)
✓ Auto-expiry of reservations
✓ Real-time slot availability
✓ Simple pricing calculation
✓ Clean, minimal code
✓ JWT authentication

---

## Database Schema

### ParkingLocation:
```js
{
  name: String,
  address: String,
  coordinates: { lat: Number, lng: Number },
  totalSlots: { car: Number, bike: Number },
  pricePerHour: { car: Number, bike: Number }
}
```

### ParkingSlot:
```js
{
  slotId: String,           // "C101", "B201"
  locationId: ObjectId,
  vehicleType: "car|bike",
  status: "open|reserved",
  reservedUntil: Date,
  currentBookingId: ObjectId
}
```

### Booking:
```js
{
  userId: ObjectId,
  vehicleType: "car|bike",
  vehicleNumber: String,
  parkingSlot: String,
  startTime: Date,
  endTime: Date,
  duration: Number,         // hours
  price: Number,            // total ₹
  status: "reserved|open"
}
```

---

## How Auto-Expiry Works:

1. Every API call runs `autoReleaseExpiredSlots()`
2. Function finds: `status === 'reserved' AND reservedUntil < now`
3. Updates: `status = 'open'`, clears `reservedUntil` and `currentBookingId`
4. Logs: "✓ Released slot C101 - reservation expired"

**No cron jobs needed** - runs on-demand!

---

## Important Notes:

- This is **mock data** - not real parking authority data
- Coordinates are for Coimbatore area - adjust as needed
- Google Maps API has free tier limits
- Auto-expiry is simple but effective for MVP
- Keep code minimal for student projects

---

## Next Steps / Enhancements:

- Add payment gateway integration
- Real-time notifications when slot is released
- Booking history page
- QR code for entry/exit
- Admin dashboard
- Analytics & reports
