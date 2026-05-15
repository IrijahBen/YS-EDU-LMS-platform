import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { courseService, enrollmentService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TestEngine() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: 'A' }
    const [timeLeft, setTimeLeft] = useState(0);

    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadTest();
    }, [slug]);

    useEffect(() => {
        // Countdown Timer Logic
        if (timeLeft > 0 && !isSubmitted && !loading) {
            const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0 && !isSubmitted && !loading && questions.length > 0) {
            handleSubmitExam(); // Auto-submit when time is up
        }
    }, [timeLeft, isSubmitted, loading, questions]);

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
            // Save to backend using the progress route
            await enrollmentService.updateProgress(test._id, {
                completed: true,
                completionPercentage: finalScore // Reusing this field to store test score
            });
            toast.success(`Exam submitted! You scored ${finalScore}%`);
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner size="lg" /></div>;

    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
                <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
                <p className="text-gray-500 mb-6">The instructor hasn't added questions to this exam yet.</p>
                <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
            </div>
        );
    }

    const currentQ = questions[currentIdx];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col">
            {/* Top Navigation Bar */}
            <div className="bg-[#0A3D62] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="font-bold text-lg hidden sm:block">{test.title}</h1>
                    <p className="text-sm text-blue-200">{test.subject} • {test.examType}</p>
                </div>

                {!isSubmitted && (
                    <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-500 animate-pulse' : 'bg-blue-800'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                )}

                {isSubmitted && (
                    <div className="flex items-center gap-2 font-bold px-4 py-2 bg-green-600 rounded-lg">
                        Score: {score}%
                    </div>
                )}
            </div>

            <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 grid md:grid-cols-4 gap-6">

                {/* Main Question Area */}
                <div className="md:col-span-3 flex flex-col">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Question {currentIdx + 1} of {questions.length}</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed whitespace-pre-wrap">
                            {currentQ.content}
                        </h2>

                        <div className="space-y-3">
                            {['A', 'B', 'C', 'D'].map(key => {
                                const optionText = currentQ.options?.[key];
                                if (!optionText) return null;

                                const isSelected = answers[currentQ._id] === key;
                                const isCorrectOption = currentQ.correctOption === key;

                                // Styling logic based on submission state
                                let baseStyle = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ";

                                if (!isSubmitted) {
                                    baseStyle += isSelected
                                        ? "border-[#0A3D62] bg-blue-50 text-[#0A3D62]"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50";
                                } else {
                                    if (isCorrectOption) {
                                        baseStyle += "border-green-500 bg-green-50 text-green-800";
                                    } else if (isSelected && !isCorrectOption) {
                                        baseStyle += "border-red-500 bg-red-50 text-red-800";
                                    } else {
                                        baseStyle += "border-gray-200 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={key}
                                        disabled={isSubmitted}
                                        onClick={() => handleSelectOption(currentQ._id, key)}
                                        className={baseStyle}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${isSelected && !isSubmitted ? 'bg-[#0A3D62] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            {key}
                                        </div>
                                        <span className="font-medium">{optionText}</span>

                                        {/* Show correct/incorrect icons only after submission */}
                                        {isSubmitted && isCorrectOption && <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />}
                                        {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-red-500 ml-auto" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Next/Prev Controls */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                            disabled={currentIdx === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-50"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentIdx < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                className="flex items-center gap-2 px-6 py-3 bg-[#0A3D62] text-white rounded-xl font-bold shadow-md shadow-blue-900/20"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            !isSubmitted && (
                                <button
                                    onClick={handleSubmitExam}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-md shadow-green-900/20 animate-pulse"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Navigation Grid */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Question Map</h3>
                        <div className="grid grid-cols-4 gap-2 mb-8">
                            {questions.map((q, idx) => {
                                const isAnswered = !!answers[q._id];
                                const isActive = currentIdx === idx;

                                let dotStyle = "w-full aspect-square rounded-lg font-bold text-sm flex items-center justify-center transition-all ";

                                if (!isSubmitted) {
                                    if (isActive) dotStyle += "ring-2 ring-offset-2 ring-[#0A3D62] bg-[#0A3D62] text-white";
                                    else if (isAnswered) dotStyle += "bg-blue-100 text-[#0A3D62] border border-blue-200";
                                    else dotStyle += "bg-gray-100 text-gray-500 hover:bg-gray-200";
                                } else {
                                    const isCorrect = answers[q._id] === q.correctOption;
                                    if (isActive) dotStyle += "ring-2 ring-offset-2 ring-gray-400 ";

                                    if (!isAnswered) dotStyle += "bg-gray-200 text-gray-500";
                                    else if (isCorrect) dotStyle += "bg-green-500 text-white";
                                    else dotStyle += "bg-red-500 text-white";
                                }

                                return (
                                    <button key={q._id} onClick={() => setCurrentIdx(idx)} className={dotStyle}>
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {isSubmitted && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors"
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