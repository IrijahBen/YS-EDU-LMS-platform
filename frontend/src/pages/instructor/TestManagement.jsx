import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, FileQuestion, Clock, LayoutGrid, List } from 'lucide-react';
import { testService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TestManagement() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(null);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            const { data } = await testService.getInstructorTests();
            // Handle varying backend response formats
            setTests(data.tests || data.courses || []);
        } catch (err) {
            toast.error("Failed to load your tests");
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (test) => {
        setToggling(test._id);
        try {
            await testService.togglePublish(test._id);
            setTests((prev) => prev.map((t) => t._id === test._id ? { ...t, isPublished: !t.isPublished } : t));
            toast.success(test.isPublished ? 'Test drafted' : 'Test published!');
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setToggling(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this test and all its questions? This cannot be undone.')) return;
        try {
            await testService.deleteTest(id);
            setTests((prev) => prev.filter((t) => t._id !== id));
            toast.success('Test deleted successfully');
        } catch {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="space-y-8 px-4 max-w-6xl mx-auto py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#0A3D62] dark:text-white">Exam Management</h1>
                    <p className="text-gray-500 font-medium">Create and manage your CBT mock exams.</p>
                </div>
                <Link to="/instructor/tests/new" className="w-full sm:w-auto px-6 py-3 bg-[#0A3D62] hover:bg-[#072a44] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95">
                    <Plus className="w-5 h-5" /> Create New Test
                </Link>
            </div>

            {tests.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileQuestion className="w-10 h-10 text-[#0A3D62] dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Practice Tests Yet</h3>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Start by creating your first CBT mock exam for UTME or SSCE students.</p>
                    <Link to="/instructor/tests/new" className="px-8 py-3 bg-[#0A3D62] text-white font-bold rounded-xl inline-block shadow-lg">Get Started</Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <div key={test._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all group flex flex-col">

                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <FileQuestion className="w-6 h-6 text-[#0A3D62] dark:text-blue-400" />
                                    </div>
                                    <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full flex-shrink-0 ${test.isPublished
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {test.isPublished ? 'Live' : 'Draft'}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-[#0A3D62] transition-colors">
                                    {test.title}
                                </h3>

                                <div className="text-xs font-bold text-[#0A3D62] dark:text-blue-400 mb-6 uppercase tracking-wider">
                                    {test.subject || test.category} • {test.examType || 'Practice'}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        {test.duration} mins
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <List className="w-4 h-4 text-blue-500" />
                                        {test.questions?.length || 0} Questions
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex gap-2">
                                <Link to={`/instructor/tests/${test._id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#0A3D62] hover:text-[#0A3D62] dark:hover:text-blue-400 text-xs font-black transition-all shadow-sm active:scale-95"
                                >
                                    <Edit className="w-4 h-4" /> MANAGE CBT
                                </Link>
                                <button
                                    onClick={() => handleTogglePublish(test)}
                                    disabled={toggling === test._id}
                                    className={`w-12 flex items-center justify-center rounded-xl transition-all border ${test.isPublished
                                            ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                                            : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                        }`}
                                >
                                    {toggling === test._id ? <LoadingSpinner size="sm" /> : test.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button onClick={() => handleDelete(test._id)}
                                    className="w-12 flex items-center justify-center border border-red-100 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}