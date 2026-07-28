import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { courseService, enrollmentService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TestEngine() {
    const { slug } = useParams();
    const navigate = useNavigate();

    // Data States
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Gatekeeper & Progress States
    const [hasStarted, setHasStarted] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    
    // Timer & Submission States
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadTest();
    }, [slug]);

    useEffect(() => {
        // Countdown Timer Logic (Only runs AFTER modal is accepted)
        if (timeLeft > 0 && !isSubmitted && !loading && hasStarted) {
            const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0 && !isSubmitted && !loading && questions.length > 0 && hasStarted) {
            handleSubmitExam(); // Auto-submit when time is up
        }
    }, [timeLeft, isSubmitted, loading, questions, hasStarted]);

    const loadTest = async () => {
        try {
            const { data } = await courseService.getCourse(slug);
            const testData = data.course;

            // Extract questions from the Question Bank section
            const questionBank = testData.sections?.[0];
            const testQuestions = questionBank ? questionBank.lessons : [];

            setTest(testData);
            setQuestions(testQuestions);
            setTimeLeft(testData.duration * 60); // Convert minutes to seconds

            // Check if they already completed it
            if (data.progress?.completed) {
                setIsSubmitted(true);
                setScore(data.progress.completionPercentage || 0);
                setHasStarted(true); // Bypass modal if already submitted
            }
        } catch (err) {
            toast.error("Failed to load exam data");
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (questionId, optionKey) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    };

    const handleSubmitExam = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Calculate score
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q._id] === q.correctOption) {
                correctCount++;
            }
        });

        const finalScore = Math.round((correctCount / questions.length) * 100) || 0;
        setScore(finalScore);
        setIsSubmitted(true);

        try {
            await enrollmentService.updateProgress(test._id, {
                completed: true,
                completionPercentage: finalScore
            });
            toast.success(`Exam submitted! You scored ${finalScore}%`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            toast.error("Failed to save score, but results are shown.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><LoadingSpinner size="lg" /></div>;

    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
                <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
                <p className="text-gray-500 mb-6">The instructor hasn't added questions to this exam yet.</p>
                <button onClick={() => navigate(-1)} className="px-6 py-3 bg-[#0A3D62] text-white rounded-lg font-bold">Go Back</button>
            </div>
        );
    }

    const currentQ = questions[currentIdx];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col relative overflow-hidden">
            
            {/* 🛑 INSTRUCTIONS MODAL (GATEKEEPER) */}
            <AnimatePresence>
                {!hasStarted && !isSubmitted && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 text-[#0A3D62] rounded-full flex items-center justify-center">
                                    <Info className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Instructions</h2>
                                    <p className="text-sm text-gray-500">{test.title}</p>
                                </div>
                            </div>
                            
                            <div className="text-gray-600 dark:text-gray-300 space-y-4 mb-8">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800/50 space-y-3">
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#0A3D62] font-bold mt-1">•</span>
                                        <span>You have <strong>{test.duration} minutes</strong> to complete all {questions.length} questions.</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#0A3D62] font-bold mt-1">•</span>
                                        <span>The timer will start immediately after you click the button below.</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#0A3D62] font-bold mt-1">•</span>
                                        <span>Do not refresh or close your browser window, or your progress will be lost.</span>
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setHasStarted(true)}
                                className="w-full py-4 bg-[#0A3D62] hover:bg-blue-900 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/20"
                            >
                                Understood, Start Exam
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Navigation Bar */}
            <div className={`bg-[#0A3D62] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10 transition-all ${!hasStarted ? 'opacity-90' : ''}`}>
                <div>
                    <h1 className="font-bold text-lg hidden sm:block">{test.title}</h1>
                    <p className="text-sm text-blue-200">{test.subject} • {test.examType}</p>
                </div>

                {!isSubmitted && (
                    <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg transition-colors ${timeLeft < 300 && hasStarted ? 'bg-red-500 animate-pulse' : 'bg-blue-800'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                )}

                {isSubmitted && (
                    <div className="flex items-center gap-2 font-bold px-4 py-2 bg-green-500 text-white rounded-lg shadow-inner">
                        Final Score: {score}%
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid lg:grid-cols-4 gap-6 transition-all duration-500 ${!hasStarted ? 'opacity-30 blur-sm pointer-events-none select-none' : 'opacity-100'}`}>
                
                {/* Left Area: Question Display */}
                <div className="lg:col-span-3 flex flex-col">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex-1 min-h-[400px]">
                        
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <span className="text-sm font-bold text-[#0A3D62] dark:text-blue-400 uppercase tracking-wider">
                                Question {currentIdx + 1} of {questions.length}
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIdx}
                                initial={{ opacity: 0, x: 15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -15 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed whitespace-pre-wrap">
                                    {currentQ.content}
                                </h2>

                                <div className="space-y-3">
                                    {['A', 'B', 'C', 'D'].map(key => {
                                        const optionText = currentQ.options?.[key];
                                        if (!optionText) return null;

                                        const isSelected = answers[currentQ._id] === key;
                                        const isCorrectOption = currentQ.correctOption === key;

                                        let baseStyle = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ";

                                        if (!isSubmitted) {
                                            baseStyle += isSelected
                                                ? "border-[#0A3D62] bg-blue-50 text-[#0A3D62] shadow-sm"
                                                : "border-gray-200 hover:border-[#0A3D62]/40 hover:bg-gray-50 text-gray-700 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800";
                                        } else {
                                            if (isCorrectOption) {
                                                baseStyle += "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400";
                                            } else if (isSelected && !isCorrectOption) {
                                                baseStyle += "border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400";
                                            } else {
                                                baseStyle += "border-gray-200 opacity-50 dark:border-gray-800";
                                            }
                                        }

                                        return (
                                            <button
                                                key={key}
                                                disabled={isSubmitted}
                                                onClick={() => handleSelectOption(currentQ._id, key)}
                                                className={baseStyle}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isSelected && !isSubmitted ? 'bg-[#0A3D62] text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 group-hover:bg-gray-200'}`}>
                                                    {key}
                                                </div>
                                                <span className="font-medium text-base">{optionText}</span>

                                                {isSubmitted && isCorrectOption && <CheckCircle className="w-6 h-6 text-green-500 ml-auto shrink-0" />}
                                                {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-red-500 ml-auto shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Next/Prev Controls */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                            disabled={currentIdx === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all hover:bg-gray-50 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:border-gray-200 disabled:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-5 h-5" /> Previous
                        </button>

                        {currentIdx < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                className="flex items-center gap-2 px-6 py-3 bg-[#0A3D62] hover:bg-blue-900 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-900/20"
                            >
                                Next <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            !isSubmitted && (
                                <button
                                    onClick={handleSubmitExam}
                                    disabled={isSubmitting || Object.keys(answers).length === 0}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-md shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Question Map */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                            Question Map
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-500">
                                {Object.keys(answers).length}/{questions.length} Answered
                            </span>
                        </h3>
                        
                        <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 mb-8">
                            {questions.map((q, idx) => {
                                const isAnswered = !!answers[q._id];
                                const isActive = currentIdx === idx;

                                let dotStyle = "w-full aspect-square rounded-lg font-bold text-sm flex items-center justify-center transition-all cursor-pointer ";

                                if (!isSubmitted) {
                                    if (isActive) dotStyle += "ring-2 ring-offset-2 ring-[#0A3D62] bg-[#0A3D62] text-white";
                                    else if (isAnswered) dotStyle += "bg-blue-100 text-[#0A3D62] border border-blue-200 hover:bg-blue-200";
                                    else dotStyle += "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700";
                                } else {
                                    const isCorrect = answers[q._id] === q.correctOption;
                                    if (isActive) dotStyle += "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600 ";

                                    if (!isAnswered) dotStyle += "bg-gray-200 text-gray-400 dark:bg-gray-800";
                                    else if (isCorrect) dotStyle += "bg-green-500 text-white";
                                    else dotStyle += "bg-red-500 text-white";
                                }

                                return (
                                    <button 
                                        key={q._id} 
                                        onClick={() => setCurrentIdx(idx)} 
                                        className={dotStyle}
                                        title={`Go to Question ${idx + 1}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {isSubmitted && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                Back to Dashboard
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
