import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageUser() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedTab, setSelectedTab] = useState("view");
    const [addUserDetails, setAddUserDetails] = useState({
        name: "",
        email: "",
        phone: "",
        username_new: "",
        password: "",
        role: "customer",
        position: ""
    });
    const [updateUserDetails, setUpdateUserDetails] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // New state for search input
    const [searchCriterion, setSearchCriterion] = useState("name"); // New state for search criterion

    useEffect(() => {
        if (selectedTab === "view") {
            fetchUsers();
        }
    }, [selectedTab]);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/admin/user/view", {
                username: localStorage.getItem("username")
            });
            setUsers(data);
        } catch (error) {
            setErrorMessage("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setAddUserDetails({ ...addUserDetails, [name]: value });
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateUserDetails({ ...updateUserDetails, [name]: value });
    };

    const handleAddUser = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/user/add", {
                username: localStorage.getItem("username"),
                ...addUserDetails
            });
            setErrorMessage("");
            alert("User added successfully.");
            fetchUsers();
        } catch (error) {
            setErrorMessage("Failed to add user.");
        }
    };

    const handleUpdateUser = (user) => {
        setSelectedUser(user);
        setUpdateUserDetails(user);
        setIsModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/user/update", {
                username: localStorage.getItem("username"),
                username_target: selectedUser.username,
                ...updateUserDetails
            });
            setErrorMessage("");
            fetchUsers();
            alert("User updated successfully.");
            setIsModalOpen(false);
        } catch (error) {
            setErrorMessage("Failed to update user.");
        }
    };

    const handleDeleteUser = async (username_target) => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/user/delete", {
                username: localStorage.getItem("username"),
                username_target
            });
            setErrorMessage("");
            alert("User deleted successfully.");
            fetchUsers();
        } catch (error) {
            setErrorMessage("Failed to delete user.");
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter((user) => {
        switch (searchCriterion) {
            case "name":
                return user.name.toLowerCase().includes(searchQuery.toLowerCase());
            case "username":
                return user.username.toLowerCase().includes(searchQuery.toLowerCase());
            case "phone":
                return user.phone.toLowerCase().includes(searchQuery.toLowerCase());
            case "email":
                return user.email.toLowerCase().includes(searchQuery.toLowerCase());
            default:
                return true;
        }
    });

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Manage Users</h1>
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
                                    <option value="name">Name</option>
                                    <option value="username">Username</option>
                                    <option value="phone">Phone</option>
                                    <option value="email">Email</option>
                                </select>
                                <input
                                    type="text"
                                    id="search"
                                    name="search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder={`Search by ${searchCriterion}`}
                                />
                            </div>
                        </div>
                        {loading ? (
                            <p className="text-center text-gray-700">Loading users...</p>
                        ) : (
                            <div>
                                {filteredUsers.map((user) => (
                                    <div key={user.username} className="flex items-center border-b py-4">
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                                            <p className="text-gray-600">Username: {user.username}</p>
                                            <p className="text-gray-600">Role: {user.role}</p>
                                            <p className="text-gray-600">Email: {user.email}</p>
                                            <p className="text-gray-600">Phone: {user.phone}</p>
                                        </div>
                                        <div className="ml-4 flex space-x-2">
                                            <button
                                                onClick={() => handleUpdateUser(user)}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.username)}
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
                            <label className="block text-sm font-medium text-gray-900">Name</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="text"
                                    name="name"
                                    value={addUserDetails.name}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter name"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Phone</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="text"
                                    name="phone"
                                    value={addUserDetails.phone}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-sm font-medium text-gray-900">Email</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="email"
                                    name="email"
                                    value={addUserDetails.email}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Username</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="text"
                                    name="username_new"
                                    value={addUserDetails.username_new}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Password</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="password"
                                    name="password"
                                    value={addUserDetails.password}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Role</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <select
                                    name="role"
                                    value={addUserDetails.role}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        {addUserDetails.role === "admin" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-900">Position</label>
                                <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        type="text"
                                        name="position"
                                        value={addUserDetails.position}
                                        onChange={handleAddInputChange}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        placeholder="Enter position"
                                    />
                                </div>
                            </div>
                        )}
                        {errorMessage && <p className="text-red-500 mt-2 col-span-2">{errorMessage}</p>}
                        <div className="flex justify-end col-span-2">
                            <button
                                onClick={handleAddUser}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Add User
                            </button>
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Update User Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900">Name</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="text"
                                            name="name"
                                            value={updateUserDetails.name}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter name"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900">Phone</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={updateUserDetails.phone}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4 col-span-2">
                                    <label className="block text-sm font-medium text-gray-900">Email</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="email"
                                            name="email"
                                            value={updateUserDetails.email}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter email"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4 col-span-2">
                                    <label className="block text-sm font-medium text-gray-900">Password</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="password"
                                            name="password"
                                            value={updateUserDetails.password}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            placeholder="Enter password"
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
                                        Update User
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