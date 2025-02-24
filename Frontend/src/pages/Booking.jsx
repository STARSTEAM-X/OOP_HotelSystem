import { useLocation, useNavigate } from "react-router-dom";

export default function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRooms, startDate, endDate } = location.state || {};

    if (!selectedRooms || selectedRooms.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">No Rooms Selected</h2>
                <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Go Back
                </button>
            </div>
        );
    }

    const handleConfirmBooking = () => {
        navigate("/payment", {
            state: { selectedRooms, startDate, endDate }
        });
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Confirm Booking</h1>
            <p className="text-lg">📅 Stay: {startDate} → {endDate}</p>

            <div className="mt-6 w-full max-w-3xl bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Selected Rooms</h2>
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
                onClick={handleConfirmBooking}
                className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
                Confirm Booking
            </button>
        </div>
    );
}
