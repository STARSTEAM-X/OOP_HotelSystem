import { useState, useEffect, useMemo, useCallback } from "react";
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

    // Fetch room data when startDate and endDate are available
    useEffect(() => {
        if (startDate && endDate) {
            axios
                .post("http://127.0.0.1:5000/api/get_available_rooms", {
                    checkin: startDate,
                    checkout: endDate,
                })
                .then((response) => {
                    setRoomsData(response.data); // Set the fetched data to state
                })
                .catch((error) => {
                    console.error("Error fetching rooms data:", error);
                });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        // ล้างรายการห้องที่เลือกเมื่อมีการเปลี่ยนแปลงวันที่
        setSelectedRooms([]);
        localStorage.setItem("selectedRooms", JSON.stringify([]));
    }, [startDate, endDate]);

    const navigate = useNavigate();

    const time = new Date();
    time.setHours(0, 0, 0, 0);
    const minDate = time.toLocaleDateString("sv-SE")

    useEffect(() => {
        const savedRooms = JSON.parse(localStorage.getItem("selectedRooms")) || [];
        setSelectedRooms(savedRooms);
    }, []);

    const filteredRooms = useMemo(() => {
        return (roomsData || []).filter((room) =>
            room.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, roomsData]);



    const toggleRoomSelection = useCallback((room) => {
        if (!startDate || !endDate) {
            setShowDateWarning(true); // เปิด Modal
            return;
        }

        const updatedSelectedRooms = selectedRooms.some((selectedRoom) => selectedRoom.id === room.id)
            ? selectedRooms.filter((selectedRoom) => selectedRoom.id !== room.id)
            : [...selectedRooms, room];

        setSelectedRooms(updatedSelectedRooms);
        localStorage.setItem("selectedRooms", JSON.stringify(updatedSelectedRooms));
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

        // ✅ ไปที่หน้า Booking และส่งข้อมูลห้องที่เลือกไปด้วย
        navigate("/booking", {
            state: {
                selectedRooms,
                startDate,
                endDate
            }
        });
    };

    return (
        <div className="min-h-screen p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Select Rooms</h1>

            {/* Input ค้นหา & วันที่ */}
            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    value={startDate}
                    min={minDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <input
                    type="date"
                    value={endDate}
                    min={startDate || minDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
            </div>

            <input
                type="text"
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 border rounded-md mb-4 w-80"
            />

            <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6">
                {/* Room List Section */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1 ${selectedRooms.length === 0 ? "mx-auto place-items-center" : ""}`}>
                    {filteredRooms.map((room) => (
                        <div key={room.id} className="flex flex-col border rounded-xl overflow-hidden shadow-md transition hover:scale-105 bg-white">
                            <div className="relative">
                                <img src={room.image} alt={room.name} className="w-full h-48 object-cover rounded-t-xl" />
                                {selectedRooms.some((r) => r.id === room.id) && (
                                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                        Selected
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
                                <p className="text-gray-600 mt-2 flex-grow">{room.description}</p>
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

                {/* Selected Rooms Section (แสดงเฉพาะเมื่อมีการเลือกห้อง) */}
                {selectedRooms.length > 0 && (
                    <div className="w-full md:w-80 bg-white p-4 rounded-lg shadow-md flex flex-col items-center self-start">
                        <h2 className="text-lg font-semibold mb-4 text-center">Selected Rooms</h2>

                        {/* ให้ div ปรับขนาดตามเนื้อหา */}
                        <div className="space-y-4 overflow-y-auto w-full">
                            {selectedRooms.map((room) => (
                                <div key={room.id} className="flex items-center border p-2 rounded-lg shadow w-full">
                                    <img src={room.image} alt={room.name} className="w-16 h-16 rounded-md object-cover" />
                                    <div className="flex-1 ml-3">
                                        <h4 className="text-sm font-medium">{room.name}</h4>
                                    </div>
                                    <button onClick={() => toggleRoomSelection(room)} className="text-red-500 hover:text-red-700">
                                        <Trash2 />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* ใช้ margin แทน <br /> */}
                        <p className="text-sm text-gray-600 text-center mt-2">
                            📅 Start: {startDate || "Not selected"} | End: {endDate || "Not selected"}
                        </p>

                        {/* ปุ่ม Make Booking ติดกับ list */}
                        <button
                            onClick={handleMakeBooking}
                            className="mt-3 w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                        >
                            Make Booking
                        </button>
                    </div>
                )}

            </div>

            {/* 🔹 Modal แจ้งเตือน */}
            {showWarningModal && (
                <div className="fixed inset-0 bg-black/80 p-4 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-120 max-w-full shadow-lg relative text-center">
                        <h3 className="text-lg font-semibold">⚠️ Booking Error</h3>
                        <p className="mt-2 text-gray-700">Please select both start and end dates before making a booking.</p>
                        <button
                            onClick={() => setShowWarningModal(false)} // ปิด Modal
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

            {/* Modal */}
            {roomDetails && (
                <div className="fixed inset-0 bg-black/80 p-4 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-full shadow-lg relative">
                        <h3 className="text-xl font-semibold">{roomDetails.name} - Details</h3>
                        <p className="mt-2">{roomDetails.details}</p>
                        <img src={roomDetails.image} alt={roomDetails.name} className="w-full h-60 mt-4 object-cover rounded-lg" />
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
        </div>
    );
}
