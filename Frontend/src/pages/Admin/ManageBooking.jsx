import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageBooking() {
    const [bookings, setBookings] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCriterion, setSearchCriterion] = useState("booking_id"); // New state for search criterion

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/admin/booking/view", {
                username: localStorage.getItem("username")
            });
            if (data.error) {
                setErrorMessage(data.error);
            } else {
                setBookings(data);
            }
        } catch (error) {
            setBookings([]);
            setErrorMessage("Failed to fetch bookings.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (booking_id) => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/booking/delete", {
                username: localStorage.getItem("username"),
                booking_id
            });
            setErrorMessage("");
            fetchBookings();
        } catch (error) {
            setErrorMessage("Failed to delete booking.");
        }
    };

    const handleCancelBooking = async (booking_id) => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/cancel_booking", {
                username: localStorage.getItem("username"),
                role: "admin",
                book_id: booking_id
            });
            setErrorMessage("");
            fetchBookings();
        } catch (error) {
            setErrorMessage("Failed to cancel booking.");
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBookings = bookings.filter((booking) => {
        switch (searchCriterion) {
            case "booking_id":
                return booking.booking_id.toString().includes(searchTerm);
            case "room_id":
                return booking.room.some((room) =>
                    room.id.toString().includes(searchTerm)
                );
            case "room_type":
                return booking.room.some((room) =>
                    room.type.toLowerCase().includes(searchTerm.toLowerCase())
                );
            default:
                return true;
        }
    });

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Manage Bookings</h1>
                <div className="mb-4">

                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                        <select
                            id="searchCriterion"
                            name="searchCriterion"
                            value={searchCriterion}
                            onChange={(e) => setSearchCriterion(e.target.value)}
                            className="py-1.5 pr-7 pl-3 text-base text-gray-500 sm:text-sm border-none focus:outline-none"
                        >
                            <option value="booking_id">Booking ID</option>
                            <option value="room_id">Room ID</option>
                            <option value="room_type">Room Type</option>
                        </select>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            placeholder={`Search by ${searchCriterion.replace('_', ' ').toUpperCase()}`}
                        />
                    </div>
                </div>
                {loading ? (
                    <p className="text-center text-gray-700">Loading bookings...</p>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <div key={booking.booking_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">Booking ID: {booking.booking_id}</h3>
                                            <p className="text-gray-600">Check-in: {booking.check_in}</p>
                                            <p className="text-gray-600">Check-out: {booking.check_out}</p>
                                            <p className="text-gray-600">Price: ${booking.price}</p>
                                            <p className="text-gray-600">Final Price: ${booking.final_price}</p>
                                            <p className="text-gray-600">Discount: ${booking.discount}</p>
                                            <p className="text-gray-600">Status: {booking.status}</p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <button
                                                onClick={() => handleDeleteBooking(booking.booking_id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                            {(booking.status === 0 || booking.status === 1) && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.booking_id)}
                                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-800">Rooms:</h4>
                                        {booking.room.map((room) => (
                                            <div key={room.id} className="ml-4 mt-2">
                                                <p className="text-gray-600">Room ID: {room.id}</p>
                                                <p className="text-gray-600">Type: {room.type}</p>
                                                <p className="text-gray-600">Price: ${room.price}</p>
                                                <p className="text-gray-600">Capacity: {room.capacity}</p>
                                                <p className="text-gray-600">Description: {room.description}</p>
                                                <p className="text-gray-600">Details: {room.details}</p>
                                                {room.image && <img src={room.image} alt={room.type} className="w-20 h-20 rounded-lg object-cover mt-2" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-700">No Bookings Available</p>
                        )}
                    </div>
                )}
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
        </div>
    );
}