import { useLocation, useNavigate } from "react-router-dom";

export default function Invoice() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRooms, startDate, endDate, amount, paymentMethod } = location.state || {};

    if (!selectedRooms || !amount) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">No Invoice Found</h2>
                <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">🧾 Invoice</h1>

            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                <p className="text-lg">📅 Stay: {startDate} → {endDate}</p>

                <div className="mt-4">
                    {selectedRooms.map((room) => (
                        <div key={room.id} className="flex items-center border-b py-3">
                            <img src={room.image} alt={room.name} className="w-16 h-16 rounded-md object-cover" />
                            <div className="ml-4">
                                <h3 className="text-lg font-medium">{room.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-lg">
                    <p>💰 Amount Paid: <strong>${amount}</strong></p>
                    <p>💳 Payment Method: <strong>{paymentMethod.replace("_", " ")}</strong></p>
                </div>
            </div>

            <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
                Back to Home
            </button>
        </div>
    );
}
