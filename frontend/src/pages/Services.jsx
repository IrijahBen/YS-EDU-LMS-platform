import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Plane, GraduationCap, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';

const SERVICES_DATA = {
    'Study Abroad': {
        icon: Globe,
        title: 'Study Abroad Programs',
        tagline: 'Your bridge to world-class international education.',
        description: 'We partner with top-tier universities globally to secure admissions for Nigerian students. From course selection to application processing, we handle the complexities so you can focus on your future.',
        benefits: [
            'University matching based on grades and budget', 
            'Application essay and personal statement review', 
            'Direct partnerships with schools in the UK, US, Canada, and Australia', 
            'Pre-departure briefing and accommodation assistance'
        ]
    },
    'Visa Processing': {
        icon: Plane,
        title: 'Expert Visa Processing',
        tagline: 'Navigating embassy requirements with a 95% success rate.',
        description: 'Visa applications can be daunting and highly technical. Our immigration experts provide meticulous guidance on documentation, financial proof, and interview preparation to ensure your study visa is approved without delay.',
        benefits: [
            'Comprehensive document checklist and verification', 
            'Mock visa interview sessions', 
            'Proof of funds advisory', 
            'Dependent and spouse visa assistance'
        ]
    },
    'Scholarships': {
        icon: GraduationCap,
        title: 'Scholarship Placements',
        tagline: "Quality education doesn't have to break the bank.",
        description: 'We actively track global funding opportunities, partial tuition discounts, and full-ride scholarships. We help outstanding students package their profiles to become highly competitive candidates for financial aid.',
        benefits: [
            'Access to exclusive partner-university discounts', 
            'Guidance on scholarship essays and proposals', 
            'Sports and extracurricular funding opportunities', 
            'Graduate assistantship matching for Master\'s students'
        ]
    },
    'Career Counseling': {
        icon: Briefcase,
        title: 'Career & Academic Counseling',
        tagline: 'Aligning your passion with profitable global careers.',
        description: 'Not sure what to study? Our expert counselors use personality assessments and global market trends to help you choose a course that guarantees high employability and global relevance after graduation.',
        benefits: [
            'One-on-one career mapping sessions', 
            'Post-study work visa route planning', 
            'Course-to-Career alignment strategy', 
            'Psychometric testing for secondary school leavers'
        ]
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
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-12 pb-24 font-sans overflow-hidden">
            
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="px-4 text-center max-w-4xl mx-auto mb-12 md:mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0A3D62] dark:text-blue-400 font-bold text-sm uppercase tracking-widest mb-6"
                >
                    <Briefcase className="w-4 h-4" /> What We Do
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight"
                >
                    Our Premium <span className="text-[#0A3D62] dark:text-blue-400">Services</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Comprehensive educational consultancy tailored to secure your academic future, both locally and internationally.
                </motion.p>
            </div>

            {/* ── Main Content Area ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

                    {/* ── Tabs Navigation ───────────────────────────────────────── */}
                    {/* Mobile: Horizontal Scroll | Desktop: Vertical Sticky Sidebar */}
                    <div className="w-full md:w-80 shrink-0 md:sticky md:top-28 z-20 relative">
                        
                        {/* Gradient shadows for mobile scroll indication */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent md:hidden pointer-events-none z-10"></div>
                        
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {Object.keys(SERVICES_DATA).map((key) => {
                                const TabIcon = SERVICES_DATA[key].icon;
                                const isActive = activeTab === key;
                                
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleTabChange(key)}
                                        className={`flex items-center gap-4 px-6 py-4 md:p-5 rounded-2xl font-bold transition-all duration-300 text-left whitespace-nowrap shrink-0 snap-center md:w-full ${
                                            isActive
                                                ? 'bg-[#0A3D62] text-white shadow-xl shadow-blue-900/20 md:translate-x-3 scale-100'
                                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800 scale-95 md:scale-100'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                            <TabIcon className="w-5 h-5" />
                                        </div>
                                        <span className="text-base md:text-lg">{key}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Active Content Display ────────────────────────────────── */}
                    <div className="flex-1 w-full min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl shadow-black/5"
                            >
                                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-8 text-[#0A3D62] dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                                    <ActiveIcon className="w-10 h-10" />
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                                    {SERVICES_DATA[activeTab].title}
                                </h2>
                                <p className="text-xl md:text-2xl font-semibold text-amber-500 mb-8 leading-snug">
                                    {SERVICES_DATA[activeTab].tagline}
                                </p>

                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                                    {SERVICES_DATA[activeTab].description}
                                </p>

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 sm:p-10 mb-10 border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
                                        What this service includes:
                                    </h3>
                                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                                        {SERVICES_DATA[activeTab].benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                                                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <span className="leading-relaxed font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link 
                                    to="/contact" 
                                    className="inline-flex items-center justify-center w-full sm:w-auto gap-3 px-10 py-5 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-2xl transition-all shadow-[0_10px_20px_rgba(10,61,98,0.2)] hover:shadow-[0_10px_25px_rgba(10,61,98,0.3)] hover:-translate-y-1 text-lg"
                                >
                                    Book a Consultation <ArrowRight className="w-6 h-6" />
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
