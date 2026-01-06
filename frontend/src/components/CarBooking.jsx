import { useState, useEffect } from 'react'

const CarBooking = () => {
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [duration, setDuration] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [plateNumber, setPlateNumber] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0])
    const [startTime, setStartTime] = useState('09:00')
    const [occupiedSlots, setOccupiedSlots] = useState([])

    // Fetch occupied slots from database
    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/bookings/available?vehicleType=car');
                const data = await response.json();
                if (response.ok) {
                    console.log('Occupied car slots:', data.occupiedSlots);
                    setOccupiedSlots(data.occupiedSlots || []);
                }
            } catch (err) {
                console.error('Error fetching slots:', err);
            }
        };
        fetchOccupiedSlots();
        // Refresh every 30 seconds
        const interval = setInterval(fetchOccupiedSlots, 30000);
        return () => clearInterval(interval);
    }, []);

    const pricePerHour = 40 // Car: ₹40/hour
    const totalPrice = duration * pricePerHour
    const isFormValid = selectedSlot && plateNumber.length >= 3 && bookingDate && startTime

    const calculateEndTime = () => {
        const [hours, minutes] = startTime.split(':').map(Number)
        const endHour = (hours + duration) % 24
        return `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }

    const handleConfirm = async () => {
        if (!isFormValid) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicleType: 'car',
                    vehicleNumber: plateNumber,
                    parkingSlot: selectedSlot,
                    startTime: `${bookingDate}T${startTime}`,
                    duration: duration
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Reservation confirmed! Total: ${data.price} for ${data.details}`);
                // Refresh occupied slots
                const slotsResponse = await fetch('http://localhost:3000/api/bookings/available?vehicleType=car');
                const slotsData = await slotsResponse.json();
                if (slotsResponse.ok) {
                    setOccupiedSlots(slotsData.occupiedSlots);
                }
                // Reset form
                setSelectedSlot(null);
                setPlateNumber('');
            } else {
                alert('Booking failed: ' + data.message);
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setIsLoading(false);
        }
    }

    // Sample car parking slots data for 3 levels
    const level1Slots = [
        { id: 'C101' },
        { id: 'C102' },
        { id: 'C103' },
        { id: 'C104' },
        { id: 'C105' },
        { id: 'C106' },
        { id: 'C107' },
        { id: 'C108' },
        { id: 'C109' },
        { id: 'C110' },
        { id: 'C111' },
        { id: 'C112' },
    ].map(slot => ({ ...slot, status: occupiedSlots.includes(slot.id) ? 'occupied' : 'free' }))

    const level2Slots = [
        { id: 'C201' },
        { id: 'C202' },
        { id: 'C203' },
        { id: 'C204' },
        { id: 'C205' },
        { id: 'C206' },
        { id: 'C207' },
        { id: 'C208' },
        { id: 'C209' },
        { id: 'C210' },
        { id: 'C211' },
        { id: 'C212' },
    ].map(slot => ({ ...slot, status: occupiedSlots.includes(slot.id) ? 'occupied' : 'free' }))

    const level3Slots = [
        { id: 'C301' },
        { id: 'C302' },
        { id: 'C303' },
        { id: 'C304' },
        { id: 'C305' },
        { id: 'C306' },
        { id: 'C307' },
        { id: 'C308' },
        { id: 'C309' },
        { id: 'C310' },
        { id: 'C311' },
        { id: 'C312' },
    ].map(slot => ({ ...slot, status: occupiedSlots.includes(slot.id) ? 'occupied' : 'free' }))

    const levels = [
        { id: 'level1', name: 'LEVEL 01', slots: level1Slots },
        { id: 'level2', name: 'LEVEL 02', slots: level2Slots },
        { id: 'level3', name: 'LEVEL 03', slots: level3Slots },
    ]

    const durations = [1, 2, 4, 8, 12, 24]

    return (
        <div className="h-screen bg-black text-white flex flex-col lg:flex-row">
            {/* Left Side - Parking Slots - Scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                        AVAILABLE <span className="text-blue-500">CAR</span> SLOTS
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm">Real-time occupancy status for Level 1 - 3</p>
                </div>

                {/* Level Sections */}
                {levels.map((level) => (
                    <div key={level.id} className="bg-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-1 h-6 sm:h-8 bg-blue-500 rounded"></div>
                                <h2 className="text-xl sm:text-2xl font-bold">{level.name}</h2>
                            </div>
                            <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-400">SELECTED</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                    <span className="text-gray-400">FREE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                                    <span className="text-gray-400">OCCUPIED</span>
                                </div>
                            </div>
                        </div>

                        {/* Parking Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                            {level.slots.map((slot) => (
                                <div
                                    key={slot.id}
                                    onClick={() => slot.status === 'free' && setSelectedSlot(slot.id)}
                                    className={`
                                        aspect-square rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer transition touch-manipulation
                                        ${selectedSlot === slot.id ? 'bg-blue-500/20 border-2 border-blue-500' : 
                                          slot.status === 'occupied' ? 'bg-zinc-800 cursor-not-allowed' : 
                                          'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600'}
                                    `}
                                >
                                    <span className={`text-[10px] sm:text-xs mb-1 sm:mb-2 ${slot.status === 'occupied' ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {slot.id}
                                    </span>
                                    <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${selectedSlot === slot.id ? 'text-blue-500' : slot.status === 'occupied' ? 'text-gray-700' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            </div>
            {/* Right Side - Reservation Panel - Fixed/Static */}
            <div className="w-full lg:w-110 bg-black flex items-center justify-center p-4 sm:p-6 md:p-8 lg:overflow-hidden">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 flex flex-col w-full max-w-md lg:max-w-none lg:h-[calc(100vh-4rem)] shadow-2xl overflow-y-auto scrollbar-hide">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-1">Reservation</h2>
                        <p className="text-gray-500 font-bold uppercase text-[8px] sm:text-[9px] tracking-[0.2em]">Secure Checkout</p>
                    </div>

                    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                        {/* Slot Info Card */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Zone {selectedSlot || '---'}</p>
                                <p className="text-sm font-bold text-white uppercase">Car Slot</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Level</p>
                                <p className="text-sm font-bold text-blue-500">01</p>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Booking Date</label>
                            <input 
                                type="date" 
                                value={bookingDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Time Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Start Time</label>
                            <input 
                                type="time" 
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Time Range Display */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Booking Time</p>
                            <p className="text-white font-bold">{startTime} - {calculateEndTime()}</p>
                            <p className="text-gray-400 text-sm mt-1">{new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>

                        {/* Vehicle Number Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Vehicle Plate Number</label>
                            <input 
                                type="text" 
                                placeholder="e.g. ABC-1234"
                                value={plateNumber}
                                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700 uppercase text-sm sm:text-base"
                            />
                        </div>

                        {/* Duration Selector */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Duration (Hours)</label>
                                <span className="text-blue-500 font-black text-sm">{duration}h</span>
                            </div>
                            <div className="grid grid-cols-3 sm:flex gap-2">
                                {durations.map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => setDuration(h)}
                                        className={`py-2 px-2 sm:flex-1 rounded-lg text-[10px] font-black transition-all touch-manipulation ${
                                            duration === h 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 active:bg-white/20'
                                        }`}
                                    >
                                        {h}h
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center gap-1 sm:gap-2 transition-all touch-manipulation ${
                                        paymentMethod === 'cash' 
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                                            : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10 active:bg-white/10'
                                    }`}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm9-13H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z"/>
                                    </svg>
                                    <span className="text-[8px] font-bold uppercase">Cash</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center gap-1 sm:gap-2 transition-all touch-manipulation ${
                                        paymentMethod === 'card' 
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                                            : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10 active:bg-white/10'
                                    }`}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                    </svg>
                                    <span className="text-[8px] font-bold uppercase">Card</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center gap-1 sm:gap-2 transition-all touch-manipulation ${
                                        paymentMethod === 'upi' 
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                                            : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10 active:bg-white/10'
                                    }`}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    <span className="text-[8px] font-bold uppercase">UPI</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing and Action */}
                    <div className="pt-4 sm:pt-6 border-t border-white/10 mt-auto">
                        <div className="flex justify-between items-end mb-4 sm:mb-6">
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Fee</p>
                                <p className="text-3xl sm:text-4xl font-black text-white tracking-tighter">₹{totalPrice.toFixed(2)}</p>
                            </div>
                            <p className="text-gray-600 text-[9px] font-bold italic">Incl. Service Tax</p>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!isFormValid || isLoading}
                            className={`
                                w-full py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 transform touch-manipulation
                                ${!isFormValid || isLoading 
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                                    : 'bg-[#3b82f6] text-white hover:bg-blue-400 active:scale-95 active:bg-blue-600'}
                            `}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : 'Complete Reservation'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
)}
    

export default CarBooking