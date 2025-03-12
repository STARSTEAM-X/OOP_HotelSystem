import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Invoice() {
    const { booking_id } = useParams();
    const navigate = useNavigate();

    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/booking/invoice/${booking_id}`)
            .then(({ data }) => {
                setBookingDetails(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching booking details:", error);
                setLoading(false);
            });
    }, [booking_id]);

    if (loading) return <p className="text-center">Loading invoice details...</p>;

    if (!bookingDetails) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">No Invoice Found</h2>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">🧾 Invoice</h1>

                <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">Booking Summary</h2>
                    <p className="text-lg mt-2">📅 Stay: <strong>{bookingDetails.check_in}</strong> → <strong>{bookingDetails.check_out}</strong></p>
                </div>

                <div className="mt-4">
                    {bookingDetails.room.map((room) => (
                        <div key={room.id} className="flex items-center border-b py-3">
                            <img
                                src={room.image}
                                alt={room.type}
                                className="w-16 h-16 rounded-md object-cover border"
                            />
                            <div className="ml-4">
                                <h3 className="text-lg font-medium">{room.id + " : " + room.type}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-lg">
                    <p>💰 Amount Paid: <strong className="text-green-600">${bookingDetails.final_price}</strong></p>
                    <p>💰 Discount : <strong className="text-green-600">${bookingDetails.discount}</strong></p>
                    <p>💳 Payment Method: <strong className="capitalize">{bookingDetails.payment_method}</strong></p>
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}