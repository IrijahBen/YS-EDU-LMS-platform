import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
    }, [filters]);

    const debouncedSearch = useCallback(
        debounce((val) => setFilters({ search: val }), 400),
        []
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

    // Safely generate active filters
    const activeFilters = Object.entries(filters || {}).filter(([k, v]) => v && k !== 'sort' && k !== 'search' && k !== 'isFree');

    return (
        <div className="page-container py-8 mt-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-heading font-bold mb-1 text-[#0A3D62] dark:text-white">Subjects & Mock Exams</h1>
                <p className="text-muted-foreground">
                    {(pagination?.total || 0) > 0 ? `${pagination.total.toLocaleString()} study materials available` : 'Explore our exam prep catalog'}
                </p>
            </div>

            {/* Search + Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={handleSearchChange}
                        placeholder="Search subjects, topics, past questions..."
                        className="input-field pl-9 border-gray-200 dark:border-gray-800 focus:ring-[#0A3D62] w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filters?.sort || 'newest'}
                        onChange={(e) => setFilters({ sort: e.target.value })}
                        className="input-field w-auto text-sm border-gray-200 dark:border-gray-800"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${showFilters ? 'bg-[#0A3D62] text-white border-[#0A3D62]' : 'border-border hover:bg-muted'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFilters.length > 0 && (
                            <span className="bg-white text-[#0A3D62] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {activeFilters.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {activeFilters.map(([key, value]) => (
                        <span key={key} className="flex items-center gap-1 bg-blue-50 text-[#0A3D62] dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-xs px-3 py-1 rounded-full">
                            {value}
                            <button onClick={() => clearFilter(key)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                    <button onClick={() => setFilters({ category: '', level: '', minPrice: '', maxPrice: '', isFree: false, search: '' })}
                        className="text-xs text-muted-foreground hover:text-foreground underline">
                        Clear all
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* ── Sticky Sidebar Filters ─────────────────────────────── */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.aside
                            initial={{ opacity: 0, width: 0, x: -20 }}
                            animate={{ opacity: 1, width: 'auto', x: 0 }}
                            exit={{ opacity: 0, width: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full md:w-[280px] shrink-0"
                        >
                            <div className="space-y-6 sticky top-24">
                                
                                {/* Category Filter */}
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-semibold text-sm mb-3 text-gray-900 dark:text-white uppercase tracking-wider">Subject</h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {CATEGORIES.map((cat) => (
                                            <label key={cat} className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-[#0A3D62] dark:hover:text-blue-400 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={filters?.category === cat}
                                                    onChange={() => setFilters({ category: cat })}
                                                    className="accent-[#0A3D62] w-4 h-4 shrink-0"
                                                />
                                                <span className="text-sm truncate">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Exam Type Filter */}
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-semibold text-sm mb-3 text-gray-900 dark:text-white uppercase tracking-wider">Exam Type</h3>
                                    <div className="space-y-3">
                                        {EXAM_LEVELS.map((lvl) => (
                                            <label key={lvl} className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-[#0A3D62] dark:hover:text-blue-400 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="level"
                                                    checked={filters?.level === lvl}
                                                    onChange={() => setFilters({ level: lvl })}
                                                    className="accent-[#0A3D62] w-4 h-4 shrink-0"
                                                />
                                                <span className="text-sm font-medium">{lvl}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* ── Main Course Grid ──────────────────────────────────────── */}
                <div className="flex-1 w-full min-w-0">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (!courses || courses.length === 0) ? (
                        // ✅ THE FIX: Safely checks if courses is null/undefined before checking length
                        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center px-4 shadow-sm">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No subjects found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                We couldn't find any study materials matching your current filters. Try adjusting your search criteria or clearing filters.
                            </p>
                            {activeFilters.length > 0 && (
                                <button 
                                    onClick={() => setFilters({ category: '', level: '', minPrice: '', maxPrice: '', isFree: false, search: '' })}
                                    className="mt-8 px-6 py-3 bg-[#0A3D62] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* ✅ THE FIX: Added ?.map to ensure it doesn't crash if it's undefined */}
                                {courses?.map((course) => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {(pagination?.pages || 0) > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-16 pb-8">
                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                                                page === pagination.currentPage
                                                ? 'bg-[#0A3D62] text-white shadow-lg shadow-blue-900/20 scale-110'
                                                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0A3D62]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
