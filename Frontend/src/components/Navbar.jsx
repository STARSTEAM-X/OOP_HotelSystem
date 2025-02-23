import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Sample user data
    const user = {
        name: "SSX ツ",
        avatar: "https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&",
    };

    return (
        <nav className="bg-white text-gray-900 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <a href="/" className="text-2xl font-bold text-gray-900">MyLogo</a>

                {/* Hamburger Menu (Mobile) */}
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

                {/* Menu Items */}
                <ul className={`md:flex space-x-6 absolute md:static bg-white w-full left-0 md:w-auto md:bg-transparent
          transition-all duration-300 ease-in-out ${isOpen ? "top-12" : "-top-60"}`}>
                    <li><a href="/home" className="block px-4 py-2 text-gray-900 hover:text-indigo-600">Home</a></li>
                    <li><a href="/viewbooking" className="block px-4 py-2 text-gray-900 hover:text-indigo-600">View booking</a></li>
                    <li><a href="/manageroom" className="block px-4 py-2 text-gray-900 hover:text-indigo-600">Management</a></li>
                </ul>

                {/* User Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="hidden md:block">{user.name}</span>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md">
                            <ul>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Profile</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Settings</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-red-600">Logout</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
