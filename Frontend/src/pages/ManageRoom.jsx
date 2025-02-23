import { useState, useEffect } from "react";

const initialRoomsData = [
    {
        id: 1,
        name: "Deluxe Room",
        image: "/images/deluxe-room.jpg",
        description: "A luxurious room with a beautiful view and modern amenities.",
        details: "This room includes a king-size bed, a walk-in closet, a balcony, and a jacuzzi."
    },
    {
        id: 2,
        name: "Suite Room",
        image: "/images/suite-room.jpg",
        description: "A spacious suite with a living area and premium facilities.",
        details: "Includes a spacious living area, minibar, and a private balcony with sea view."
    },
    {
        id: 3,
        name: "Standard Room",
        image: "/images/standard-room.jpg",
        description: "Comfortable and affordable room with all basic amenities.",
        details: "This room offers a cozy bed, a desk for work, and a flat-screen TV."
    },
    {
        id: 4,
        name: "Executive Room",
        image: "/images/executive-room.jpg",
        description: "A premium room designed for business professionals.",
        details: "This room features a large work desk, high-speed internet, and access to the executive lounge."
    },
];

export default function ManageRoom() {
    const [rooms, setRooms] = useState(initialRoomsData);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        image: "",
        description: "",
        details: "",
    });

    // Load rooms from localStorage
    useEffect(() => {
        const savedRooms = JSON.parse(localStorage.getItem("rooms")) || initialRoomsData;
        setRooms(savedRooms);
    }, []);

    // Save rooms to localStorage
    const saveRoomsToLocalStorage = (rooms) => {
        localStorage.setItem("rooms", JSON.stringify(rooms));
    };

    // Add or Edit Room
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.id === null) {
            // Add new room
            const newRoom = { ...formData, id: Date.now() };
            const updatedRooms = [...rooms, newRoom];
            setRooms(updatedRooms);
            saveRoomsToLocalStorage(updatedRooms);
        } else {
            // Edit existing room
            const updatedRooms = rooms.map((room) =>
                room.id === formData.id ? formData : room
            );
            setRooms(updatedRooms);
            saveRoomsToLocalStorage(updatedRooms);
        }
        resetForm();
    };

    // Reset the form
    const resetForm = () => {
        setFormData({ id: null, name: "", image: "", description: "", details: "" });
    };

    // Delete Room
    const handleDelete = (id) => {
        const updatedRooms = rooms.filter((room) => room.id !== id);
        setRooms(updatedRooms);
        saveRoomsToLocalStorage(updatedRooms);
    };

    // Edit Room
    const handleEdit = (room) => {
        setFormData(room);
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Manage Rooms</h1>

            {/* Room Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <h2 className="text-xl mb-2">{formData.id ? "Edit Room" : "Add Room"}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-semibold" htmlFor="name">
                        Room Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold" htmlFor="image">
                        Image URL:
                    </label>
                    <input
                        type="text"
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold" htmlFor="description">
                        Room Description:
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold" htmlFor="details">
                        Room Details:
                    </label>
                    <textarea
                        id="details"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white rounded-md"
                >
                    {formData.id ? "Update Room" : "Add Room"}
                </button>
                {formData.id && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="ml-4 py-2 px-4 bg-gray-400 text-white rounded-md"
                    >
                        Reset
                    </button>
                )}
            </form>

            {/* Room List */}
            <h2 className="text-xl mb-4">Rooms List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4">
                        <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
                        <h3 className="text-xl font-semibold mt-2">{room.name}</h3>
                        <p className="mt-2">{room.description}</p>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => handleEdit(room)}
                                className="py-2 px-4 bg-green-600 text-white rounded-md"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(room.id)}
                                className="py-2 px-4 bg-red-600 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
