import { useState, useEffect, useMemo, useCallback } from "react";
import { Trash2 } from "lucide-react";

const roomsData = [
    {
        id: 1,
        name: "Deluxe Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "A luxurious room with a beautiful view and modern amenities.",
        details: "This room includes a king-size bed, a walk-in closet, a balcony, and a jacuzzi."
    },
    {
        id: 2,
        name: "Suite Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "A spacious suite with a living area and premium facilities.",
        details: "Includes a spacious living area, minibar, and a private balcony with sea view."
    },
    {
        id: 3,
        name: "Standard Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "Comfortable and affordable room with all basic amenities.",
        details: "This room offers a cozy bed, a desk for work, and a flat-screen TV."
    },
    {
        id: 4,
        name: "Executive Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "A premium room designed for business professionals.",
        details: "This room features a large work desk, high-speed internet, and access to the executive lounge."
    },
    {
        id: 5,
        name: "Executive Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "A premium room designed for business professionals.",
        details: "This room features a large work desk, high-speed internet, and access to the executive lounge."
    },
    {
        id: 6,
        name: "Executive Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "A premium room designed for business professionals.",
        details: "This room features a large work desk, high-speed internet, and access to the executive lounge."
    },
    {
        id: 7,
        name: "Executive Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "A premium room designed for business professionals.",
        details: "This room features a large work desk, high-speed internet, and access to the executive lounge."
    },
    {
        id: 8,
        name: "Executive Room",
        image: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
        description: "A premium room designed for business professionals.",
        details: "This room features a large work desk, high-speed internet, and access to the executive lounge."
    },
];

export default function Home() {
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [roomDetails, setRoomDetails] = useState(null);

    const time = new Date();
    time.setHours(0, 0, 0, 0);
    const minDate = time.toLocaleDateString("sv-SE")

    useEffect(() => {
        const savedRooms = JSON.parse(localStorage.getItem("selectedRooms")) || [];
        setSelectedRooms(savedRooms);
    }, []);

    const filteredRooms = useMemo(() => {
        return roomsData.filter((room) => room.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    const toggleRoomSelection = useCallback((room) => {
        const updatedSelectedRooms = selectedRooms.some((selectedRoom) => selectedRoom.id === room.id)
            ? selectedRooms.filter((selectedRoom) => selectedRoom.id !== room.id)
            : [...selectedRooms, room];

        setSelectedRooms(updatedSelectedRooms);
        localStorage.setItem("selectedRooms", JSON.stringify(updatedSelectedRooms));
    }, [selectedRooms]);

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

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
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
                            onClick={() => {
                                if (!startDate || !endDate) {
                                    alert("Please select both start and end dates before making a booking.");
                                    return;
                                }
                                // ดำเนินการต่อ เช่น พาไปหน้าจองห้องพัก
                                console.log("Proceed to booking...");
                            }}
                            className="mt-3 w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                        >
                            Make Booking
                        </button>
                    </div>
                )}

            </div>

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
