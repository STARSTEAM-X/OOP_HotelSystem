import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios"; // Import axios

export default function Booking() {
    const navigate = useNavigate();
    const { booking_id } = useParams();
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Fetch booking details from server
        axios.get(`http://127.0.0.1:5000/api/booking/${booking_id}`)
            .then((response) => {
                const { selected_rooms, start_date, end_date, discount_amount, total_amount } = response.data;
                setSelectedRooms(selected_rooms);
                setStartDate(start_date);
                setEndDate(end_date);
                setDiscountAmount(discount_amount);
                setTotalAmount(total_amount);
            })
            .catch((error) => {
                console.error("Error fetching booking details:", error);
            });
    }, [booking_id]);

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

    const applyDiscount = () => {
        axios
            .post("http://127.0.0.1:5000/api/user_add_discount", {
                booking_id: `${booking_id}`, // Assuming booking ID format
                discount_code: discountCode,
            })
            .then((response) => {
                console.log(booking_id);
                console.log(response.data);
                const discount = response.data.discount;
                setDiscountAmount(discount);
                setTotalAmount(response.data.final_price)
                setErrorMessage("");
            })
            .catch((error) => {
                console.error("Error applying discount:", error);
                setDiscountAmount(0);
                setErrorMessage("❌ Invalid Discount Code");
            });
    };

    const handleConfirmBooking = () => {
        axios
            .post("http://127.0.0.1:5000/api/user_confirm_booking", {
                booking_id,
                discount_amount: discountAmount,
                total_amount: totalAmount,
                start_date: startDate,
                end_date: endDate,
                selected_rooms: selectedRooms,
            })
            .then((response) => {
                console.log(response.data);
                navigate(`/payment/${booking_id}`);
            })
            .catch((error) => {
                console.error("Error confirming booking:", error);
                alert("Failed to confirm booking. Please try again.");
            });
    };

    return (
        <div className="min-h-screen p-6  flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">Confirm Booking</h1>
                <p className="text-lg">📅 Stay: {startDate} → {endDate}</p>
                {selectedRooms.map((room) => (
                    <div key={room.id} className="flex items-center border-b py-3">
                        <img src={room.image} alt={room.name} className="w-16 h-16 rounded-md object-cover" />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium">{room.name}</h3>
                            <p className="text-gray-600">${room.price}</p>
                        </div>
                    </div>
                ))}

                {/* Discount Code Section */}
                <div className="mt-4">
                    <label className="block text-gray-700 font-medium">Discount Code</label>
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Enter discount code"
                        />
                        <button
                            onClick={applyDiscount}
                            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <FaCheckCircle size={20} />
                        </button>
                    </div>
                    {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                    {discountAmount > 0 && <p className="text-green-600 mt-2">✅ Applied: -${discountAmount}</p>}
                </div>

                {/* Total Amount */}
                <div className="mt-4 text-lg font-semibold">
                    <p>Total: <span className="text-blue-500">${totalAmount}</span></p>
                </div>

                <button
                    onClick={handleConfirmBooking}
                    className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}