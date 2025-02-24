import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve booking details from navigation state
    const { selectedRooms, startDate, endDate, discountAmount, totalAmount } = location.state || {};

    // State management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState(totalAmount || ""); // Default to totalAmount
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // If no booking found, redirect to home
    if (!selectedRooms || selectedRooms.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">No Booking Found</h2>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Go Home
                </button>
            </div>
        );
    }

    // Handle payment confirmation
    const handlePaymentConfirm = () => {
        if (!amount || parseFloat(amount) < totalAmount) {
            setErrorMessage(`❌ Please enter at least $${totalAmount}`);
            return;
        }

        setIsProcessing(true);
        setErrorMessage("");

        setTimeout(() => {
            navigate("/invoice", {
                state: {
                    selectedRooms,
                    startDate,
                    endDate,
                    amount,
                    paymentMethod,
                    discountAmount,
                    totalAmount
                },
            });
        }, 2000); // Simulate processing delay
    };

    return (
        <div className="min-h-screen p-6 flex flex-col items-center">


            <div className="mt-6 w-full max-w-3xl bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">💳 Payment</h1>

                <p className="text-lg">📅 Stay: {startDate} → {endDate}</p>
                <h2 className="text-xl font-semibold mb-4">Your Booking</h2>
                {selectedRooms.map((room) => (
                    <div key={room.id} className="flex items-center border-b py-3">
                        <img src={room.image} alt={room.name} className="w-16 h-16 rounded-md object-cover" />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium">{room.name}</h3>
                        </div>
                    </div>
                ))}

                <div className="mt-4 text-lg font-semibold">
                    <p>Total: <span className="text-blue-500">${totalAmount}</span></p>
                    {discountAmount > 0 && <p className="text-green-600">✅ Discount Applied: -${discountAmount}</p>}
                </div>
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
                Pay Now
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/80"
                    onClick={() => setIsModalOpen(false)} // Close modal if background is clicked
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-96"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <h2 className="text-xl font-semibold mb-4">Enter Payment Details</h2>

                        <label className="block mb-2 text-gray-700">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            min={totalAmount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg mb-4"
                            placeholder="Enter amount"
                        />
                        {errorMessage && <p className="text-red-500 mt-2" aria-live="polite">{errorMessage}</p>}

                        <label className="block mb-2 text-gray-700">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg mb-4"
                        >
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                className={`px-4 py-2 text-white rounded-lg ${isProcessing ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
                                disabled={isProcessing}
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
