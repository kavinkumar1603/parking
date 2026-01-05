import login from '../assets/login.jpg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
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
    }

    const handleClick = () => {
        navigate('/signup');
    }

    return (
        <div className="flex h-screen">
            {/* Left Half - Image */}
            <div 
                style={{ backgroundImage: `url(${login})` }}
                className="w-1/2 bg-cover bg-center relative"
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex h-full items-center justify-center px-12">
                    <div className="text-white mt-90">
                        <h1 className="text-6xl font-bold mb-6">PARK SMART</h1>
                        <p className="text-xl">Your hassle-free parking solution. Sign in to manage your spots.</p>
                    </div>
                </div>
            </div>

            {/* Right Half - Form */}
            <div className="w-1/2 flex items-center justify-center bg-gray-200 px-12">
                <div className="w-full max-w-md">
                    <h2 className="text-4xl font-bold mb-3">WELCOME BACK</h2>
                    <p className="text-gray-400 mb-12">Please enter your details to sign in.</p>

                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="mb-8">
                            <label className="block text-xs font-medium text-gray-400 mb-3">EMAIL ADDRESS</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-medium text-gray-400 mb-3">PASSWORD</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent"
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
                            className="w-full bg-blue-600 text-white py-4 font-bold text-sm hover:bg-blue-700 mb-8"
                        >
                            LOG IN
                        </button>

                        <p className="text-center text-xs text-gray-500">
                            DON'T HAVE AN ACCOUNT? <a href="#" className="font-bold text-black hover:underline" onClick={handleClick} >SIGN UP</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
