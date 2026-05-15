import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';

export default function Terms() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-10 pb-20">
            <div className="page-container max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-[#0A3D62] dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">Terms of Service</h1>
                    <p className="text-gray-500 dark:text-gray-400">Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 prose dark:prose-invert max-w-none">
                    <p className="lead text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Yoj Simcha Educational Consultancy platform operated by us.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        By accessing or using our platform, creating an account, or enrolling in our courses or mock exams, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Accounts and Registration</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                        <li>You must provide accurate, complete, and current information when creating an account.</li>
                        <li>You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password.</li>
                        <li>You may not share your account credentials with third parties. Account sharing may result in immediate suspension without a refund.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Course Content and Mock Exams</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        All materials, including videos, texts, questions, and resources provided on this platform are the intellectual property of YS Edu or its instructors.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                        <li>You are granted a limited, non-exclusive, non-transferable license to access and view the courses and exams for which you have enrolled solely for your personal, non-commercial, educational purposes.</li>
                        <li>Mock exams are designed for practice and preparation. YS Edu does not guarantee specific scores in actual external examinations (e.g., UTME, WAEC).</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Code of Conduct</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Users are expected to conduct themselves respectfully. Any form of harassment, spamming, or use of the platform for illegal activities is strictly prohibited. When leaving course reviews, you agree to provide honest feedback based on your actual experience.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Limitation of Liability</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        In no event shall YS Edu, its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Changes to Terms</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                </div>
            </div>
        </div>
    );
}