import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageRoom() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [selectedTab, setSelectedTab] = useState("view");
    const [addRoomDetails, setAddRoomDetails] = useState({
        id: "",
        type: "",
        price: "",
        capacity: "",
        image: "",
        description: "",
        details: ""
    });
    const [updateRoomDetails, setUpdateRoomDetails] = useState({
        id: "",
        type: "",
        price: "",
        capacity: "",
        image: "",
        description: "",
        details: ""
    });
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCriterion, setSearchCriterion] = useState("id");

    useEffect(() => {
        if (selectedTab === "view") {
            fetchRooms();
        }
    }, [selectedTab]);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/admin/room/view", {
                username: localStorage.getItem("username")
            });
            setRooms(data);
        } catch (error) {
            setErrorMessage("Failed to fetch rooms.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setAddRoomDetails({ ...addRoomDetails, [name]: value });
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateRoomDetails({ ...updateRoomDetails, [name]: value });
    };

    const handleAddRoom = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/room/add", {
                username: localStorage.getItem("username"),
                ...addRoomDetails
            });
            setErrorMessage("");
            alert("Room added successfully.");
            fetchRooms();
        } catch (error) {
            setErrorMessage("Failed to add room.");
        }
    };

    const handleUpdateRoom = (room) => {
        setSelectedRoom(room);
        setUpdateRoomDetails(room);
        setIsModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/room/update", {
                username: localStorage.getItem("username"),
                room_id: updateRoomDetails.id,
                ...updateRoomDetails
            });
            setErrorMessage("");
            fetchRooms();
            setIsModalOpen(false);
        } catch (error) {
            setErrorMessage("Failed to update room.");
        }
    };

    const handleDeleteRoom = async (room_id) => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/room/delete", {
                username: localStorage.getItem("username"),
                room_id
            });
            setErrorMessage("");
            fetchRooms();
        } catch (error) {
            setErrorMessage("Failed to delete room.");
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRooms = rooms.filter((room) => {
        switch (searchCriterion) {
            case "id":
                return room.id.toString().includes(searchTerm);
            case "type":
                return room.type.toLowerCase().includes(searchTerm.toLowerCase());
            case "price":
                return room.price.toString().includes(searchTerm);
            case "capacity":
                return room.capacity.toString().includes(searchTerm);
            default:
                return true;
        }
    });

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Manage Rooms</h1>
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setSelectedTab("view")}
                        className={`px-4 py-2 mx-2 ${selectedTab === "view" ? "border-b-2 border-blue-500" : ""}`}
                    >
                        View
                    </button>
                    <button
                        onClick={() => setSelectedTab("add")}
                        className={`px-4 py-2 mx-2 ${selectedTab === "add" ? "border-b-2 border-blue-500" : ""}`}
                    >
                        Add
                    </button>
                </div>

                {selectedTab === "view" && (
                    <div>
                        <div className="mb-4">
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <select
                                    id="searchCriterion"
                                    name="searchCriterion"
                                    value={searchCriterion}
                                    onChange={(e) => setSearchCriterion(e.target.value)}
                                    className="py-1.5 pr-7 pl-3 text-base text-gray-500 sm:text-sm border-none focus:outline-none"
                                >
                                    <option value="id">Room ID</option>
                                    <option value="type">Type</option>
                                    <option value="price">Price</option>
                                    <option value="capacity">Capacity</option>
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
                            <p className="text-center text-gray-700">Loading rooms...</p>
                        ) : (
                            <div>
                                {filteredRooms.map((room) => (
                                    <div key={room.id} className="flex items-center border-b py-4">
                                        <img src={room.image} alt={room.type} className="w-20 h-20 rounded-lg object-cover" />
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-gray-800">{room.type}</h3>
                                            <p className="text-gray-600">ID: {room.id}</p>
                                            <p className="text-gray-600">Price: ${room.price}</p>
                                            <p className="text-gray-600">Capacity: {room.capacity}</p>
                                            <p className="text-gray-600">Description: {room.description}</p>
                                            <p className="text-gray-600">Details: {room.details}</p>
                                        </div>
                                        <div className="ml-4 flex space-x-2">
                                            <button
                                                onClick={() => handleUpdateRoom(room)}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRoom(room.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedTab === "add" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Room ID</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="text"
                                    name="id"
                                    value={addRoomDetails.id}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter room ID"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Type</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="text"
                                    name="type"
                                    value={addRoomDetails.type}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter room type"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Price</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="number"
                                    name="price"
                                    min={1}
                                    value={addRoomDetails.price}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter room price"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Capacity</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="number"
                                    name="capacity"
                                    min={1}
                                    value={addRoomDetails.capacity}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter room capacity"
                                />
                            </div>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-sm font-medium text-gray-900">Image URL</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="text"
                                    name="image"
                                    value={addRoomDetails.image}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter image URL"
                                />
                            </div>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-sm font-medium text-gray-900">Description</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <textarea
                                    name="description"
                                    value={addRoomDetails.description}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter description"
                                />
                            </div>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-sm font-medium text-gray-900">Details</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <textarea
                                    name="details"
                                    value={addRoomDetails.details}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter details"
                                />
                            </div>
                        </div>
                        {errorMessage && <p className="text-red-500 mt-2 col-span-2">{errorMessage}</p>}
                        <div className="flex justify-end col-span-2">
                            <button
                                onClick={handleAddRoom}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Add Room
                            </button>
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-150 max-h-screen overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Room Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-900">Room ID</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="text"
                                            name="id"
                                            value={updateRoomDetails.id}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-900">Type</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="text"
                                            name="type"
                                            value={updateRoomDetails.type}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter room type"
                                        />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-900">Price</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="number"
                                            name="price"
                                            min={1}
                                            value={updateRoomDetails.price}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter room price"
                                        />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-900">Capacity</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="number"
                                            name="capacity"
                                            min={1}
                                            value={updateRoomDetails.capacity}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter room capacity"
                                        />
                                    </div>
                                </div>
                                <div className="mb-2 col-span-2">
                                    <label className="block text-sm font-medium text-gray-900">Image URL</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="text"
                                            name="image"
                                            value={updateRoomDetails.image}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter image URL"
                                        />
                                    </div>
                                </div>
                                <div className="mb-2 col-span-2">
                                    <label className="block text-sm font-medium text-gray-900">Description</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <textarea
                                            name="description"
                                            value={updateRoomDetails.description}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter description"
                                        />
                                    </div>
                                </div>
                                <div className="mb-2 col-span-2">
                                    <label className="block text-sm font-medium text-gray-900">Details</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <textarea
                                            name="details"
                                            value={updateRoomDetails.details}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter details"
                                        />
                                    </div>
                                </div>
                                {errorMessage && <p className="text-red-500 mt-2 col-span-2">{errorMessage}</p>}
                                <div className="flex justify-end col-span-2 gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-lg transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmUpdate}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
                                    >
                                        Update Room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
