import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { testService } from '../../services/api';
import { BookOpen, Clock, ClipboardList, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = [
    'English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Agricultural Science', 'Further Mathematics', 'Computer Studies',
    'Economics', 'Government', 'Geography', 'Financial Accounting',
    'Commerce', 'Literature in English', 'CRK', 'IRK', 'History'
];

const EXAM_TYPES = ['UTME (JAMB)', 'WAEC', 'NECO', 'Post-UTME', 'General Practice'];

export default function CreateTest() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            examType: 'UTME (JAMB)',
            duration: 60,
            subject: 'Mathematics'
        },
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                // Ensure all backend requirements are met
                price: 0,
                isFree: true,
                type: 'test',
                description: `CBT Practice Test for ${data.subject}.`,
                category: data.subject, // Map subject to category field
                duration: parseInt(data.duration),
                instructions: data.instructions?.split('\n').filter(Boolean) || [],
            };

            const { data: res } = await testService.createTest(payload);

            const testId = res.test?._id || res.course?._id || res._id;

            toast.success('Test header created successfully!');
            navigate(`/instructor/tests/${testId}/edit`);
        } catch (err) {
            console.error("Submission Error Detail:", err.response?.data);
            // Help for the developer: show the specific message from the object
            toast.error(err.response?.data?.message || 'Failed to initialize test');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
                <div className="bg-[#0A3D62] p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="w-8 h-8 text-blue-300" />
                        <h1 className="text-2xl font-bold font-heading">New CBT Exam</h1>
                    </div>
                    <p className="text-blue-100 opacity-90">Set the standard for your UTME or SSCE mock practice.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[#0A3D62] dark:text-blue-400 font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                            <ClipboardList className="w-5 h-5" />
                            <h2>Exam Information</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Test Title *</label>
                            <input
                                {...register('title', { required: 'Test title is essential' })}
                                placeholder="e.g. 2026 JAMB Mathematics Final Mock"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 focus:border-[#0A3D62] outline-none transition-all text-gray-900 dark:text-white"
                            />
                            {errors.title && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject Area *</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        {...register('subject', { required: 'Please select a subject' })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white appearance-none"
                                    >
                                        <option value="">Select subject</option>
                                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                {errors.subject && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.subject.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Exam Category</label>
                                <select
                                    {...register('examType')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white appearance-none"
                                >
                                    {EXAM_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[#0A3D62] dark:text-blue-400 font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                            <Clock className="w-5 h-5" />
                            <h2>Timing & Rules</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration (Mins) *</label>
                                <input
                                    type="number"
                                    min="5"
                                    {...register('duration', { required: true })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 italic mb-1">
                                    * Note: Students will be automatically logged out when the timer hits zero.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Student Instructions</label>
                            <textarea
                                {...register('instructions')}
                                rows={4}
                                placeholder="1. Calculators are not permitted.&#10;2. Read every question carefully.&#10;3. Do not refresh the browser during the exam."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white resize-none"
                            />
                            <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Use a new line for each separate instruction point.</p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                        >
                            {isSubmitting ? "Processing..." : "Initialize Exam & Add Questions"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}