import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    // ดึงค่า username จาก localStorage
    const userName = useMemo(() => localStorage.getItem("username"), []);

    // ตั้งค่า avatar อัตโนมัติ
    const avatar = useMemo(
        () => (userName ? "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&" : ""),
        [userName]
    );

    useEffect(() => {
        const handleStorageChange = () => {
            window.location.reload(); // Refresh หน้าเพื่อให้ Avatar และ State อัปเดตอัตโนมัติ
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("username");
        setIsProfileOpen(false);
        navigate("/register");
        window.dispatchEvent(new Event("storage")); // แจ้งให้ Component อื่นอัปเดต
    };

    return (
        <nav className="bg-white text-gray-900 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <a href="/" className="text-2xl font-bold text-gray-900">HotelSystem</a>

                <div className="hidden md:flex space-x-6">
                    <a href="/home" className="text-gray-900 hover:text-indigo-600">Home</a>
                    <a href="/viewbooking" className="text-gray-900 hover:text-indigo-600">View Booking</a>
                    <a href="/manageroom" className="text-gray-900 hover:text-indigo-600">Management</a>
                </div>

                {userName ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200"
                        >
                            {avatar && (
                                <img
                                    src={avatar}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full border border-gray-300"
                                />
                            )}
                            <span className="hidden md:block font-medium">{userName}</span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-48 p-2 z-10 transition-all duration-300 ease-in-out">
                                <ul className="flex flex-col space-y-1">
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded transition duration-200">Profile</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded transition duration-200">Settings</a>
                                    </li>
                                    <li>
                                        <a onClick={handleLogout} className="block px-4 py-2 text-gray-900 hover:bg-red-600 hover:text-white rounded transition duration-200 cursor-pointer">Logout</a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-500 transition duration-200"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}
