import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, BookOpen, ChevronDown, Filter } from 'lucide-react';
import CourseCard from '../components/common/CourseCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import useCourseStore from '../store/courseStore';
import { debounce } from '../lib/utils';

// Core Subjects
const CATEGORIES = [
    'English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Agricultural Science', 'Further Mathematics', 'Computer Studies',
    'Economics', 'Government', 'Geography', 'Financial Accounting',
    'Commerce', 'Book Keeping', 'Literature in English', 'CRK', 'IRK',
    'History', 'Fine Arts', 'French', 'Yoruba', 'Igbo', 'Hausa', 'Music'
];

const EXAM_LEVELS = ['UTME (JAMB)', 'WAEC', 'NECO', 'GCE', 'Post-UTME', 'All Levels'];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest Additions' },
    { value: 'popular', label: 'Most Popular' },
];

export default function Courses() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { courses, isLoading, pagination, filters, setFilters, fetchCourses } = useCourseStore();
    
    const [showFilters, setShowFilters] = useState(window.innerWidth >= 1024);
    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        setFilters({ search, category });
        setLocalSearch(search);
        
        const handleResize = () => {
            if (window.innerWidth >= 1024) setShowFilters(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchCourses({ page: 1 });
    }, [filters, fetchCourses]);

    const debouncedSearch = useCallback(
        debounce((val) => setFilters({ search: val }), 400),
        [setFilters]
    );

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handlePageChange = (page) => {
        fetchCourses({ page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilter = (key) => setFilters({ [key]: '' });

    const clearAllFilters = () => {
        setFilters({ category: '', level: '', minPrice: '', maxPrice: '', isFree: false, search: '', sort: 'newest' });
        setLocalSearch('');
    };

    // Safely generate active filters
    const activeFilters = Object.entries(filters || {}).filter(([k, v]) => v && k !== 'sort' && k !== 'search' && k !== 'isFree');

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
            
            {/* ── Header Banner ────────────────────────────────────────────── */}
            <div className="bg-[#0A3D62] text-white pt-12 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Subjects & Mock Exams
                    </h1>
                    <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        {(pagination?.total || 0) > 0 
                            ? `Explore our catalog of ${pagination.total.toLocaleString()} premium study materials and practice tests.` 
                            : 'Explore our comprehensive exam prep catalog to boost your scores.'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 pb-20">
                
                {/* ── Search & Filter Control Bar ────────────────────────────── */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 p-4 mb-8 flex flex-col md:flex-row gap-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#0A3D62] transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={localSearch}
                            onChange={handleSearchChange}
                            placeholder="Search subjects, topics, past questions..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white focus:border-[#0A3D62] focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-400/20 rounded-xl transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="relative flex-1 md:flex-none">
                            <select
                                value={filters?.sort || 'newest'}
                                onChange={(e) => setFilters({ sort: e.target.value })}
                                className="w-full md:w-48 appearance-none bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-[#0A3D62] focus:ring-2 focus:ring-blue-900/10 rounded-xl py-3.5 pl-4 pr-10 text-gray-700 dark:text-gray-200 font-medium transition-all cursor-pointer"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-200 flex-1 md:flex-none ${
                                showFilters 
                                    ? 'bg-[#0A3D62] text-white shadow-lg shadow-blue-900/20' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Filter className="w-5 h-5" />
                            <span className="hidden sm:inline">Filters</span>
                            {activeFilters.length > 0 && (
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ml-1 ${showFilters ? 'bg-white text-[#0A3D62]' : 'bg-[#0A3D62] text-white'}`}>
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Active Filters Display ─────────────────────────────────── */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-semibold text-gray-500 mr-2">Active Filters:</span>
                        {activeFilters.map(([key, value]) => (
                            <span key={key} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-[#0A3D62] dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                                {value}
                                <button 
                                    onClick={() => clearFilter(key)} 
                                    className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                        <button 
                            onClick={clearAllFilters}
                            className="text-sm font-bold text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 ml-2 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* ── Sticky Sidebar Filters ─────────────────────────────── */}
                    <AnimatePresence initial={false}>
                        {showFilters && (
                            <motion.aside
                                initial={{ opacity: 0, width: 0, height: 0 }}
                                animate={{ opacity: 1, width: window.innerWidth >= 1024 ? 280 : '100%', height: 'auto' }}
                                exit={{ opacity: 0, width: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="w-full lg:w-[280px] shrink-0 overflow-hidden lg:overflow-visible"
                            >
                                <div className="space-y-6 lg:sticky lg:top-24 pb-4">
                                    
                                    {/* Category Filter */}
                                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <h3 className="font-bold text-base mb-4 text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-[#0A3D62]" /> Subjects
                                        </h3>
                                        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                            {CATEGORIES.map((cat) => {
                                                const isSelected = filters?.category === cat;
                                                return (
                                                    <label 
                                                        key={cat} 
                                                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                                                            isSelected 
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-[#0A3D62] dark:text-blue-400 font-bold' 
                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                            isSelected ? 'border-[#0A3D62] dark:border-blue-400' : 'border-gray-300 dark:border-gray-600'
                                                        }`}>
                                                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#0A3D62] dark:bg-blue-400" />}
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            checked={isSelected}
                                                            onChange={() => setFilters({ category: cat })}
                                                            className="hidden"
                                                        />
                                                        <span className="text-sm truncate">{cat}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Exam Type Filter */}
                                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <h3 className="font-bold text-base mb-4 text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                            <SlidersHorizontal className="w-4 h-4 text-[#0A3D62]" /> Level
                                        </h3>
                                        <div className="space-y-1">
                                            {EXAM_LEVELS.map((lvl) => {
                                                const isSelected = filters?.level === lvl;
                                                return (
                                                    <label 
                                                        key={lvl} 
                                                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                                                            isSelected 
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-[#0A3D62] dark:text-blue-400 font-bold' 
                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                            isSelected ? 'border-[#0A3D62] dark:border-blue-400' : 'border-gray-300 dark:border-gray-600'
                                                        }`}>
                                                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#0A3D62] dark:bg-blue-400" />}
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="level"
                                                            checked={isSelected}
                                                            onChange={() => setFilters({ level: lvl })}
                                                            className="hidden"
                                                        />
                                                        <span className="text-sm">{lvl}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* ── Main Course Grid ──────────────────────────────────────── */}
                    <div className="flex-1 w-full min-w-0">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : (!courses || courses.length === 0) ? (
                            
                            /* ── Empty State ──────────────────────────────────────── */
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 lg:py-32 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center px-4 shadow-sm"
                            >
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No subjects found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md text-base leading-relaxed mb-8">
                                    We couldn't find any study materials matching your exact search. Try adjusting your categories or clearing active filters.
                                </p>
                                {(activeFilters.length > 0 || localSearch) && (
                                    <button 
                                        onClick={clearAllFilters}
                                        className="px-8 py-3.5 bg-[#0A3D62] hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {courses?.map((course) => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </div>

                                {/* ── Pagination ──────────────────────────────────────── */}
                                {(pagination?.pages || 0) > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                                            const isActive = page === pagination.currentPage;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center ${
                                                        isActive
                                                        ? 'bg-[#0A3D62] text-white shadow-lg shadow-blue-900/30 scale-105'
                                                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0A3D62] dark:hover:text-white'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
