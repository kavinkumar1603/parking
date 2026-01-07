import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingTicket = ({ ticketData, onClose }) => {
    const navigate = useNavigate();

    // Add print styles only once
    useEffect(() => {
        const styleId = 'parking-ticket-print-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @media print {
                    @page {
                        margin: 0.5cm;
                    }
                    
                    body * {
                        visibility: hidden;
                    }
                    
                    #parking-ticket-wrapper,
                    #parking-ticket-wrapper *,
                    #parking-ticket,
                    #parking-ticket * {
                        visibility: visible !important;
                    }
                    
                    #parking-ticket-wrapper {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        background: white !important;
                        padding: 20px !important;
                        display: block !important;
                    }
                    
                    #parking-ticket {
                        position: relative !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 30px !important;
                        background: white !important;
                        color: black !important;
                        border: 2px solid #ddd !important;
                        border-radius: 10px !important;
                        box-shadow: none !important;
                    }
                    
                    #parking-ticket .bg-gradient-to-br,
                    #parking-ticket .bg-linear-to-br {
                        background: white !important;
                    }
                    
                    #parking-ticket .text-white {
                        color: black !important;
                    }
                    
                    #parking-ticket .text-gray-400,
                    #parking-ticket .text-gray-500 {
                        color: #666 !important;
                    }
                    
                    #parking-ticket .text-blue-400,
                    #parking-ticket .text-blue-500 {
                        color: #2563eb !important;
                    }
                    
                    #parking-ticket .border-white\\/10,
                    #parking-ticket .border-white\\/20 {
                        border-color: #ddd !important;
                    }
                    
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    if (!ticketData) return null;

    return (
        <div id="parking-ticket-wrapper" className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div id="parking-ticket" className="relative w-full max-w-md bg-linear-to-br from-zinc-900 to-black border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-white text-sm font-bold print:hidden"
                >
                    ✕
                </button>

                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Parking Pass</p>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">PARK SMART</h2>
                    </div>
                    <div className="text-right text-[10px] text-gray-400 font-bold uppercase">
                        <p>Booking ID</p>
                        <p className="text-xs text-white mt-1">#{ticketData.bookingId?.slice(-6)}</p>
                    </div>
                </div>

                <div className="border-t border-dashed border-white/20 my-4" />

                {/* Location & Slot */}
                <div className="space-y-3 mb-4">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Location</p>
                        <p className="text-sm sm:text-base font-bold">{ticketData.locationName}</p>
                        {ticketData.locationAddress && (
                            <p className="text-xs text-gray-400 mt-1">{ticketData.locationAddress}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Slot</p>
                            <p className="font-bold text-blue-400">{ticketData.parkingSlot}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Vehicle</p>
                            <p className="font-bold">{ticketData.vehicleNumber}</p>
                            <p className="text-[11px] text-gray-400 uppercase">{ticketData.vehicleType}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-white/20 my-4" />

                {/* Time & Price */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Date</p>
                        <p className="font-bold">{ticketData.dateLabel}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Duration</p>
                        <p className="font-bold">{ticketData.durationHours} hour(s)</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Time</p>
                        <p className="font-bold">{ticketData.startTimeLabel} - {ticketData.endTimeLabel}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total</p>
                        <p className="text-lg font-black text-blue-400">₹{ticketData.price?.toFixed(2)}</p>
                    </div>
                </div>

                <div className="border-t border-dashed border-white/20 my-4" />

                {/* User */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Reserved By</p>
                        <p className="font-bold">{ticketData.userName}</p>
                        {ticketData.userEmail && (
                            <p className="text-gray-400">{ticketData.userEmail}</p>
                        )}
                    </div>
                    {ticketData.createdAtLabel && (
                        <div className="text-right text-[10px] text-gray-500 uppercase font-bold">
                            <p>Issued</p>
                            <p className="mt-1 text-[11px] text-gray-300 normal-case">{ticketData.createdAtLabel}</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-col gap-3 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Ticket
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 rounded-full border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingTicket;
