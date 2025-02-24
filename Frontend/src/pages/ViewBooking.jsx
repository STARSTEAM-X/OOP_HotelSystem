import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewBooking() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        setBookings(savedBookings);
    }, []);

    const handleCancelBooking = (index) => {
        const updatedBookings = bookings.filter((_, i) => i !== index);
        setBookings(updatedBookings);
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    };

    const handleProceedToPayment = (booking) => {
        navigate("/payment", { state: booking });
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">📜 Your Bookings</h1>

            {bookings.length === 0 ? (
                <p className="text-gray-600">No bookings found.</p>
            ) : (
                <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow">
                    {bookings.map((booking, index) => (
                        <div key={index} className="border-b py-4">
                            <h2 className="text-lg font-semibold">📅 {booking.startDate} → {booking.endDate}</h2>
                            <ul className="mt-2">
                                {booking.selectedRooms.map((room) => (
                                    <li key={room.id} className="flex items-center gap-4">
                                        <img src={room.image} alt={room.name} className="w-16 h-16 rounded-md object-cover" />
                                        <span className="font-medium">{room.name}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleProceedToPayment(booking)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Pay Now
                                </button>
                                <button
                                    onClick={() => handleCancelBooking(index)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
