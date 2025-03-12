import { useState, useEffect, useCallback, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

export default function Home() {
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [roomDetails, setRoomDetails] = useState(null);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showDateWarning, setShowDateWarning] = useState(false);
    const [roomsData, setRoomsData] = useState([]);
    const [username, setUsername] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false); // Add state for collapse
    const [searchCriterion, setSearchCriterion] = useState("type"); // New state for search criterion

    // Fetch room data when startDate and endDate are available
    useEffect(() => {
        if (startDate && endDate) {
            const fetchRooms = async () => {
                try {
                    const response = await axios.post("http://127.0.0.1:5000/api/rooms_available", {
                        check_in: startDate,
                        check_out: endDate,
                    });

                    // Compare the new data with the old data
                    if (JSON.stringify(response.data) !== JSON.stringify(roomsData)) {
                        setRoomsData(response.data); // Update only when data changes
                    }
                } catch (error) {
                    console.error("Error fetching rooms data:", error);
                }
            };

            fetchRooms(); // Call API immediately when the component loads
            const interval = setInterval(fetchRooms, 3000); // Call API every 3 seconds

            return () => clearInterval(interval); // Clear interval when component unmounts
        }
    }, [startDate, endDate, roomsData]); // Add roomsData as a dependency to compare new data every time

    useEffect(() => {
        const fetchSelectedRooms = async () => {
            const storedUsername = localStorage.getItem("username");
            if (!storedUsername) {
                console.error("Username not found in localStorage");
                return;
            }

            try {
                const response = await axios.post("http://127.0.0.1:5000/api/get_selected", {
                    username: storedUsername
                });
                setSelectedRooms(response.data);
            } catch (error) {
                console.error("Error fetching selected rooms:", error);
            }
        };

        fetchSelectedRooms();
    }, [username]); // Fetch new data when username changes

    const navigate = useNavigate();

    const time = new Date();
    time.setHours(0, 0, 0, 0);
    const minDate = time.toLocaleDateString("sv-SE");

    const getNextDay = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const filteredRooms = useMemo(() => {
        const lowerCaseSearch = search.toLowerCase();
        return (roomsData || []).filter((room) => {
            switch (searchCriterion) {
                case "id":
                    return room.id.toString().includes(lowerCaseSearch);
                case "type":
                    return room.type?.toLowerCase().includes(lowerCaseSearch);
                case "description":
                    return room.description?.toLowerCase().includes(lowerCaseSearch);
                default:
                    return true;
            }
        });
    }, [search, roomsData, searchCriterion]);

    const toggleRoomSelection = useCallback((room) => {
        if (!startDate || !endDate) {
            setShowDateWarning(true); // Open Modal
            return;
        }

        // Retrieve the username from localStorage
        const username = localStorage.getItem("username");

        if (!username) {
            console.error("Username not found in localStorage");
            return;
        }

        const updatedSelectedRooms = selectedRooms.some((selectedRoom) => selectedRoom.id === room.id)
            ? selectedRooms.filter((selectedRoom) => selectedRoom.id !== room.id)
            : [...selectedRooms, room];

        setSelectedRooms(updatedSelectedRooms);

        // Send API request to select or deselect the room
        const apiUrl = selectedRooms.some((selectedRoom) => selectedRoom.id === room.id)
            ? "http://127.0.0.1:5000/api/deselect_room"
            : "http://127.0.0.1:5000/api/select_room";

        axios
            .post(apiUrl, {
                username,
                room_id: room.id,
                check_in: startDate,
                check_out: endDate,
            })
            .then((response) => {
                console.log(`Room ${selectedRooms.some((selectedRoom) => selectedRoom.id === room.id) ? "deselected" : "selected"} successfully`);
            })
            .catch((error) => {
                console.error("Error updating room selection:", error);
            });
    }, [selectedRooms, startDate, endDate]);

    const handleViewDetail = useCallback((room) => {
        setRoomDetails(room);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setRoomDetails(null);
    }, []);

    const handleSelectRoomInModal = useCallback(() => {
        if (roomDetails) {
            toggleRoomSelection(roomDetails);
            handleCloseDetail();
        }
    }, [roomDetails, toggleRoomSelection, handleCloseDetail]);

    const handleMakeBooking = () => {
        if (!startDate || !endDate) {
            setShowWarningModal(true);
            return;
        }

        const username = localStorage.getItem("username");

        if (!username) {
            console.error("Username not found in localStorage");
            return;
        }

        console.log(startDate, endDate);

        axios
            .post("http://127.0.0.1:5000/api/make_booking", {
                username,
                check_in: startDate,
                check_out: endDate
            })
            .then((response) => {
                console.log(response.data);
                setSelectedRooms([]);
                navigate(`/booking/${response.data.booking_id}`); // Redirect after booking with username in path
            })
            .catch((error) => {
                console.error("Error making booking:", error);
                alert("Failed to make booking. Please try again.");
            });
    };

    return (
        <div className="min-h-screen p-6 flex flex-col items-center">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">

                <div className="flex flex-col items-center text-center mb-4">
                    <h1 className="text-2xl font-bold mb-4">Select Rooms</h1>

                    {/* Input ค้นหา & วันที่ */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                            <input
                                type="date"
                                value={startDate}
                                min={minDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                placeholder="Start Date"
                            />
                        </div>
                        <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                            <input
                                type="date"
                                value={endDate}
                                min={startDate ? getNextDay(startDate) : minDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                placeholder="End Date"
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="mt-4 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                        <select
                            id="searchCriterion"
                            name="searchCriterion"
                            value={searchCriterion}
                            onChange={(e) => setSearchCriterion(e.target.value)}
                            className="py-1.5 pr-7 pl-3 text-base text-gray-500 sm:text-sm border-none focus:outline-none"
                        >
                            <option value="id">ID</option>
                            <option value="type">Type</option>
                            <option value="description">Description</option>
                        </select>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            placeholder={`Search by ${searchCriterion}`}
                        />
                    </div>
                </div>

                {/* Modal */}
                {roomDetails && (
                    <div className="fixed inset-0 bg-black/80 p-4 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-96 max-w-full shadow-lg relative">
                            <h3 className="text-xl font-semibold">{roomDetails.id + " : " + roomDetails.type} - Details</h3>
                            <p className="mt-2">{roomDetails.details}</p>
                            <p className="mt-2">Capacity: {roomDetails.capacity}</p>
                            <p className="mt-2">Price: {roomDetails.price}</p>
                            <img src={roomDetails.image} alt={roomDetails.type} className="w-full h-60 mt-4 object-cover rounded-lg" />
                            <div className="mt-4 flex justify-between">
                                <button onClick={handleCloseDetail} className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        toggleRoomSelection(roomDetails);
                                        handleCloseDetail();
                                    }}
                                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    {selectedRooms.some((r) => r.id === roomDetails.id) ? "Deselect" : "Select"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-7xl flex flex-col gap-6">


                    {/* Room List Section */}
                    <div className="flex flex-col gap-6 w-full">
                        {filteredRooms.map((room) => (
                            <div key={room.id} className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow-md  bg-white">
                                <div className="relative w-full md:w-1/3">
                                    <img src={room.image} alt={room.type} className="w-full h-48 md:h-full object-cover rounded-t-xl md:rounded-t-none md:rounded-l-xl" />
                                    {selectedRooms.some((r) => r.id === room.id) && (
                                        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                            Selected
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-800">{room.id + " : " + room.type}</h3>
                                    <p className="text-gray-600 mt-2 flex-grow">{room.description}</p>
                                    <p className="text-gray-600 mt-2">Capacity : {room.capacity}</p>
                                    <p className="text-gray-600 mt-2">Price Per Night : {room.price}</p>
                                    <button
                                        onClick={() => handleViewDetail(room)}
                                        className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Rooms Section */}
                    <div className="fixed bottom-4 right-4 w-full md:w-80 border bg-white p-4 rounded-lg shadow-md flex flex-col items-center self-start z-50">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-lg font-semibold mb-4 text-center">Selected Rooms</h2>
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                {isCollapsed ? "Expand" : "Collapse"}
                            </button>
                        </div>

                        {!isCollapsed && selectedRooms.length > 0 && (
                            <>
                                <div className="space-y-4 overflow-y-auto w-full max-h-60">
                                    {selectedRooms.map((room) => (
                                        <div key={room.id} className="flex items-center border p-2 rounded-lg shadow w-full">
                                            <img src={room.image} alt={room.type} className="w-16 h-16 rounded-md object-cover" />
                                            <div className="flex-1 ml-3">
                                                <h4 className="text-sm font-medium">{room.id + " : " + room.type}</h4>
                                                <p className="text-sm text-gray-600">Capacity: {room.capacity}</p>
                                                <p className="text-sm text-gray-600">Price Per Night: {room.price}</p>
                                            </div>
                                            <button onClick={() => toggleRoomSelection(room)} className="text-red-500 hover:text-red-700">
                                                <Trash2 />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 text-center mt-2">
                                    📅 In: {startDate || "Not selected"} | Out: {endDate || "Not selected"}
                                </p>
                                <button
                                    onClick={handleMakeBooking}
                                    className="mt-3 w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                                >
                                    Confirm Booking
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 🔹 Modal แจ้งเตือน */}
                {showWarningModal && (
                    <div className="fixed inset-0 bg-black/80 p-4 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-120 max-w-full shadow-lg relative text-center">
                            <h3 className="text-lg font-semibold">⚠️ Booking Error</h3>
                            <p className="mt-2 text-gray-700">Please select both start and end dates before making a booking.</p>
                            <button
                                onClick={() => setShowWarningModal(false)} // Close Modal
                                className="mt-4 py-3 px-6 w-full text-lg font-semibold bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {showDateWarning && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/80">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                            <h2 className="text-xl font-semibold mb-4 text-red-600">⚠️ Warning</h2>
                            <p className="text-gray-700">Please select both check-in and check-out dates before choosing a room.</p>
                            <button
                                onClick={() => setShowDateWarning(false)}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}