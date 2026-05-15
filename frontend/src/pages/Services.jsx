import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Plane, GraduationCap, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';

const SERVICES_DATA = {
    'Study Abroad': {
        icon: Globe,
        title: 'Study Abroad Programs',
        tagline: 'Your bridge to world-class international education.',
        description: 'We partner with top-tier universities globally to secure admissions for Nigerian students. From course selection to application processing, we handle the complexities so you can focus on your future.',
        benefits: ['University matching based on grades and budget', 'Application essay and personal statement review', 'Direct partnerships with schools in the UK, US, Canada, and Australia', 'Pre-departure briefing and accommodation assistance']
    },
    'Visa Processing': {
        icon: Plane,
        title: 'Expert Visa Processing',
        tagline: 'Navigating embassy requirements with a 95% success rate.',
        description: 'Visa applications can be daunting and highly technical. Our immigration experts provide meticulous guidance on documentation, financial proof, and interview preparation to ensure your study visa is approved without delay.',
        benefits: ['Comprehensive document checklist and verification', 'Mock visa interview sessions', 'Proof of funds advisory', 'Dependent and spouse visa assistance']
    },
    'Scholarships': {
        icon: GraduationCap,
        title: 'Scholarship Placements',
        tagline: 'Quality education doesn\'t have to break the bank.',
        description: 'We actively track global funding opportunities, partial tuition discounts, and full-ride scholarships. We help outstanding students package their profiles to become highly competitive candidates for financial aid.',
        benefits: ['Access to exclusive partner-university discounts', 'Guidance on scholarship essays and proposals', 'Sports and extracurricular funding opportunities', 'Graduate assistantship matching for Master\'s students']
    },
    'Career Counseling': {
        icon: Briefcase,
        title: 'Career & Academic Counseling',
        tagline: 'Aligning your passion with profitable global careers.',
        description: 'Not sure what to study? Our expert counselors use personality assessments and global market trends to help you choose a course that guarantees high employability and global relevance after graduation.',
        benefits: ['One-on-one career mapping sessions', 'Post-study work visa route planning', 'Course-to-Career alignment strategy', 'Psychometric testing for secondary school leavers']
    }
};

export default function Services() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read the category from the URL, default to 'Study Abroad' if none is set
    const initialCategory = searchParams.get('category') || 'Study Abroad';

    // Ensure the category actually exists in our data, otherwise default
    const [activeTab, setActiveTab] = useState(
        SERVICES_DATA[initialCategory] ? initialCategory : 'Study Abroad'
    );

    // Update the URL silently when they click a new tab
    const handleTabChange = (key) => {
        setActiveTab(key);
        setSearchParams({ category: key }, { replace: true });
    };

    const ActiveIcon = SERVICES_DATA[activeTab].icon;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-10 pb-20">
            {/* Header */}
            <div className="page-container text-center max-w-3xl mx-auto mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-heading font-bold mb-4 text-[#0A3D62] dark:text-white"
                >
                    Our Premium Services
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-lg text-gray-500 dark:text-gray-400"
                >
                    Comprehensive educational consultancy tailored to secure your academic future locally and internationally.
                </motion.p>
            </div>

            <div className="page-container max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-72 shrink-0 flex flex-col gap-2 sticky top-24">
                        {Object.keys(SERVICES_DATA).map((key) => {
                            const TabIcon = SERVICES_DATA[key].icon;
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleTabChange(key)}
                                    className={`flex items-center gap-3 w-full p-4 rounded-xl font-bold transition-all text-left ${isActive
                                            ? 'bg-[#0A3D62] text-white shadow-lg shadow-blue-900/20 translate-x-2'
                                            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
                                        }`}
                                >
                                    <TabIcon className="w-5 h-5 shrink-0" />
                                    {key}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    <motion.div
                        key={activeTab} // Forces animation to re-run on tab change
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-12 shadow-sm"
                    >
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-[#0A3D62] dark:text-blue-400">
                            <ActiveIcon className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                            {SERVICES_DATA[activeTab].title}
                        </h2>
                        <p className="text-lg font-medium text-amber-500 mb-6">
                            {SERVICES_DATA[activeTab].tagline}
                        </p>

                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                            {SERVICES_DATA[activeTab].description}
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 mb-8">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">What this service includes:</h3>
                            <ul className="space-y-4">
                                {SERVICES_DATA[activeTab].benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-xl transition-transform hover:-translate-y-1">
                            Book a Consultation <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}