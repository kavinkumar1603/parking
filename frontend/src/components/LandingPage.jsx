import landing from '../assets/landing1.jpg'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {

    const navigate = useNavigate();
    const handlesubmit = () => {
        navigate('/login');
    }

    return (
        <div
            style={{ backgroundImage: `url(${landing})` }}
            className="relative h-screen bg-cover bg-center"
        >
            <div className="absolute inset-0 bg-black/80" />
            <div className="relative z-10 flex h-full items-center justify-end px-8">
                <div className="text-right text-white">
                    <h1 className="mb-4 text-8xl font-extrabold leading-tight">
                        Smart Parking <br/> Made Simple
                    </h1>
                    <p className="mb-6 text-2xl">
                        smart parking leads you straight to an available spot <br/> saving time, fuel, and frustration.</p>
                    <button className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700" onClick={handlesubmit}>
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage  