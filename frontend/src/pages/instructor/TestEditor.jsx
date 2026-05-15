import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Save, Plus, Trash2, ChevronDown, ChevronUp,
    Settings, FileText, Eye, CheckCircle, AlertCircle
} from 'lucide-react';
import { testService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TestEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('questions');
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        loadTestData();
    }, [id]);

    const loadTestData = async () => {
        try {
            const { data } = await testService.getInstructorTests();
            const tests = data.tests || data.courses || [];
            const found = tests.find((t) => t._id === id);

            if (found) {
                // Fetch sections to load the questions (lessons) natively
                try {
                    const { data: sectionData } = await testService.getSections(id);
                    const sections = sectionData.sections || [];
                    const questionBank = sections[0]; // Get the default Question Bank section
                    found.questions = questionBank ? questionBank.lessons : [];
                } catch (e) {
                    found.questions = [];
                }

                setTest(found);
                reset({
                    title: found.title,
                    subject: found.subject || found.category,
                    examType: found.examType,
                    duration: found.duration,
                });
            }
        } catch (err) {
            toast.error("Could not load test data");
        } finally {
            setLoading(false);
        }
    };

    const onSaveSettings = async (data) => {
        setSaving(true);
        try {
            const { data: res } = await testService.updateTest(id, data);
            setTest((prev) => ({ ...prev, ...res.test, ...res.course }));
            toast.success('Test settings updated!');
        } catch (err) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const addBlankQuestion = async () => {
        try {
            // 1. Get the Question Bank Section ID
            const { data: sectionData } = await testService.getSections(id);
            const sections = sectionData.sections || [];
            const questionBank = sections[0];

            if (!questionBank) {
                toast.error('Question Bank section missing. Please contact support.');
                return;
            }

            // 2. Format payload for your lesson Schema
            const blankQuestionPayload = {
                title: `Question ${(test.questions?.length || 0) + 1}`,
                type: 'question',
                content: 'New Question Content',
                options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
                correctOption: 'A',
            };

            // 3. Add the question as a lesson inside the section
            const { data } = await testService.addLesson(id, questionBank._id, blankQuestionPayload);

            const newQ = data.lesson;
            setTest((prev) => ({ ...prev, questions: [...(prev.questions || []), newQ] }));
            setExpandedQuestions((prev) => ({ ...prev, [newQ._id]: true }));
            toast.success('New question added');
        } catch (err) {
            console.error("Add Question Error:", err.response?.data);
            toast.error(err.response?.data?.message || 'Failed to add question');
        }
    };

    const saveQuestionData = async (questionId, qIndex) => {
        const questionToSave = test.questions[qIndex];
        try {
            const { data: sectionData } = await testService.getSections(id);
            const questionBank = sectionData.sections[0];

            const updatePayload = {
                title: `Question ${qIndex + 1}`,
                content: questionToSave.content,
                options: questionToSave.options,
                correctOption: questionToSave.correctOption
            };

            await testService.updateLesson(id, questionBank._id, questionId, updatePayload);
            toast.success(`Question ${qIndex + 1} saved`);
        } catch {
            toast.error('Failed to save question');
        }
    };

    const deleteQuestion = async (questionId) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            const { data: sectionData } = await testService.getSections(id);
            const questionBank = sectionData.sections[0];

            await testService.deleteLesson(id, questionBank._id, questionId);
            setTest((prev) => ({ ...prev, questions: prev.questions.filter((q) => q._id !== questionId) }));
            toast.success('Question removed');
        } catch {
            toast.error('Failed to delete question');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="space-y-6 max-w-5xl pb-20 mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-[#0A3D62]" />
                        <h1 className="text-2xl font-bold text-[#0A3D62] dark:text-white">CBT Exam Editor</h1>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{test?.title} • {test?.subject || test?.category}</p>
                </div>
                {test && (
                    <button
                        onClick={async () => {
                            try {
                                await testService.togglePublish(id);
                                setTest((prev) => ({ ...prev, isPublished: !prev.isPublished }));
                                toast.success(test.isPublished ? 'Status: Draft' : 'Status: Live');
                            } catch (err) {
                                toast.error('Status update failed');
                            }
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${test?.isPublished
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/20'
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        {test?.isPublished ? 'Revert to Draft' : 'Publish to Students'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'questions' ? 'border-[#0A3D62] text-[#0A3D62]' : 'border-transparent text-gray-400'
                        }`}
                >
                    <FileText className="w-4 h-4" /> Question Bank
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'settings' ? 'border-[#0A3D62] text-[#0A3D62]' : 'border-transparent text-gray-400'
                        }`}
                >
                    <Settings className="w-4 h-4" /> Exam Settings
                </button>
            </div>

            {/* Questions Tab */}
            {activeTab === 'questions' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-center gap-2 text-[#0A3D62] dark:text-blue-300">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-bold">Total: {test?.questions?.length || 0} Questions</span>
                        </div>
                        <button onClick={addBlankQuestion} className="flex items-center gap-2 px-5 py-2.5 bg-[#0A3D62] hover:bg-[#072a44] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all">
                            <Plus className="w-4 h-4" /> Add Question
                        </button>
                    </div>

                    <div className="space-y-4 mt-6">
                        {(test?.questions || []).length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200">
                                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No questions yet. Click "Add Question" to start building.</p>
                            </div>
                        ) : (
                            test.questions.map((q, index) => (
                                <div key={q._id} className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden transition-all hover:border-blue-200">
                                    {/* Question Header */}
                                    <div
                                        className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer"
                                        onClick={() => setExpandedQuestions((p) => ({ ...p, [q._id]: !p[q._id] }))}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#0A3D62] text-white flex items-center justify-center font-bold text-sm shadow-md">
                                            {index + 1}
                                        </div>
                                        <span className="flex-1 font-bold text-gray-700 dark:text-gray-200 line-clamp-1">
                                            {q.content || 'New Question Content...'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {expandedQuestions[q._id] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteQuestion(q._id); }}
                                                className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Question Body (Expanded) */}
                                    {expandedQuestions[q._id] && (
                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Question Text</label>
                                                <textarea
                                                    defaultValue={q.content}
                                                    onChange={(e) => {
                                                        const newQs = [...test.questions];
                                                        newQs[index].content = e.target.value;
                                                        setTest({ ...test, questions: newQs });
                                                    }}
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white"
                                                    placeholder="Type the question here..."
                                                />
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {['A', 'B', 'C', 'D'].map((letter) => (
                                                    <div key={letter} className="relative group">
                                                        <label className="block text-[10px] font-black text-gray-400 mb-1 ml-1 group-focus-within:text-[#0A3D62]">OPTION {letter}</label>
                                                        <input
                                                            defaultValue={q.options?.[letter]}
                                                            onChange={(e) => {
                                                                const newQs = [...test.questions];
                                                                if (!newQs[index].options) newQs[index].options = {};
                                                                newQs[index].options[letter] = e.target.value;
                                                                setTest({ ...test, questions: newQs });
                                                            }}
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-gray-300 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white transition-all"
                                                            placeholder={`Content for ${letter}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Correct Answer:</span>
                                                    <div className="flex gap-2">
                                                        {['A', 'B', 'C', 'D'].map((opt) => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => {
                                                                    const newQs = [...test.questions];
                                                                    newQs[index].correctOption = opt;
                                                                    setTest({ ...test, questions: newQs });
                                                                }}
                                                                className={`w-10 h-10 rounded-lg font-bold transition-all ${q.correctOption === opt
                                                                    ? 'bg-green-600 text-white shadow-md'
                                                                    : 'bg-white dark:bg-gray-700 text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => saveQuestionData(q._id, index)}
                                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0A3D62] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                                >
                                                    <Save className="w-4 h-4" /> Save Question
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="max-w-2xl bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in zoom-in-95">
                    <h2 className="text-xl font-bold text-[#0A3D62] dark:text-white mb-6">Test Configuration</h2>
                    <form onSubmit={handleSubmit(onSaveSettings)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Test Title</label>
                            <input {...register('title', { required: true })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration (Mins)</label>
                                <input type="number" {...register('duration', { required: true })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input {...register('subject')} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0A3D62]/20 outline-none text-gray-900 dark:text-white" />
                            </div>
                        </div>
                        <button type="submit" disabled={saving} className="w-full py-4 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                            {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5" />}
                            Update Configuration
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}