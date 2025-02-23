import React from "react";

export default function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-4">Page Not Found</p>
            <p className="text-lg text-gray-600">Sorry, the page you're looking for doesn't exist.</p>
            <a
                href="/"
                className="mt-6 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
            >
                Go Back Home
            </a>
        </div>
    );
}
