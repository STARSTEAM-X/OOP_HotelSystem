import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // ดึงค่า username จาก localStorage
    const username = useMemo(() => localStorage.getItem("username"), []);
    const userrole = useMemo(() => localStorage.getItem("role"), []);


    // ตั้งค่า avatar อัตโนมัติ
    const avatar = useMemo(
        () => (username ? "https://images-ext-1.discordapp.net/external/ggrILEyY1bj4lVlyLXrB6eT7lPCk1xekZ4tLjCVYMZk/%3Fsize%3D512/https/cdn.discordapp.com/avatars/693722639125970975/bdf4b98ff170edcc46ec3ada4937be44.webp?format=webp&width=640&height=640" : ""),
        [username]
    );

    useEffect(() => {
        const checkAdminStatus = () => {
            if (username && userrole === "admin") {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [username, userrole]);


    useEffect(() => {
        const handleStorageChange = () => {
            window.location.reload(); // Refresh หน้าเพื่อให้ Avatar และ State อัปเดตอัตโนมัติ
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setIsProfileOpen(false);
        navigate("/register");
        window.dispatchEvent(new Event("storage")); // แจ้งให้ Component อื่นอัปเดต
    };

    return (
        <nav className="bg-white text-gray-900 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <a href={isAdmin ? "/admin/room" : "/"} className="text-2xl font-bold text-gray-900">HotelSystem</a>
                <div className="hidden md:flex space-x-6">
                    {!isAdmin && (
                        <>
                            <a href="/home" className="text-gray-900 hover:text-indigo-600">Home</a>
                            <a href="/my_booking" className="text-gray-900 hover:text-indigo-600">My Booking</a>
                            <a href="/my_feedback" className="text-gray-900 hover:text-indigo-600">My Feedback</a>
                            <a href="/my_review" className="text-gray-900 hover:text-indigo-600">My Review</a>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <a href="/admin/room" className="text-gray-900 hover:text-indigo-600">Room</a>
                            <a href="/admin/user" className="text-gray-900 hover:text-indigo-600">User</a>
                            <a href="/admin/booking" className="text-gray-900 hover:text-indigo-600">Booking</a>
                            <a href="/admin/discount" className="text-gray-900 hover:text-indigo-600">Discount</a>
                            <a href="/admin/feedback" className="text-gray-900 hover:text-indigo-600">Feedback</a>
                            <a href="/admin/review" className="text-gray-900 hover:text-indigo-600">Review</a>
                        </>
                    )}
                </div>

                {username ? (
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
                            <span className="hidden md:block font-medium">{username}</span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-48 p-2 z-10 transition-all duration-300 ease-in-out">
                                <ul className="flex flex-col space-y-1">
                                    {/* <li>
                                        <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded transition duration-200">Profile</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded transition duration-200">Settings</a>
                                    </li> */}
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