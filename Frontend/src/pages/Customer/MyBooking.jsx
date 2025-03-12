import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaTrash, FaCommentDots, FaStar, FaArrowRight, FaSearch, FaFileInvoice } from "react-icons/fa";

export default function MyBooking() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [reviewModal, setReviewModal] = useState(null);
    const [feedback, setFeedback] = useState({ rating: 0, comment: "" });
    const [review, setReview] = useState({ rating: 0, comment: "" });
    const [filter, setFilter] = useState("");
    const [searchCriterion, setSearchCriterion] = useState("booking_id"); // New state for search criterion

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.post("http://127.0.0.1:5000/api/my_booking", {
                    username: localStorage.getItem("username"),
                });
                setBookings(data.sort((a, b) => b.booking_id.localeCompare(a.booking_id)));
            } catch (error) {
                setErrorMessage("Failed to fetch bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = useCallback(async (bookingId) => {
        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/cancel_booking", {
                username: localStorage.getItem("username"),
                book_id: bookingId,
            });
            setBookings(bookings.map((booking) =>
                booking.booking_id === bookingId ? { ...booking, status: 2 } : booking
            ));
            alert(data.message);
        } catch (error) {
            alert("Failed to cancel booking.");
        }
    }, [bookings]);

    const handleAddFeedback = useCallback(async () => {
        if (!feedbackModal) return;

        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/add_feedback", {
                username: localStorage.getItem("username"),
                book_id: feedbackModal.booking_id,
                rating: feedback.rating,
                comment: feedback.comment,
            });
            alert(data.message);
            setFeedbackModal(null);
        } catch (error) {
            alert("Failed to add feedback.");
        }
    }, [feedbackModal, feedback]);

    const handleAddReview = useCallback(async () => {
        if (!reviewModal) return;

        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/add_review", {
                username: localStorage.getItem("username"),
                room_id: reviewModal.room_id,
                rating: review.rating,
                comment: review.comment,
            });
            alert(data.message);
            setReviewModal(null);
        } catch (error) {
            alert("Failed to add review.");
        }
    }, [reviewModal, review]);

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return "Pending Payment";
            case 1:
                return "Paid";
            case 2:
                return "Cancelled";
            default:
                return "Unknown Status";
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        switch (searchCriterion) {
            case "booking_id":
                return booking.booking_id.toString().includes(filter);
            case "check_in":
                return booking.check_in.toLowerCase().includes(filter.toLowerCase());
            case "check_out":
                return booking.check_out.toLowerCase().includes(filter.toLowerCase());
            case "status":
                return getStatusText(booking.status).toLowerCase().includes(filter.toLowerCase());
            default:
                return true;
        }
    });

    if (loading) return <p className="text-center text-gray-700">Loading booking details...</p>;

    if (!bookings.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">No Bookings Found</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">My Bookings</h1>
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
                            <option value="check_in">Check-in Date</option>
                            <option value="check_out">Check-out Date</option>
                            <option value="status">Status</option>
                        </select>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            placeholder={`Search by ${searchCriterion.replace('_', ' ')}`}
                        />
                    </div>
                </div>
                {filteredBookings.map((booking) => (
                    <div key={booking.booking_id} className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div>
                                <p className="text-lg font-medium">Booking ID: {booking.booking_id}</p>
                                <p className="text-gray-700">Check-in: {booking.check_in}</p>
                                <p className="text-gray-700">Check-out: {booking.check_out}</p>
                                <p className="text-gray-700">Price: ${booking.final_price}</p>
                                <p className="text-gray-700">Status: {getStatusText(booking.status)}</p>
                            </div>
                            <div className="flex gap-2">
                                {booking.status === 0 && (
                                    <>
                                        <a
                                            href={`http://localhost:5173/booking/${booking.booking_id}`}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                                        >
                                            <FaArrowRight />
                                        </a>
                                        <button
                                            onClick={() => handleCancelBooking(booking.booking_id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                )}
                                {booking.status === 1 && (
                                    <>
                                        <button
                                            onClick={() => handleCancelBooking(booking.booking_id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                        >
                                            <FaTrash />
                                        </button>
                                        <button
                                            onClick={() => setFeedbackModal(booking)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                        >
                                            <FaCommentDots />
                                        </button>
                                    </>
                                )}
                                <a
                                    href={`http://localhost:5173/invoice/${booking.booking_id}`}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                                >
                                    <FaFileInvoice />
                                </a>
                            </div>
                        </div>
                        {booking.room.map((room) => (
                            <div key={room.id} className="flex items-center border-b py-4 last:border-b-0">
                                <img src={room.image} alt={room.type} className="w-20 h-20 rounded-md object-cover" />
                                <div className="ml-6">
                                    <h3 className="text-lg font-semibold text-gray-800">{room.type}</h3>
                                    <p className="text-gray-700">Price per night: ${room.price}</p>
                                    {booking.status === 1 && (
                                        <button
                                            onClick={() => setReviewModal({ room_id: room.id })}
                                            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                                        >
                                            <FaStar />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {feedbackModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Feedback</h2>
                        <label className="block mb-2 text-gray-700">Rating</label>
                        <StarRating rating={feedback.rating} onRatingChange={(rating) => setFeedback({ ...feedback, rating })} />
                        <label className="block mb-2 text-gray-700">Comment</label>
                        <textarea
                            value={feedback.comment}
                            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setFeedbackModal(null)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddFeedback}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reviewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Review</h2>
                        <label className="block mb-2 text-gray-700">Rating</label>
                        <StarRating rating={review.rating} onRatingChange={(rating) => setReview({ ...review, rating })} />
                        <label className="block mb-2 text-gray-700">Comment</label>
                        <textarea
                            value={review.comment}
                            onChange={(e) => setReview({ ...review, comment: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setReviewModal(null)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddReview}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StarRating({ rating, onRatingChange }) {
    const [hoveredRating, setHoveredRating] = useState(0);

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                    key={star}
                    size={24}
                    className={`cursor-pointer ${star <= (hoveredRating || rating) ? "text-yellow-500" : "text-gray-300"}`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => onRatingChange(star)}
                />
            ))}
        </div>
    );
}