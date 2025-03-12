import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

export default function ManageReview() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCriterion, setSearchCriterion] = useState("customer");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/admin/review/view", {
                username: localStorage.getItem("username"),
            });
            if (data.error) {
                setErrorMessage(data.error);
            } else {
                setReviews(data);
            }
        } catch (error) {
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (review_id) => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/review/delete", {
                username: localStorage.getItem("username"),
                review_id
            });
            setErrorMessage("");
            fetchReviews();
        } catch (error) {
            setErrorMessage("Failed to delete review.");
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
        ));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredReviews = reviews.filter((review) => {
        switch (searchCriterion) {
            case "customer":
                return review.customer.toLowerCase().includes(searchTerm.toLowerCase());
            case "room_id":
                return review.room_id.toString().includes(searchTerm);
            case "comment":
                return review.comment.toLowerCase().includes(searchTerm.toLowerCase());
            case "date":
                return review.date.includes(searchTerm);
            default:
                return true;
        }
    });

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Manage Reviews</h1>
                <div className="mb-4">

                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                        <select
                            id="searchCriterion"
                            name="searchCriterion"
                            value={searchCriterion}
                            onChange={(e) => setSearchCriterion(e.target.value)}
                            className="py-1.5 pr-7 pl-3 text-base text-gray-500 sm:text-sm border-none focus:outline-none"
                        >
                            <option value="customer">Customer</option>
                            <option value="room_id">Room ID</option>
                            <option value="comment">Comment</option>
                            <option value="date">Date</option>
                        </select>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            placeholder={`Search by ${searchCriterion}`}
                        />
                    </div>
                </div>
                {loading ? (
                    <p className="text-center text-gray-700">Loading reviews...</p>
                ) : (
                    <div>
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <div key={review.id} className="flex items-center border-b py-4">
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-lg font-medium text-gray-800">{review.customer}</h3>
                                        <p className="text-gray-600">Room ID: {review.room_id}</p>
                                        <div className="flex items-center">
                                            <p className="text-gray-600 mr-2">Rating:</p>
                                            <div className="flex">{renderStars(review.rating)}</div>
                                        </div>
                                        <p className="text-gray-600">Comment: {review.comment}</p>
                                        <p className="text-gray-600">Date: {review.date}</p>
                                    </div>
                                    <div className="ml-4 flex space-x-2">
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-700">No Reviews Available</p>
                        )}
                    </div>
                )}
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
        </div>
    );
}