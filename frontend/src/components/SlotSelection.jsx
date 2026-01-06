import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const SlotSelection = () => {
    const { locationId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { location: parkingLocation, vehicleType } = location.state || {};
    
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [duration, setDuration] = useState(1);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);

    const durations = [1, 2, 4, 8, 12, 24];
    const pricePerHour = parkingLocation?.pricePerHour[vehicleType] || (vehicleType === 'car' ? 40 : 20);
    const totalPrice = duration * pricePerHour;

    // Fetch available slots
    useEffect(() => {
        fetchSlots();
        const interval = setInterval(fetchSlots, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [locationId, vehicleType]);

    const fetchSlots = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/locations/${locationId}/slots?vehicleType=${vehicleType}`
            );
            const data = await response.json();
            if (response.ok) {
                setSlots(data.slots);
            }
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedSlot || !vehicleNumber) {
            alert('Please select a slot and enter vehicle number');
            return;
        }

        setIsBooking(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/locations/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    locationId,
                    slotId: selectedSlot.slotId,
                    vehicleType,
                    vehicleNumber: vehicleNumber.toUpperCase(),
                    duration
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`✓ Booking Confirmed!\n\nSlot: ${data.booking.slotId}\nPrice: ${data.booking.price}\nDuration: ${data.booking.duration}`);
                navigate('/parking-selection');
            } else {
                alert('Booking failed: ' + data.message);
            }
        } catch (err) {
            alert('Server error. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <p className="text-white text-xl">Loading slots...</p>
            </div>
        );
    }

    const openSlots = slots.filter(s => s.status === 'open');
    const reservedSlots = slots.filter(s => s.status === 'reserved');

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 mb-3 sm:mb-4 hover:underline text-sm sm:text-base touch-manipulation"
                >
                    ← Back to Map
                </button>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    {parkingLocation?.name || 'Parking Location'}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">{parkingLocation?.address}</p>
                <p className="text-base sm:text-lg mt-2">
                    {vehicleType.toUpperCase()} Parking - ₹{pricePerHour}/hour
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Slot Grid */}
                <div className="lg:col-span-2 bg-zinc-900 rounded-3xl p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                        <h2 className="text-xl sm:text-2xl font-bold">Available Slots</h2>
                        <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                <span>Open</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                                <span>Reserved</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                        {slots.map((slot) => (
                            <div
                                key={slot.slotId}
                                onClick={() => slot.status === 'open' && setSelectedSlot(slot)}
                                className={`
                                    aspect-square rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center cursor-pointer transition touch-manipulation
                                    ${selectedSlot?.slotId === slot.slotId ? 'bg-blue-500/20 border-2 border-blue-500' :
                                      slot.status === 'reserved' ? 'bg-zinc-800 cursor-not-allowed opacity-50' :
                                      'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600'}
                                `}
                            >
                                <span className="text-[10px] sm:text-xs font-bold">{slot.slotId}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-sm text-gray-400">
                        {openSlots.length} of {slots.length} slots available
                    </div>
                </div>

                {/* Booking Panel */}
                <div className="bg-zinc-900 rounded-3xl p-4 sm:p-6 h-fit">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Book Slot</h2>

                    {/* Selected Slot */}
                    <div className="mb-3 sm:mb-4 p-3 bg-black rounded-lg">
                        <p className="text-xs text-gray-400">Selected Slot</p>
                        <p className="text-base sm:text-lg font-bold">
                            {selectedSlot?.slotId || 'None'}
                        </p>
                    </div>

                    {/* Vehicle Number */}
                    <div className="mb-3 sm:mb-4">
                        <label className="text-xs text-gray-400 block mb-2">Vehicle Number</label>
                        <input
                            type="text"
                            placeholder="TN01AB1234"
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white uppercase focus:outline-none focus:border-blue-500 text-base"
                        />
                    </div>

                    {/* Duration */}
                    <div className="mb-3 sm:mb-4">
                        <label className="text-xs text-gray-400 block mb-2">Duration (Hours)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {durations.map((h) => (
                                <button
                                    key={h}
                                    onClick={() => setDuration(h)}
                                    className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition touch-manipulation ${
                                        duration === h
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-black text-gray-400 hover:bg-zinc-800 active:bg-zinc-700'
                                    }`}
                                >
                                    {h}h
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-black rounded-lg">
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="text-2xl sm:text-3xl font-black text-blue-500">₹{totalPrice}</p>
                        <p className="text-xs text-gray-500 mt-1">{duration} hour(s) × ₹{pricePerHour}</p>
                    </div>

                    {/* Book Button */}
                    <button
                        onClick={handleBooking}
                        disabled={!selectedSlot || !vehicleNumber || isBooking}
                        className={`w-full py-3 sm:py-4 rounded-full font-bold uppercase transition text-sm sm:text-base touch-manipulation ${
                            !selectedSlot || !vehicleNumber || isBooking
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                        }`}
                    >
                        {isBooking ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotSelection;
