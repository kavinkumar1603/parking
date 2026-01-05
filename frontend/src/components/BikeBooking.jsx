import { useState } from 'react'

const BikeBooking = () => {
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [duration, setDuration] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [plateNumber, setPlateNumber] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0])
    const [startTime, setStartTime] = useState('09:00')

    const pricePerHour = 5
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
                    vehicleType: 'bike',
                    vehicleNumber: plateNumber,
                    parkingSlot: selectedSlot,
                    startTime: `${bookingDate}T${startTime}`
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Reservation confirmed!');
            } else {
                alert('Booking failed: ' + data.message);
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setIsLoading(false);
        }
    }

    // Sample bike parking slots data for 3 levels
    const level1Slots = [
        { id: 'B101', status: 'free' },
        { id: 'B102', status: 'free' },
        { id: 'B103', status: 'free' },
        { id: 'B104', status: 'free' },
        { id: 'B105', status: 'occupied' },
        { id: 'B106', status: 'free' },
        { id: 'B107', status: 'free' },
        { id: 'B108', status: 'occupied' },
        { id: 'B109', status: 'free' },
        { id: 'B110', status: 'occupied' },
        { id: 'B111', status: 'free' },
        { id: 'B112', status: 'free' },
        { id: 'B113', status: 'free' },
        { id: 'B114', status: 'free' },
        { id: 'B115', status: 'free' },
        { id: 'B116', status: 'free' },
        { id: 'B117', status: 'free' },
        { id: 'B118', status: 'free' },
        { id: 'B119', status: 'occupied' },
        { id: 'B120', status: 'occupied' },
        { id: 'B121', status: 'free' },
        { id: 'B122', status: 'occupied' },
        { id: 'B123', status: 'occupied' },
        { id: 'B124', status: 'free' },
    ]

    const level2Slots = [
        { id: 'B201', status: 'free' },
        { id: 'B202', status: 'occupied' },
        { id: 'B203', status: 'free' },
        { id: 'B204', status: 'free' },
        { id: 'B205', status: 'free' },
        { id: 'B206', status: 'occupied' },
        { id: 'B207', status: 'free' },
        { id: 'B208', status: 'free' },
        { id: 'B209', status: 'occupied' },
        { id: 'B210', status: 'free' },
        { id: 'B211', status: 'free' },
        { id: 'B212', status: 'free' },
        { id: 'B213', status: 'occupied' },
        { id: 'B214', status: 'free' },
        { id: 'B215', status: 'free' },
        { id: 'B216', status: 'free' },
        { id: 'B217', status: 'occupied' },
        { id: 'B218', status: 'free' },
        { id: 'B219', status: 'free' },
        { id: 'B220', status: 'free' },
        { id: 'B221', status: 'free' },
        { id: 'B222', status: 'free' },
        { id: 'B223', status: 'free' },
        { id: 'B224', status: 'occupied' },
    ]

    const level3Slots = [
        { id: 'B301', status: 'free' },
        { id: 'B302', status: 'free' },
        { id: 'B303', status: 'occupied' },
        { id: 'B304', status: 'free' },
        { id: 'B305', status: 'free' },
        { id: 'B306', status: 'free' },
        { id: 'B307', status: 'occupied' },
        { id: 'B308', status: 'free' },
        { id: 'B309', status: 'free' },
        { id: 'B310', status: 'free' },
        { id: 'B311', status: 'occupied' },
        { id: 'B312', status: 'free' },
        { id: 'B313', status: 'free' },
        { id: 'B314', status: 'occupied' },
        { id: 'B315', status: 'free' },
        { id: 'B316', status: 'free' },
        { id: 'B317', status: 'free' },
        { id: 'B318', status: 'free' },
        { id: 'B319', status: 'free' },
        { id: 'B320', status: 'occupied' },
        { id: 'B321', status: 'free' },
        { id: 'B322', status: 'free' },
        { id: 'B323', status: 'free' },
        { id: 'B324', status: 'free' },
    ]

    const levels = [
        { name: 'LEVEL 01', slots: level1Slots },
        { name: 'LEVEL 02', slots: level2Slots },
        { name: 'LEVEL 03', slots: level3Slots },
    ]

    const durations = [1, 2, 4, 8, 12, 24]

    return (
        <div className="h-screen bg-black text-white flex overflow-hidden">
            {/* Left Side - Parking Slots */}
            <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        AVAILABLE <span className="text-blue-500">BIKE</span> SLOTS
                    </h1>
                    <p className="text-gray-500 text-sm">Real-time occupancy status for Level 1 - 3</p>
                </div>

                {/* Levels Section */}
                <div className="space-y-6">
                    {levels.map((level, levelIndex) => (
                        <div key={levelIndex} className="bg-zinc-900 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-blue-500 rounded"></div>
                                    <h2 className="text-2xl font-bold">{level.name}</h2>
                                </div>
                                <div className="flex gap-6 text-sm">
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
                            <div className="grid grid-cols-8 gap-4">
                                {level.slots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        onClick={() => slot.status === 'free' && setSelectedSlot(slot.id)}
                                        className={`
                                            aspect-square rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition
                                            ${selectedSlot === slot.id ? 'bg-blue-500/20 border-2 border-blue-500' : 
                                              slot.status === 'occupied' ? 'bg-zinc-800 cursor-not-allowed' : 
                                              'bg-zinc-800 hover:bg-zinc-700'}
                                        `}
                                    >
                                        <span className={`text-xs mb-2 ${slot.status === 'occupied' ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {slot.id}
                                        </span>
                                        <svg className={`w-6 h-6 ${selectedSlot === slot.id ? 'text-blue-500' : slot.status === 'occupied' ? 'text-gray-700' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zM17.8 10l-3.5-3.5c-.3-.3-.8-.5-1.3-.5h-2v2h2l2.7 2.7-.7 1.3H13v-2H7v2h2.8l.8 1.6-2.2 2.2c-1-.4-2.1-.6-3.2-.6V16c1 0 1.9.2 2.7.6L10 15l1.3 2.5c.1.3.4.5.7.5h4.6l2.2-4.1c.2-.3.2-.8 0-1.1z"/>
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Reservation Panel */}
            <div className="w-110 bg-black flex items-center justify-center p-8">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 flex flex-col h-full shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-hide">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Reservation</h2>
                        <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.2em]">Secure Checkout</p>
                    </div>

                    <div className="space-y-6 mb-8">
                        {/* Slot Info Card */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Zone {selectedSlot || '---'}</p>
                                <p className="text-sm font-bold text-white uppercase">Bike Slot</p>
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Time Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Start Time</label>
                            <input 
                                type="time" 
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700 uppercase"
                            />
                        </div>

                        {/* Duration Selector */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Duration (Hours)</label>
                                <span className="text-blue-500 font-black text-sm">{duration}h</span>
                            </div>
                            <div className="flex gap-2">
                                {durations.map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => setDuration(h)}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${
                                            duration === h 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
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
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                        paymentMethod === 'card' 
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                                            : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                    </svg>
                                    <span className="text-[8px] font-bold uppercase">Card</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('apple')}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                        paymentMethod === 'apple' 
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                                            : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                    </svg>
                                    <span className="text-[8px] font-bold uppercase">Apple</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('gpay')}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                        paymentMethod === 'gpay' 
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                                            : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                                    </svg>
                                    <span className="text-[8px] font-bold uppercase">GPay</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing and Action */}
                    <div className="pt-6 border-t border-white/10 mt-auto">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Fee</p>
                                <p className="text-4xl font-black text-white tracking-tighter">${totalPrice.toFixed(2)}</p>
                            </div>
                            <p className="text-gray-600 text-[9px] font-bold italic">Incl. Service Tax</p>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!isFormValid || isLoading}
                            className={`
                                w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 transform
                                ${!isFormValid || isLoading 
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                                    : 'bg-[#3b82f6] text-white hover:bg-blue-400 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95'}
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
    )
}

export default BikeBooking