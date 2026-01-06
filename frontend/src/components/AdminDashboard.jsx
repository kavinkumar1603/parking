import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.isAdmin) {
            navigate('/');
            return;
        }
        fetchData();
    }, [navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            if (activeTab === 'dashboard') {
                const res = await fetch('http://localhost:3000/api/admin/stats', { headers });
                if (!res.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await res.json();
                setStats(data);
            } else if (activeTab === 'bookings') {
                const res = await fetch(`http://localhost:3000/api/admin/bookings?page=${currentPage}&status=${filterStatus}&search=${searchTerm}`, { headers });
                if (!res.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await res.json();
                setBookings(data.bookings || []);
            } else if (activeTab === 'users') {
                const res = await fetch(`http://localhost:3000/api/admin/users?page=${currentPage}&search=${searchTerm}`, { headers });
                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await res.json();
                setUsers(data.users || []);
            } else if (activeTab === 'locations') {
                const res = await fetch('http://localhost:3000/api/admin/locations', { headers });
                if (!res.ok) {
                    throw new Error('Failed to fetch locations');
                }
                const data = await res.json();
                setLocations(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error loading data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/admin/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/admin/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-zinc-900 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Admin Panel</h1>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Management Dashboard</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-sm transition touch-manipulation"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-zinc-900/50 border-b border-white/10 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2 overflow-x-auto py-3">
                        {['dashboard', 'bookings', 'users', 'locations'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition whitespace-nowrap touch-manipulation ${
                                    activeTab === tab
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Dashboard Tab */}
                        {activeTab === 'dashboard' && stats && (
                            <div className="space-y-6">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</p>
                                        <p className="text-3xl font-black text-blue-500">{stats.totalBookings || 0}</p>
                                    </div>
                                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Active Bookings</p>
                                        <p className="text-3xl font-black text-green-500">{stats.activeBookings || 0}</p>
                                    </div>
                                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Users</p>
                                        <p className="text-3xl font-black text-purple-500">{stats.totalUsers || 0}</p>
                                    </div>
                                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</p>
                                        <p className="text-3xl font-black text-yellow-500">₹{(stats.totalRevenue || 0).toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Additional Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Completed</p>
                                        <p className="text-2xl font-black">{stats.completedBookings || 0}</p>
                                    </div>
                                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Cancelled</p>
                                        <p className="text-2xl font-black text-red-500">{stats.cancelledBookings || 0}</p>
                                    </div>
                                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Locations</p>
                                        <p className="text-2xl font-black">{stats.totalLocations || 0}</p>
                                    </div>
                                </div>

                                {/* Recent Bookings */}
                                <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-lg font-black uppercase mb-4">Recent Bookings</h3>
                                    {(stats.recentBookings && stats.recentBookings.length > 0) ? (
                                        <div className="space-y-3">
                                            {stats.recentBookings.map((booking) => (
                                                <div key={booking._id} className="flex justify-between items-center p-4 bg-black rounded-lg">
                                                    <div>
                                                        <p className="font-bold">{booking.userId?.name}</p>
                                                        <p className="text-sm text-gray-500">{booking.vehicleNumber} • {booking.parkingSlot}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-blue-500">₹{booking.totalPrice}</p>
                                                        <span className={`text-xs px-2 py-1 rounded ${
                                                            booking.status === 'active' ? 'bg-green-500/20 text-green-500' :
                                                            booking.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                                                            'bg-red-500/20 text-red-500'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No recent bookings available</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bookings Tab */}
                        {activeTab === 'bookings' && (
                            <div className="space-y-4">
                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        placeholder="Search by vehicle number or slot..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="reserved">Active</option>
                                        <option value="open">Completed</option>
                                    </select>
                                    <button
                                        onClick={fetchData}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition touch-manipulation"
                                    >
                                        Search
                                    </button>
                                </div>

                                {/* Bookings List */}
                                <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-black">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">User</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Vehicle</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Slot</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Duration</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Price</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {bookings.length > 0 ? (
                                                    bookings.map((booking) => (
                                                        <tr key={booking._id} className="hover:bg-black/50">
                                                            <td className="px-4 py-3">
                                                                <p className="font-bold text-sm">{booking.userId?.name || 'N/A'}</p>
                                                                <p className="text-xs text-gray-500">{booking.userId?.email || 'N/A'}</p>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <p className="font-bold text-sm">{booking.vehicleNumber}</p>
                                                                <p className="text-xs text-gray-500">{booking.vehicleType}</p>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <p className="font-bold text-sm">{booking.parkingSlot}</p>
                                                                <p className="text-xs text-gray-500">{booking.locationId?.name || 'N/A'}</p>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">{booking.duration}h</td>
                                                            <td className="px-4 py-3 font-bold text-blue-500">₹{booking.totalPrice ?? booking.price ?? 0}</td>
                                                            <td className="px-4 py-3">
                                                                <select
                                                                    value={booking.status}
                                                                    onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                                    className={`text-xs px-2 py-1 rounded font-bold bg-transparent border ${
                                                                        booking.status === 'reserved' ? 'border-green-500 text-green-500' :
                                                                        booking.status === 'open' ? 'border-blue-500 text-blue-500' :
                                                                        'border-red-500 text-red-500'
                                                                    }`}
                                                                >
                                                                    <option value="reserved">Active</option>
                                                                    <option value="open">Completed</option>
                                                                </select>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <button
                                                                    onClick={() => handleDeleteBooking(booking._id)}
                                                                    className="text-red-500 hover:text-red-400 font-bold text-xs touch-manipulation"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                                                            No bookings found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && fetchData()}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <div key={user._id} className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="font-black text-lg">{user.name}</p>
                                                        {user.isAdmin && (
                                                            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-bold">ADMIN</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-gray-400">📧 {user.email}</p>
                                                    <p className="text-gray-400">📱 {user.phone}</p>
                                                    <p className="text-gray-500 text-xs">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-12 col-span-full">No users found</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Locations Tab */}
                        {activeTab === 'locations' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {locations.length > 0 ? (
                                    locations.map((location) => (
                                        <div key={location._id} className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-black text-xl mb-2">{location.name}</h3>
                                            <p className="text-gray-400 text-sm mb-4">{location.address}</p>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase">Car Slots</p>
                                                    <p className="font-bold text-lg">{location.carSlots || 36}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase">Bike Slots</p>
                                                    <p className="font-bold text-lg">{location.bikeSlots || 72}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase">Car Price</p>
                                                    <p className="font-bold text-blue-500">₹{location.carPricePerHour}/hr</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase">Bike Price</p>
                                                    <p className="font-bold text-blue-500">₹{location.bikePricePerHour}/hr</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-12 col-span-full">No locations found</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
