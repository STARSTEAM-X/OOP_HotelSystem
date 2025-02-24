import { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function Footer() {
    const [isPrivacyOpen, setPrivacyOpen] = useState(false);
    const [isTermsOpen, setTermsOpen] = useState(false);

    return (
        <footer className="bg-white text-gray-900 py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
                <div className="mt-2 flex justify-center space-x-4">
                    <button onClick={() => setPrivacyOpen(true)} className="hover:text-indigo-600">Privacy Policy</button>
                    <span>|</span>
                    <button onClick={() => setTermsOpen(true)} className="hover:text-indigo-600">Terms of Service</button>
                </div>
            </div>

            {/* Privacy Policy Modal */}
            <Dialog open={isPrivacyOpen} onClose={() => setPrivacyOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black/80">
                <div className="bg-white p-6 rounded-lg shadow-lg w-150">
                    <Dialog.Title className="text-lg font-semibold">Privacy Policy</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-gray-600">
                        We respect your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information when you use our services.
                    </Dialog.Description>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        <li>We collect only necessary data for service improvement.</li>
                        <li>Your information is never shared without consent.</li>
                        <li>You can request data deletion at any time.</li>
                    </ul>
                    <button onClick={() => setPrivacyOpen(false)} className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Close</button>
                </div>
            </Dialog>

            {/* Terms of Service Modal */}
            <Dialog open={isTermsOpen} onClose={() => setTermsOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black/80">
                <div className="bg-white p-6 rounded-lg shadow-lg w-150">
                    <Dialog.Title className="text-lg font-semibold">Terms of Service</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-gray-600">
                        By using our services, you agree to the following terms and conditions. Please read them carefully.
                    </Dialog.Description>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        <li>Use our services responsibly and lawfully.</li>
                        <li>Do not misuse or abuse the platform.</li>
                        <li>We reserve the right to modify terms as needed.</li>
                    </ul>
                    <button onClick={() => setTermsOpen(false)} className=" w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Close</button>
                </div>
            </Dialog>
        </footer>
    );
}