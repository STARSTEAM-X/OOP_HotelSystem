import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export default function Booking() {
    const navigate = useNavigate();
    const { booking_id } = useParams();

    const [bookingDetails, setBookingDetails] = useState(null);
    const [discountCode, setDiscountCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/booking/${booking_id}`)
            .then(({ data }) => {
                setBookingDetails(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching booking details:", error);
                setLoading(false);
            });
    }, [booking_id]);

    const applyDiscount = useCallback(() => {
        if (!discountCode.trim()) return;

        axios.post("http://127.0.0.1:5000/api/use_discount", {
            username: localStorage.getItem("username"),
            book_id: booking_id,
            discount_code: discountCode.trim(),
        })
            .then(({ data }) => {
                setBookingDetails((prev) => ({
                    ...prev,
                    discount: data.discount,
                    final_price: data.final_price,
                }));
                setErrorMessage("");
            })
            .catch(() => {
                setErrorMessage("❌ Invalid Discount Code");
                setBookingDetails((prev) => ({
                    ...prev,
                    discount: 0,
                    final_price: prev.price,
                }));
            });
    }, [booking_id, discountCode]);

    const handleConfirmBooking = useCallback(() => {
        axios.post("http://127.0.0.1:5000/api/confirm_booking", {
            username: localStorage.getItem("username"),
            book_id: booking_id,
        })
            .then(() => navigate(`/payment/${booking_id}`))
            .catch(() => alert("Failed to confirm booking. Please try again."));
    }, [bookingDetails, booking_id, navigate]);

    if (loading) return <p className="text-center text-gray-700">Loading booking details...</p>;

    if (!bookingDetails || !bookingDetails.room?.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">No Rooms Selected</h2>
                <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Confirm Booking</h1>
                <p className="text-lg mb-4 text-gray-700">📅 Stay: <span className="font-medium">{bookingDetails.check_in} → {bookingDetails.check_out}</span></p>

                {bookingDetails.room.map((room) => (
                    <div key={room.id} className="flex items-center border-b py-4">
                        <img src={room.image} alt={room.type} className="w-20 h-20 rounded-md object-cover" />
                        <div className="ml-6">
                            <h3 className="text-lg font-semibold text-gray-800">{room.id + " : " + room.type}</h3>
                            <p className="text-gray-700">
                                Price for 1 Night: <span className="font-medium">${room.price}</span>
                                {bookingDetails.day > 1 && ` | ${bookingDetails.day} Nights: $${room.price * bookingDetails.day}`}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Discount Code Section */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">Discount Code</label>
                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            placeholder="Enter discount code"
                        />
                        <button
                            onClick={applyDiscount}
                            className={`ml-3 px-4 py-2 ${discountCode.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"} text-white rounded-lg transition duration-300`}
                            disabled={!discountCode.trim()}
                        >
                            <FaCheckCircle size={20} />
                        </button>
                    </div>
                    {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                    {bookingDetails.discount > 0 && <p className="text-green-600 mt-2">✅ Applied: -${bookingDetails.discount}</p>}
                </div>

                {/* Total Amount */}
                <div className="mt-6 text-lg font-semibold text-gray-800">
                    <p>Total: <span className="text-blue-500">${bookingDetails.final_price}</span></p>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleConfirmBooking}
                        className="px-8 py-4 bg-green-500 text-white text-lg rounded-lg shadow hover:bg-green-600 transition duration-300"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
}