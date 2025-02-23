export default function Footer() {
    return (
        <footer className="bg-white text-gray-900 py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
                <div className="mt-2 flex justify-center space-x-4">
                    <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                    <span>|</span>
                    <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}