import login from '../assets/login.jpg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const SignUp = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/parking-selection');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Server error');
        }
    };

    const handleClick = () => {
        navigate('/login');
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">

            {/* Left Half - Image */}
            <div 
                style={{ backgroundImage: `url(${login})` }}
                className="w-full md:w-1/2 min-h-[40vh] md:min-h-screen bg-cover bg-center relative"
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex h-full items-center justify-center px-6 sm:px-12 py-8">
                    <div className="text-white text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">PARK SMART</h1>
                        <p className="text-base sm:text-lg md:text-xl">Your hassle-free parking solution. Sign in to manage your spots.</p>
                    </div>
                </div>
            </div>

            {/* Right Half - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-200 px-6 sm:px-8 md:px-12 py-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">WELCOME BACK</h2>
                    <p className="text-gray-400 mb-6 sm:mb-8 md:mb-12 text-sm sm:text-base">Please enter your details to sign in.</p>

                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="mb-5 sm:mb-8">
                            <label className="block text-xs font-medium text-gray-400 mb-3">UserName</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                className="w-full py-3 sm:py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-base"
                            />
                        </div>
                    
                        <div className="mb-5 sm:mb-8">
                            <label className="block text-xs font-medium text-gray-400 mb-2 sm:mb-3">EMAIL ADDRESS</label>
                            <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                                className="w-full py-3 sm:py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-base"
                            />
                        </div>

                        <div className="mb-5 sm:mb-8">
                            <label className="block text-xs font-medium text-gray-400 mb-2 sm:mb-3">PASSWORD</label>
                            <input 
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                                className="w-full py-3 sm:py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-base"
                            />
                        </div>

                        <div className="mb-5 sm:mb-8">
                            <label className="block text-xs font-medium text-gray-400 mb-2 sm:mb-3">PHONE NUMBER</label>
                            <input 
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                required
                                className="w-full py-3 sm:py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-base"
                            />
                        </div>

                        <div className="flex items-center justify-between mb-10">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2 w-4 h-4" />
                                <span className="text-xs font-medium text-gray-600">REMEMBER ME</span>
                            </label>
                            <a href="#" className="text-xs font-bold hover:underline">FORGOT PASSWORD?</a>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 sm:py-4 font-bold text-sm hover:bg-gray-800 active:bg-gray-900 mb-6 sm:mb-8 touch-manipulation transition-colors"
                        >
                            SIGN UP
                        </button>

                        <p className="text-center text-xs text-gray-500">
                            Already have an account? <a href="#" className="font-bold text-black hover:underline" onClick={handleClick} >LOG IN</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp
