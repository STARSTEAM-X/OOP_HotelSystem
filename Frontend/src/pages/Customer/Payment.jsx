import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Payment() {
    const navigate = useNavigate();
    const { booking_id } = useParams();

    const [bookingDetails, setBookingDetails] = useState(null);
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const { data } = await axios.get(`http://127.0.0.1:5000/api/booking/payment/${booking_id}`);
                setBookingDetails(data);
                setAmount(data.final_price);
            } catch (error) {
                setErrorMessage("Failed to fetch booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [booking_id]);

    const handlePaymentConfirm = useCallback(() => {
        if (!bookingDetails) return;

        if (!amount || parseFloat(amount) < bookingDetails.final_price) {
            setErrorMessage(`❌ Please enter at least $${bookingDetails.final_price}`);
            return;
        }

        setIsProcessing(true);
        setErrorMessage("");

        const paymentMethodMap = {
            credit_card: "Credit Card",
            bank_transfer: "Bank Transfer",
            cash: "Cash",
        };

        axios.post("http://localhost:5000/api/booking_payment", {
            username: localStorage.getItem("username"),
            book_id: booking_id,
            amount: parseFloat(amount),
            payment_method: paymentMethodMap[paymentMethod],
        })
            .then(() => {
                setIsModalOpen(false);
                navigate(`/invoice/${booking_id}`);
            })
            .catch(() => {
                setErrorMessage("❌ Payment failed. Please try again.");
            })
            .finally(() => {
                setIsProcessing(false);
            });

    }, [amount, bookingDetails, booking_id, navigate, paymentMethod]);

    if (loading) return <p className="text-center text-gray-700">Loading payment details...</p>;

    if (!bookingDetails || !bookingDetails.room?.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">No Booking Found</h2>
                <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="mt-6 w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">💳 Payment</h1>
                <p className="text-lg mb-4 text-gray-700"><strong>📅 Stay:</strong> {bookingDetails.check_in} → {bookingDetails.check_out}</p>

                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Booking</h2>
                {bookingDetails.room.map((room) => (
                    <div key={room.id} className="flex items-center border-b py-4">
                        <img src={room.image} alt={room.type} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-800">{room.id + " : " + room.type}</h3>
                            <p className="text-gray-600">
                                Price per Night: ${room.price}
                                {bookingDetails.day > 1 && ` | ${bookingDetails.day} Night: $${room.price * bookingDetails.day}`}
                            </p>
                        </div>
                    </div>
                ))}

                <div className="mt-6 text-lg font-semibold text-gray-800">
                    <p>Total: <span className="text-blue-500">${bookingDetails.final_price}</span></p>
                    {bookingDetails.discount > 0 && <p className="text-green-600">✅ Discount Applied: -${bookingDetails.discount}</p>}
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-green-500 text-white text-xl rounded-lg shadow hover:bg-green-600 transition-all duration-300"
                        aria-label="Open Payment Modal"
                    >
                        Pay Now
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter Payment Details</h2>

                        <label className="block text-gray-700 font-medium mb-2">Amount</label>
                        <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                            <input
                                type="number"
                                value={amount}
                                readOnly
                                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

                        <label className="block text-gray-700 font-medium mt-4 mb-2">Payment Method</label>
                        <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm border-none"
                            >
                                <option value="credit_card">Credit Card</option>
                                <option value="cash">Cash</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                className={`px-4 py-2 text-white rounded-lg transition-all duration-300 ${isProcessing ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
                                disabled={isProcessing}
                                aria-label="Confirm Payment"
                            >
                                {isProcessing ? "Processing..." : "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}