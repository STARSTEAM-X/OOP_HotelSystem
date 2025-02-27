import { useState } from "react";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่า password กับ confirmPassword ตรงกันหรือไม่
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                    phone: formData.phone
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            alert("Registration successful!");
            window.location.href = "/login"; // ไปที่หน้า login หลังสมัครเสร็จ
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Create your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Username</label>
                        <input onChange={handleChange} type="text" name="username" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Full Name</label>
                        <input onChange={handleChange} type="text" name="name" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Phone Number</label>
                        <input onChange={handleChange} type="tel" name="phone" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Email Address</label>
                        <input onChange={handleChange} type="email" name="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Password</label>
                        <input onChange={handleChange} type="password" name="password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
                        <input onChange={handleChange} type="password" name="confirmPassword" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm" />
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600">
                            Sign up
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?
                    <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500"> Sign in</a>
                </p>
            </div>
        </div>
    );
}