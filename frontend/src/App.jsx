import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ParkingSelection from './components/ParkingSelection'
import CarBooking from './components/CarBooking'
import BikeBooking from './components/BikeBooking'
import MapView from './components/MapView'
import SlotSelection from './components/SlotSelection'
import AdminDashboard from './components/AdminDashboard'


function App() {

  return (

    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/parking-selection" element={<ParkingSelection/>} />
          <Route path="/map/:vehicleType" element={<MapView />} />
          <Route path="/slots/:locationId" element={<SlotSelection />} />
          <Route path="/car-booking" element={<CarBooking/>} />
          <Route path="/bike-booking" element={<BikeBooking/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="*" element={<h1 className='text-center mt-20 text-3xl'>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>

  )
}

export default App
