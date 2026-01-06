import { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate, useParams } from 'react-router-dom';

const MapView = () => {
    const { vehicleType } = useParams();
    const [userLocation, setUserLocation] = useState(null);
    const [parkingLocations, setParkingLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // const mapStyles = {
    //     height: "100vh",
    //     width: "100%",
    //     minHeight: "400px"
    // };

    // const defaultCenter = {
    //     lat: 11.0168,
    //     lng: 76.9558
    // };

    // // Get user's current location
    // useEffect(() => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const location = {
    //                     lat: position.coords.latitude,
    //                     lng: position.coords.longitude
    //                 };
    //                 setUserLocation(location);
    //                 fetchNearbyLocations(location);
    //             },
    //             (error) => {
    //                 console.error('Error getting location:', error);
    //                 // Use default location if user denies
    //                 setUserLocation(defaultCenter);
    //                 fetchNearbyLocations(defaultCenter);
    //             }
    //         );
    //     } else {
    //         setUserLocation(defaultCenter);
    //         fetchNearbyLocations(defaultCenter);
    //     }
    // }, []);

    // Fetch nearby parking locations
    const fetchNearbyLocations = async (location) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/locations/nearby?lat=${location.lat}&lng=${location.lng}&radius=10`
            );
            const data = await response.json();
            if (response.ok) {
                setParkingLocations(data.locations);
            }
        } catch (err) {
            console.error('Error fetching locations:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle marker click
    const handleMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    // Navigate to slot selection
    const handleSelectLocation = () => {
        if (selectedLocation) {
            navigate(`/slots/${selectedLocation._id}`, {
                state: { location: selectedLocation, vehicleType }
            });
        }
    };

    // Temporary: Fetch locations without map
    useEffect(() => {
        const mockLocation = { lat: 11.0168, lng: 76.9558 };
        fetchNearbyLocations(mockLocation);
    }, []);

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <p className="text-white text-xl">Loading locations...</p>
            </div>
        );
    }

    return (
        <div className="relative h-screen bg-black">
            {/* TEMPORARY: Map functionality commented out */}
            {/* <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"}>
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={userLocation || defaultCenter}
                >
                    {userLocation && window.google && (
                        <Marker
                            position={userLocation}
                            icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "#ffffff",
                                strokeWeight: 2
                            }}
                        />
                    )}

                    {parkingLocations.map((location) => (
                        <Marker
                            key={location._id}
                            position={location.coordinates}
                            onClick={() => handleMarkerClick(location)}
                            icon={{
                                url: vehicleType === 'car' 
                                    ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                    : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            }}
                        />
                    ))}

                    {selectedLocation && (
                        <InfoWindow
                            position={selectedLocation.coordinates}
                            onCloseClick={() => setSelectedLocation(null)}
                        >
                            <div className="p-2 max-w-[280px] sm:max-w-none">
                                <h3 className="font-bold text-base sm:text-lg">{selectedLocation.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-600">{selectedLocation.address}</p>
                                <p className="text-xs sm:text-sm mt-2">Distance: {selectedLocation.distance}</p>
                                <p className="text-xs sm:text-sm">
                                    Available {vehicleType} slots: {selectedLocation.totalSlots[vehicleType]}
                                </p>
                                <p className="text-xs sm:text-sm font-bold mt-1">
                                    ₹{selectedLocation.pricePerHour[vehicleType]}/hour
                                </p>
                                <button
                                    onClick={handleSelectLocation}
                                    className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 text-sm sm:text-base touch-manipulation transition-colors"
                                >
                                    View Slots
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript> */}

            {/* TEMPORARY: List view of locations */}
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto h-full">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-500 mb-4 hover:underline"
                    >
                        ← Back
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {vehicleType.toUpperCase()} Parking Locations
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {parkingLocations.length} locations available
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {parkingLocations.map((location) => (
                        <div key={location._id} className="bg-zinc-900 rounded-xl p-4 sm:p-6 hover:bg-zinc-800 transition-colors">
                            <h3 className="font-bold text-lg text-white mb-2">{location.name}</h3>
                            <p className="text-sm text-gray-400 mb-3">{location.address}</p>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm text-gray-300">
                                    Available {vehicleType} slots: {location.totalSlots?.[vehicleType] || 0}
                                </p>
                                <p className="text-sm font-bold text-blue-500">
                                    ₹{location.pricePerHour?.[vehicleType] || 0}/hour
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/slots/${location._id}`, {
                                    state: { location, vehicleType }
                                })}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors touch-manipulation"
                            >
                                View Slots
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Header overlay */}
            {/* <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/80 text-white p-3 sm:p-4 rounded-lg max-w-[90vw] sm:max-w-none z-10">
                <h2 className="text-base sm:text-lg md:text-xl font-bold">
                    {vehicleType.toUpperCase()} Parking
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                    {parkingLocations.length} locations nearby
                </p>
            </div> */}
        </div>
    );
};

export default MapView;
