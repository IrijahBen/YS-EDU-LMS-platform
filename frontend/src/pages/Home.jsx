import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search, Play, Star, Users, BookOpen, Award, ArrowRight,
    CheckCircle, TrendingUp, Globe, Zap, Shield, Sparkles
} from 'lucide-react';
import CourseCard from '../components/common/CourseCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import useCourseStore from '../store/courseStore';

const CATEGORIES = [
    // ================= GENERAL / COMPULSORY =================
    {
        name: 'English Language',
        category: 'General',
        isUTME: true,
        icon: '📖',
        color: 'text-violet-500 bg-violet-100 dark:bg-violet-500/20'
    },
    {
        name: 'Mathematics',
        category: 'General',
        isUTME: true,
        icon: '➗',
        color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/20'
    },

    // ================= SCIENCES =================
    {
        name: 'Physics',
        category: 'Sciences',
        isUTME: true,
        icon: '⚛️',
        color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20'
    },
    {
        name: 'Chemistry',
        category: 'Sciences',
        isUTME: true,
        icon: '🧪',
        color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20'
    },
    {
        name: 'Biology',
        category: 'Sciences',
        isUTME: true,
        icon: '🧬',
        color: 'text-green-500 bg-green-100 dark:bg-green-500/20'
    },
    {
        name: 'Agricultural Science',
        category: 'Sciences',
        isUTME: true,
        icon: '🌾',
        color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20'
    },
    {
        name: 'Further Mathematics',
        category: 'Sciences',
        isUTME: false, // Typically a secondary school subject, not standard UTME
        icon: '🧮',
        color: 'text-sky-500 bg-sky-100 dark:bg-sky-500/20'
    },
    {
        name: 'Computer Studies',
        category: 'Sciences',
        isUTME: true,
        icon: '💻',
        color: 'text-slate-500 bg-slate-100 dark:bg-slate-500/20'
    },

    // ================= SOCIAL SCIENCES =================
    {
        name: 'Economics',
        category: 'Social Sciences',
        isUTME: true,
        icon: '📈',
        color: 'text-amber-500 bg-amber-100 dark:bg-amber-500/20'
    },
    {
        name: 'Government',
        category: 'Social Sciences',
        isUTME: true,
        icon: '🏛️',
        color: 'text-rose-500 bg-rose-100 dark:bg-rose-500/20'
    },
    {
        name: 'Geography',
        category: 'Social Sciences',
        isUTME: true,
        icon: '🌍',
        color: 'text-teal-500 bg-teal-100 dark:bg-teal-500/20'
    },

    // ================= COMMERCIAL =================
    {
        name: 'Financial Accounting',
        category: 'Commercial',
        isUTME: true,
        icon: '📒',
        color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20'
    },
    {
        name: 'Commerce',
        category: 'Commercial',
        isUTME: true,
        icon: '🛍️',
        color: 'text-orange-500 bg-orange-100 dark:bg-orange-500/20'
    },
    {
        name: 'Book Keeping',
        category: 'Commercial',
        isUTME: false,
        icon: '🧾',
        color: 'text-lime-500 bg-lime-100 dark:bg-lime-500/20'
    },

    // ================= ARTS & HUMANITIES =================
    {
        name: 'Literature in English',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '🎭',
        color: 'text-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-500/20'
    },
    {
        name: 'CRK',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '✝️',
        color: 'text-purple-500 bg-purple-100 dark:bg-purple-500/20'
    },
    {
        name: 'IRK',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '☪️',
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-600/20'
    },
    {
        name: 'History',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '📜',
        color: 'text-stone-500 bg-stone-100 dark:bg-stone-500/20'
    },
    {
        name: 'Fine Arts',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '🎨',
        color: 'text-pink-500 bg-pink-100 dark:bg-pink-500/20'
    },
    {
        name: 'French',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '🇫🇷',
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-600/20'
    },
    {
        name: 'Yoruba',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '🗣️',
        color: 'text-red-500 bg-red-100 dark:bg-red-500/20'
    },
    {
        name: 'Igbo',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '🗣️',
        color: 'text-orange-600 bg-orange-100 dark:bg-orange-600/20'
    },
    {
        name: 'Hausa',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '🗣️',
        color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-700/20'
    },
    {
        name: 'Music',
        category: 'Arts & Humanities',
        isUTME: true,
        icon: '🎵',
        color: 'text-indigo-400 bg-indigo-100 dark:bg-indigo-400/20'
    }
];

const STATS = [
    { value: '50K+', label: 'Students', icon: Users },
    { value: '1,200+', label: 'Courses', icon: BookOpen },
    { value: '300+', label: 'Instructors', icon: Award },
    { value: '4.8', label: 'Avg Rating', icon: Star },
];

const FEATURES = [
    { icon: Zap, title: 'Learn at Your Pace', desc: 'Access courses anytime, anywhere on any device.' },
    { icon: Shield, title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience.' },
    { icon: Award, title: 'Earn Certificates', desc: 'Get recognized certificates upon course completion.' },
    { icon: Globe, title: 'Global Community', desc: 'Join millions of learners from around the world.' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Home() {
    const navigate = useNavigate();
    // THE FIX: Changed from `featuredCourses` to `courses` to pull ALL available published courses
    const { courses, isLoading, fetchCourses } = useCourseStore();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // THE FIX: Fetch all courses instead of only featured ones
        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <div className="overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">

            {/* ── Hero Section (Mockup Match with Screenshot Details) ─────────────────────────────────── */}
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-30 dark:opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-brand-100 dark:bg-brand-900 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
                    <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900 rounded-full blur-3xl -translate-x-1/2 translate-y-1/4" />
                    {/* Mockup ZigZags and Dots (Simulated) */}
                    <svg className="absolute right-20 top-20 text-gray-300 dark:text-gray-700" width="100" height="100" fill="none" viewBox="0 0 100 100">
                        <path stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" d="M0 50 Q 25 0, 50 50 T 100 50" />
                        <path stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" d="M0 70 Q 25 20, 50 70 T 100 70" />
                    </svg>
                </div>

                <div className="page-container relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-6 text-[#0A3D62] dark:text-blue-400 font-semibold tracking-wide uppercase text-sm">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <span>Yoj Simcha Educational Consultancy</span>
                            </motion.div>

                            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-[#0A3D62] dark:text-white leading-[1.1] mb-6 font-heading tracking-tight">
                                Empowering your Higher <br className="hidden lg:block" />
                                <span className="relative inline-block">Education Journey
                                    {/* Yellow curved underline */}
                                    <svg className="absolute -bottom-2 left-0 w-full text-yellow-400" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 15C50 5 150 5 198 15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                    </svg>
                                </span> <br className="hidden lg:block" /> with Expert Guidance
                            </motion.h1>

                            <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                                Personalized support to help you achieve your academic goals and unlock future opportunities.
                            </motion.p>

                            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                                <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-[#0A3D62] dark:bg-blue-600 hover:bg-[#072a44] dark:hover:bg-blue-700 text-white font-semibold transition-colors text-center shadow-md">
                                    Get started
                                </Link>
                                <Link to="/contact" className="w-full sm:w-auto px-8 py-3.5 text-[#0A3D62] dark:text-blue-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center">
                                    Contact us
                                </Link>
                            </motion.div>

                            <motion.form initial="hidden" animate="visible" variants={fadeUp} custom={4} onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto lg:mx-0 shadow-lg dark:shadow-none border border-gray-200 dark:border-gray-800 rounded-full p-2 bg-white dark:bg-gray-900">
                                <div className="flex-1 relative flex items-center">
                                    <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search subjects or topics..." className="w-full pl-12 pr-4 py-2 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-sm" />
                                </div>
                                <button type="submit" className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-colors whitespace-nowrap">
                                    Search
                                </button>
                            </motion.form>
                        </div>

                        {/* Right Content / Image */}
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
                            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-full scale-90 translate-x-4" />

                            <div className="relative z-10 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border-[6px] border-[#0A3D62] dark:border-blue-500 p-2 bg-white dark:bg-gray-950 shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=800" alt="Student smiling with books" className="w-full h-full object-cover rounded-full" />
                            </div>

                            <div className="absolute bottom-4 left-0 lg:left-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl z-20 flex flex-col items-center border border-gray-100 dark:border-gray-700">
                                <div className="flex -space-x-4 mb-3">
                                    <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" src="https://i.pravatar.cc/100?img=1" alt="User" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" src="https://i.pravatar.cc/100?img=2" alt="User" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" src="https://i.pravatar.cc/100?img=3" alt="User" />
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-yellow-400 flex items-center justify-center text-xs font-bold text-gray-900">2K+</div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">100K+</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Enrolled Students</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Curve Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-white dark:text-gray-950">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[150%] md:w-full h-[60px] md:h-[100px] fill-current">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
                    </svg>
                </div>
            </section>

            {/* ── Retained Stats Section ───────────────────────────────────────── */}
            <section className="py-8 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                <div className="page-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {STATS.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                                    <div className="text-3xl font-bold font-heading text-gray-900 dark:text-white">{stat.value}</div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <Icon className="w-4 h-4" /> {stat.label}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Top Categories / Subjects ────────────────────────────────── */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="page-container">
                    <div className="text-center mb-12 relative">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading inline-block relative">
                            Subjects & Disciplines
                            <svg className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 text-yellow-400" viewBox="0 0 100 15" fill="none">
                                <path d="M5 10Q50 0 95 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat, i) => (
                            <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                <Link to={`/courses?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-3 p-3 pr-4 rounded-full border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all group">

                                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg shadow-sm ${cat.color} group-hover:scale-110 transition-transform`}>
                                        {cat.icon}
                                    </div>

                                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                        {cat.name}
                                    </span>

                                    {/* UTME Badge aligned to the right */}
                                    {cat.isUTME && (
                                        <span className="ml-auto text-[10px] tracking-wider font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full shrink-0">
                                            UTME
                                        </span>
                                    )}

                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Promo Banners ──────────────────────────── */}
            <section className="py-10">
                <div className="page-container">
                    <div className="grid md:grid-cols-2 gap-8">

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-teal-50 dark:bg-teal-900/10 rounded-[2rem] p-10 overflow-hidden border border-teal-100 dark:border-teal-900/30">
                            <svg className="absolute top-0 right-0 text-teal-200 dark:text-teal-800/30 w-64 h-64 -translate-y-1/2 translate-x-1/4" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" /></svg>

                            <div className="relative z-10 max-w-[60%]">
                                <span className="text-teal-600 dark:text-teal-400 font-medium text-sm">Learn together with</span>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4 font-heading">Expert Teacher</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">If you've been researching exactly what skill you want, start here.</p>
                                <Link to="/instructors" className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-sm transition-colors">
                                    View All Courses
                                </Link>
                            </div>
                            <div className="absolute right-[-10%] bottom-[-10%] w-1/2 h-full pointer-events-none">
                                <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=300&q=80" alt="Teacher" className="absolute bottom-10 right-10 w-40 h-40 object-cover rounded-xl shadow-lg rotate-3" />
                                <img src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=150&q=80" alt="Student" className="absolute top-10 right-24 w-20 h-20 object-cover rounded-full shadow-md border-4 border-white dark:border-gray-800" />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] p-10 overflow-hidden border border-blue-100 dark:border-blue-900/30">
                            <svg className="absolute bottom-0 right-0 text-blue-200 dark:text-blue-800/30 w-64 h-64 translate-y-1/3 translate-x-1/3" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" /></svg>

                            <div className="relative z-10 max-w-[60%]">
                                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Get the skills</span>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4 font-heading">For Individuals</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">Master new technologies and accelerate your personal career growth.</p>
                                <Link to="/courses" className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-sm transition-colors">
                                    Find Your Course
                                </Link>
                            </div>
                            <div className="absolute right-[-10%] bottom-[-10%] w-1/2 h-full pointer-events-none">
                                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80" alt="Individual" className="absolute bottom-10 right-10 w-40 h-40 object-cover rounded-xl shadow-lg -rotate-3" />
                                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80" alt="Learning" className="absolute top-10 right-32 w-20 h-20 object-cover rounded-full shadow-md border-4 border-white dark:border-gray-800" />
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ── Popular Courses ───────────────────────────────────── */}
            <section className="py-20">
                <div className="page-container">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                        <div className="relative">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">Popular Courses</h2>
                            <svg className="absolute -bottom-2 left-0 w-24 text-yellow-400" viewBox="0 0 100 15" fill="none">
                                <path d="M5 10Q50 0 95 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                        <Link to="/courses" className="px-6 py-2.5 border-2 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-semibold rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-sm">
                            View All Courses
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* THE FIX: Replaced `featuredCourses` with `courses` */}
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                            : (courses || []).slice(0, 8).map((course) => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                    </div>
                    {!isLoading && courses?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No popular courses right now. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Retained Features Section ────────────────────────────────────── */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                <div className="page-container">
                    <div className="text-center mb-16 relative">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading inline-block relative">
                            Why Choose Yoj Simcha Educational Consultancy?
                            <svg className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 text-yellow-400" viewBox="0 0 100 15" fill="none">
                                <path d="M5 10Q50 0 95 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-6 max-w-xl mx-auto">
                            We provide the best learning experience with cutting-edge tools and expert guidance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl dark:hover:shadow-brand-900/10 transition-shadow text-center group">
                                    <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{f.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Retained CTA Section ─────────────────────────────────────────── */}
            <section className="py-24 bg-brand-600 dark:bg-brand-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="page-container text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-brand-100 mb-10 max-w-2xl mx-auto text-lg">
                            Join thousands of students already learning on Yoj Simcha Educational Consultancy. Get unlimited access to all courses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="px-8 py-4 bg-white text-brand-700 font-bold rounded-full hover:bg-gray-50 transition-colors shadow-lg shadow-brand-900/20">
                                Get Started Free
                            </Link>
                            <Link to="/courses" className="px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2">
                                <Play className="w-5 h-5 fill-current" /> Browse Courses
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}