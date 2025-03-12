import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
export default function MyFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [editModal, setEditModal] = useState(null);
    const [feedback, setFeedback] = useState({ rating: 0, comment: "" });

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const { data } = await axios.post("http://127.0.0.1:5000/api/my_feedback", {
                    username: localStorage.getItem("username"),
                });
                setFeedbacks(data);
            } catch (error) {
                setErrorMessage("Failed to fetch feedbacks.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const handleDeleteFeedback = useCallback(async (feedbackId) => {
        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/delete_my_feedback", {
                username: localStorage.getItem("username"),
                feedback_id: feedbackId,
            });
            setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackId));
            alert(data.message);
        } catch (error) {
            alert("Failed to delete feedback.");
        }
    }, [feedbacks]);

    const handleEditFeedback = useCallback(async () => {
        if (!editModal) return;

        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/edit_my_feedback", {
                username: localStorage.getItem("username"),
                feedback_id: editModal.id,
                rating: feedback.rating,
                comment: feedback.comment,
            });
            setFeedbacks(feedbacks.map((fb) =>
                fb.id === editModal.id ? { ...fb, rating: feedback.rating, comment: feedback.comment } : fb
            ));
            alert(data.message);
            setEditModal(null);
        } catch (error) {
            alert("Failed to update feedback.");
        }
    }, [editModal, feedback, feedbacks]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
        ));
    };

    if (loading) return <p className="text-center text-gray-700">Loading feedbacks...</p>;

    if (!feedbacks.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">No Feedbacks Found</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">My Feedbacks</h1>
                {feedbacks.map((fb) => (
                    <div key={fb.id} className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div>
                                <p className="text-lg font-medium">Date: {fb.date}</p>
                                <p className="text-gray-700">Customer: {fb.customer}</p>
                                <div className="flex items-center">
                                    <p className="text-gray-700 mr-2">Rating:</p>
                                    <div className="flex">{renderStars(fb.rating)}</div>
                                </div>
                                <p className="text-gray-700">Comment: {fb.comment}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditModal(fb);
                                        setFeedback({ rating: fb.rating, comment: fb.comment });
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteFeedback(fb.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Feedback</h2>
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
                                onClick={() => setEditModal(null)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditFeedback}
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
            {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                    key={index}
                    color={index < (hoveredRating || rating) ? "#ffc107" : "#e4e5e9"}
                    onMouseEnter={() => setHoveredRating(index + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => onRatingChange(index + 1)}
                    className="cursor-pointer"
                />
            ))}
        </div>
    );
}