import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageDiscount() {
    const navigate = useNavigate();
    const [discounts, setDiscounts] = useState([]);
    const [selectedTab, setSelectedTab] = useState("view");
    const [addDiscountDetails, setAddDiscountDetails] = useState({
        code: "",
        percent: ""
    });
    const [updateDiscountDetails, setUpdateDiscountDetails] = useState({
        code: "",
        percent: ""
    });
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCriterion, setSearchCriterion] = useState("code");

    useEffect(() => {
        if (selectedTab === "view") {
            fetchDiscounts();
        }
    }, [selectedTab]);

    const fetchDiscounts = async () => {
        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/admin/discount/view", {
                username: localStorage.getItem("username")
            });
            setDiscounts(data);
        } catch (error) {
            setDiscounts([]);
            setErrorMessage("Failed to fetch discounts.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setAddDiscountDetails({ ...addDiscountDetails, [name]: value });
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateDiscountDetails({ ...updateDiscountDetails, [name]: value });
    };

    const handleAddDiscount = async () => {
        try {
            if (addDiscountDetails.percent > 99 || addDiscountDetails.percent < 1) {
                setErrorMessage("Percent must be between 1 and 99.");
                return;
            }

            await axios.post("http://127.0.0.1:5000/api/admin/discount/add", {
                username: localStorage.getItem("username"),
                ...addDiscountDetails
            });
            setErrorMessage("");
            fetchDiscounts();
        } catch (error) {
            setErrorMessage("Failed to add discount.");
        }
    };

    const handleUpdateDiscount = (discount) => {
        setSelectedDiscount(discount);
        setUpdateDiscountDetails(discount);
        setIsModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        try {
            if (updateDiscountDetails.percent > 99 || updateDiscountDetails.percent < 1) {
                setErrorMessage("Percent must be between 1 and 99.");
                return;
            }
            await axios.post("http://127.0.0.1:5000/api/admin/discount/update", {
                username: localStorage.getItem("username"),
                ...updateDiscountDetails
            });
            setErrorMessage("");
            fetchDiscounts();
            setIsModalOpen(false);
        } catch (error) {
            setErrorMessage("Failed to update discount.");
        }
    };

    const handleDeleteDiscount = async (code) => {
        try {
            await axios.post("http://127.0.0.1:5000/api/admin/discount/delete", {
                username: localStorage.getItem("username"),
                code
            });
            setErrorMessage("");
            fetchDiscounts();
        } catch (error) {
            setErrorMessage("Failed to delete discount.");
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredDiscounts = discounts.filter((discount) => {
        switch (searchCriterion) {
            case "code":
                return discount.code.toLowerCase().includes(searchTerm.toLowerCase());
            case "percent":
                return discount.percent.toString().includes(searchTerm);
            default:
                return true;
        }
    });

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Manage Discounts</h1>
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
                                    <option value="code">Discount Code</option>
                                    <option value="percent">Percent</option>
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
                            <p className="text-center text-gray-700">Loading discounts...</p>
                        ) : (
                            <div>
                                {filteredDiscounts.map((discount) => (
                                    <div key={discount.code} className="flex items-center border-b py-4">
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-gray-800">{discount.code}</h3>
                                            <p className="text-gray-600">Percent: {discount.percent}%</p>
                                        </div>
                                        <div className="ml-4 flex space-x-2">
                                            <button
                                                onClick={() => handleUpdateDiscount(discount)}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDiscount(discount.code)}
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
                            <label className="block text-sm font-medium text-gray-900">Discount Code</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="text"
                                    name="code"
                                    value={addDiscountDetails.code}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter discount code"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900">Percent</label>
                            <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    type="number"
                                    name="percent"
                                    min={0}
                                    max={99}
                                    value={addDiscountDetails.percent}
                                    onChange={handleAddInputChange}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    placeholder="Enter percent"
                                />
                            </div>
                        </div>
                        {errorMessage && <p className="text-red-500 mt-2 col-span-2">{errorMessage}</p>}
                        <div className="flex justify-end col-span-2">
                            <button
                                onClick={handleAddDiscount}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Add Discount
                            </button>
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Discount Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900">Discount Code</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="text"
                                            name="code"
                                            value={updateDiscountDetails.code}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900">Percent</label>
                                    <div className="mt-2 flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="number"
                                            min={0}
                                            max={99}
                                            name="percent"
                                            value={updateDiscountDetails.percent}
                                            onChange={handleUpdateInputChange}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
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
                                        Update Discount
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