# Quick Setup Guide

## ✅ Completed Setup:

1. ✓ Database seeded with 4 parking locations and 290 car slots + 570 bike slots
2. ✓ Backend API routes created
3. ✓ Frontend components ready

## 🚀 Next Steps:

### 1. Get Google Maps API Key (Required for Map View)

1. Go to: https://console.cloud.google.com/
2. Create/select a project
3. Enable **Maps JavaScript API**
4. Go to Credentials → Create API Key
5. Copy the API key

### 2. Configure Frontend

Create `frontend/.env` file:
```bash
cd frontend
copy .env.example .env
```

Edit `.env` and add your API key:
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your_actual_key
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Test the System

1. Open http://localhost:5173
2. Sign up / Login
3. Select BIKE or CAR
4. **Map View** opens with nearby parking locations
5. Click a parking marker
6. View available slots
7. Select slot, enter vehicle number, choose duration
8. Confirm booking!

---

## 📍 System Flow:

```
User Selects Vehicle Type (CAR/BIKE)
         ↓
   Google Maps View
   (Shows nearby parking locations)
         ↓
   Click Parking Marker
         ↓
   Slot Selection Screen
   (Shows available slots for that location)
         ↓
   Book Slot
   (Auto-expires after duration)
```

---

## 🔑 Key Features Working:

✅ Google Maps integration
✅ Nearby location finder (within 10km radius)
✅ Mock parking slots in database
✅ Vehicle type filtering
✅ Auto-release expired bookings
✅ Real-time slot status updates
✅ JWT authentication
✅ Pricing: Car ₹40/hr, Bike ₹20/hr

---

## 🐛 Troubleshooting:

**Map not loading?**
- Check if VITE_GOOGLE_MAPS_API_KEY is set in frontend/.env
- Restart frontend dev server after adding .env

**No locations showing?**
- Run `node backend/seedData.js` to populate database
- Check if backend is running on port 3000

**Slots not updating?**
- Slots auto-refresh every 30 seconds
- Auto-release runs before every booking

---

## 📊 Mock Data Loaded:

**Locations:**
1. City Center Parking (50 cars, 100 bikes)
2. Mall Parking Plaza (80 cars, 150 bikes)  
3. Tech Park Parking (100 cars, 200 bikes)
4. Railway Station Parking (60 cars, 120 bikes)

All locations are around **Coimbatore** area. 

**To use different coordinates:** Edit `backend/seedData.js` and re-run.

---

## 🎯 Testing Scenarios:

1. **Book a slot** → Wait for expiry time → Check if auto-released
2. **Select different locations** → See slot count differences
3. **Switch between BIKE/CAR** → See different slot IDs and pricing
4. **Multiple bookings** → See real-time status updates

---

## 💡 Pro Tips:

- Press Ctrl+C to stop servers
- Use `npm run dev` (not `npm start`) for frontend
- MongoDB must be running on localhost:27017
- All times are based on server timezone
- Booking durations: 1, 2, 4, 8, 12, 24 hours

---

Enjoy your Smart Parking System! 🚗🏍️
