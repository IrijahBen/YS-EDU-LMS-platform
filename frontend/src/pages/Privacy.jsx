import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function Privacy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-10 pb-20">
            <div className="page-container max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-[#0A3D62] dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">Privacy Policy</h1>
                    <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 prose dark:prose-invert max-w-none">
                    <p className="lead text-lg text-gray-600 dark:text-gray-300 mb-8">
                        At Yoj Simcha Educational Consultancy ("YS Edu", "we", "us", or "our"), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our platform or use our services.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">We collect several different types of information for various purposes to provide and improve our Service to you:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                        <li><strong>Personal Data:</strong> Name, email address, phone number, and educational background when you register for an account.</li>
                        <li><strong>Usage Data:</strong> Information on how you interact with our courses, mock exams, and platform features.</li>
                        <li><strong>Performance Data:</strong> Scores, completion rates, and answers submitted during CBT mock exams to track your academic progress.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Data</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">We use the collected data for various purposes:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                        <li>To provide, maintain, and monitor the usage of our platform.</li>
                        <li>To manage your account and course enrollments.</li>
                        <li>To generate verifiable certificates upon course completion.</li>
                        <li>To analyze exam performance and provide personalized academic recommendations.</li>
                        <li>To notify you about changes to our Service, new courses, or important updates.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Data Security</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        The security of your data is important to us. We implement industry-standard security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site. However, please remember that no method of transmission over the Internet is 100% secure.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Cookies</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies help us remember your login sessions and preferences, ensuring a smoother learning experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Contact Us</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        If you have any questions about this Privacy Policy or how we handle your data, please contact us at: <br />
                        <strong className="text-[#0A3D62] dark:text-blue-400 mt-2 inline-block">yojsimcha@gmail.com</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}