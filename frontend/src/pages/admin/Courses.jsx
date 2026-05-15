import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Eye, FileText, Users, GraduationCap, ClipboardCheck } from 'lucide-react';
import { adminService } from '../../services/api'; // Use adminService to see ALL instructors' work
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadTests(1);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const loadTests = async (page = 1) => {
        setLoading(true);
        try {
            // We fetch all courses but we will filter for type 'test'
            // If your backend has a specific /admin/tests route, use that instead.
            const { data } = await adminService.getAllCourses({ search, page, type: 'test' });

            // Safety fallback to ensure tests is always an array
            const allItems = data?.courses || [];
            // Just in case the backend doesn't filter by type, we do it here:
            const filteredTests = allItems.filter(item => item.type === 'test');

            setTests(filteredTests);
            setPagination({
                total: data?.total || filteredTests.length,
                pages: data?.pages || 1,
                currentPage: data?.currentPage || 1
            });
        } catch (error) {
            console.error("Failed to load tests", error);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will delete the entire exam and all student scores associated with it.')) return;
        try {
            await adminService.deleteCourse(id);
            setTests((prev) => prev.filter((t) => t._id !== id));
            toast.success('Exam deleted successfully');
        } catch {
            toast.error('Failed to delete exam');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* ── Page Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                        <ClipboardCheck className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Active Mock Exams</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Monitor instructor-created tests and student participation
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Search Bar ───────────────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center relative">
                <Search className="absolute left-7 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by exam title, subject, or instructor name..."
                    className="w-full pl-12 pr-4 py-2 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
                />
            </div>

            {/* ── Tests Table ──────────────────────────────────────────────────── */}
            {loading ? (
                <div className="flex justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">Exam Details</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">Instructor</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">Questions</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">Takers</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {(!tests || tests.length === 0) ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <FileText className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="text-base font-medium">No Mock Exams found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map((test) => (
                                        <tr key={test._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">

                                            {/* Exam Title & Type */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 dark:text-white mb-1">{test.title}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                                            {test.examType || 'General'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500 font-medium italic">
                                                            Created {formatDate(test.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Instructor Info */}
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">{test.instructor?.name || 'Admin'}</span>
                                                </div>
                                            </td>

                                            {/* Question Count */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-bold">
                                                    <ClipboardCheck className="w-4 h-4 text-green-500" />
                                                    {/* THE FIX: Use totalLessons first, fallback to sections, then 0 */}
                                                    {test.totalLessons || test.sections?.[0]?.lessons?.length || 0} Qs
                                                </div>
                                            </td>

                                            {/* Takers / Students Count */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-[#0A3D62] dark:text-blue-400 font-bold">
                                                    <Users className="w-4 h-4" />
                                                    {test.totalStudents || 0} Students
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${test.isPublished
                                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                                                    }`}>
                                                    {test.isPublished ? 'Live' : 'Draft'}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Exam Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(test._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Exam"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                            <span className="text-xs text-gray-500 font-bold">
                                Page {pagination.currentPage} of {pagination.pages}
                            </span>
                            <div className="flex gap-1">
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => loadTests(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${page === pagination.currentPage ? 'bg-[#0A3D62] text-white' : 'bg-white text-gray-400 border border-gray-200'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}