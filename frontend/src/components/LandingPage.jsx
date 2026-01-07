import landing from '../assets/landing1.jpg'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {

    const navigate = useNavigate();
        const handleGetStartedClick = () => {
            navigate('/login');
        }

    return (
        <div
            style={{ backgroundImage: `url(${landing})` }}
            className="relative min-h-screen h-screen bg-cover bg-center"
        >
            <div className="absolute inset-0 bg-black/80" />
            <div className="relative z-10 flex h-full items-center justify-end px-4 sm:px-8 md:px-12">
                <div className="text-right text-white max-w-full">
                    <h1 className="mb-4 text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-extrabold leading-tight">
                        Smart Parking <br/> Made Simple
                    </h1>
                    <p className="mb-6 text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed">
                        smart parking leads you straight to an available spot <br className="hidden sm:block"/> saving time, fuel, and frustration.</p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end sm:justify-end">
                            <button
                                className="rounded-full bg-blue-600 px-6 py-3 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold text-white hover:bg-blue-700 active:scale-95 transition-transform touch-manipulation"
                                onClick={handleGetStartedClick}
                            >
                                Get Started
                            </button>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage  