import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRooms, startDate, endDate } = location.state || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [isProcessing, setIsProcessing] = useState(false);

    if (!selectedRooms || selectedRooms.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">No Booking Found</h2>
                <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Go Home
                </button>
            </div>
        );
    }

    const handlePaymentConfirm = () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("❌ Please enter a valid amount.");
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            alert(`✅ Payment Successful! 🎉 Amount: ${amount} - Method: ${paymentMethod}`);
            setIsModalOpen(false);
            setIsProcessing(false);
            navigate("/");
        }, 2000); // Simulate processing delay
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Payment</h1>

            <p className="text-lg">📅 Stay: {startDate} → {endDate}</p>

            <div className="mt-6 w-full max-w-3xl bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Your Booking</h2>
                {selectedRooms.map((room) => (
                    <div key={room.id} className="flex items-center border-b py-3">
                        <img src={room.image} alt={room.name} className="w-16 h-16 rounded-md object-cover" />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium">{room.name}</h3>
                        </div>
                    </div>
                ))}
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
                    onClick={() => setIsModalOpen(false)} // Close when clicking outside
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <h2 className="text-xl font-semibold mb-4">Enter Payment Details</h2>

                        <label className="block mb-2 text-gray-700">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            min={1}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg mb-4"
                            placeholder="Enter amount"
                        />

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
