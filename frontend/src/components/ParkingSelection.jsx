import { useNavigate } from 'react-router-dom'

const ParkingSelection = () => {

    const navigate = useNavigate();
    
    const handlecar = () => {
        navigate('/car-booking');
    }
    const handlebike = () => {
        navigate('/bike-shopping');
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-8">
            <div className="max-w-5xl w-full text-center">
                {/* Heading */}
                <h1 className="text-7xl font-extrabold text-white mb-2">
                    SMART PARKING
                </h1>
                <h2 className="text-7xl font-extrabold text-blue-500 mb-6">
                    MADE SIMPLE
                </h2>
                
                {/* Description */}
                <p className="text-gray-400 text-lg mb-16">
                    Find available parking slots in real time and save your time effortlessly.
                </p>

                {/* Vehicle Selection Cards */}
                <div className="flex gap-8 justify-center mb-12">
                    {/* Car Card */}
                    <div className="bg-zinc-900 rounded-3xl p-12 w-96 cursor-pointer hover:bg-zinc-800 transition" onClick={handlecar}>
                        <div className="bg-blue-800 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">CAR</h3>
                    </div>

                    {/* Bike Card */}
                    <div className="bg-zinc-900 rounded-3xl p-12 w-96 cursor-pointer hover:bg-zinc-800 transition" onClick={handlebike}>
                        <div className="bg-blue-800 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zM17.8 10l-3.5-3.5c-.3-.3-.8-.5-1.3-.5h-2v2h2l2.7 2.7-.7 1.3H13v-2H7v2h2.8l.8 1.6-2.2 2.2c-1-.4-2.1-.6-3.2-.6V16c1 0 1.9.2 2.7.6L10 15l1.3 2.5c.1.3.4.5.7.5h4.6l2.2-4.1c.2-.3.2-.8 0-1.1z"/>
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">BIKE</h3>
                    </div>
                </div>

                {/* Bottom Text */}
                <p className="text-gray-600 text-sm font-medium tracking-wider">
                    SELECT VEHICLE TYPE TO BEGIN
                </p>
            </div>
        </div>
    )
}

export default ParkingSelection