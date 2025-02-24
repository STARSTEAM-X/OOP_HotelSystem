import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Sample user data
    const user = {
        name: "STARSTEAM_X ツ",
        avatar: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
    };

    return (
        <nav className="bg-white text-gray-900 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <a href="/" className="text-2xl font-bold text-gray-900">HotelSystem</a>

                {/* Navigation Menu */}
                <div className="hidden md:flex space-x-6">
                    <a href="/home" className="text-gray-900 hover:text-indigo-600">Home</a>
                    <a href="/viewbooking" className="text-gray-900 hover:text-indigo-600">View booking</a>
                    <a href="/manageroom" className="text-gray-900 hover:text-indigo-600">Management</a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                    </svg>
                </button>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
                        <a href="/home" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Home</a>
                        <a href="/viewbooking" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">View booking</a>
                        <a href="/manageroom" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Management</a>
                    </div>
                )}

                {/* User Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200"
                    >
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full border border-gray-300"
                        />
                        <span className="hidden md:block font-medium">{user.name}</span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-48 p-2 z-10 transition-all duration-300 ease-in-out ${isProfileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                        <ul className="flex flex-col space-y-1">
                            <li>
                                <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded transition duration-200">Profile</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded transition duration-200">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-red-600 hover:text-white rounded transition duration-200">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
