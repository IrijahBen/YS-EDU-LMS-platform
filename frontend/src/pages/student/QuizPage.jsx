import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { quizService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  // Quiz Data & States
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Gatekeeper & Progress States
  const [hasStarted, setHasStarted] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Interaction & Submission States
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // Fetch Quiz Data
  useEffect(() => {
    quizService.getQuiz(quizId)
      .then(({ data }) => {
        setQuiz(data.quiz);
        if (data.quiz.timeLimit > 0) setTimeLeft(data.quiz.timeLimit * 60);
      })
      .catch(() => { 
        toast.error('Quiz not found'); 
        navigate(-1); 
      })
      .finally(() => setLoading(false));
  }, [quizId, navigate]);

  // Timer Logic (Only runs AFTER modal is accepted)
  useEffect(() => {
    if (!hasStarted || timeLeft === null || submitted) return;
    if (timeLeft <= 0) { 
      handleSubmit(); 
      return; 
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, submitted, hasStarted]);

  const handleStartExam = () => {
    setStartedAt(new Date());
    setHasStarted(true);
  };

  const handleAnswer = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    clearTimeout(timerRef.current);
    setSubmitted(true);

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId,
    }));

    try {
      const { data } = await quizService.submitQuiz(quizId, {
        answers: formattedAnswers,
        startedAt,
        timeTaken: quiz.timeLimit > 0 ? (quiz.timeLimit * 60) - (timeLeft || 0) : undefined,
      });
      setResult(data.result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error('Failed to submit quiz');
      setSubmitted(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b1120]"><LoadingSpinner size="lg" /></div>;
  if (!quiz) return null;

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;
  
  // Single question for active test, all questions for review
  const questionsToRender = submitted ? quiz.questions : [quiz.questions[currentQuestionIndex]];

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 py-8 relative">
      
      {/* 🛑 INSTRUCTIONS MODAL (GATEKEEPER) */}
      <AnimatePresence>
        {!hasStarted && !submitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <AlertCircle className="w-8 h-8" />
                <h2 className="text-2xl font-bold text-white">Exam Instructions</h2>
              </div>
              
              <div className="text-slate-300 space-y-4 mb-8">
                <p>Welcome to <strong>{quiz.title}</strong>. Please read the following rules carefully before beginning:</p>
                <ul className="space-y-3 bg-[#0f172a] p-5 rounded-xl border border-slate-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>You have exactly <strong>{quiz.timeLimit} minutes</strong> to complete {totalQuestions} questions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Do not refresh your browser, or your progress will be lost.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>You can navigate back to previous questions to review your answers before submitting.</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={handleStartExam}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/50"
              >
                I Understand, Start Exam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ MAIN QUIZ UI */}
      <div className={`max-w-3xl mx-auto px-4 transition-all duration-500 ${!hasStarted ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>
        
        {/* Header & Progress Bar */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-bold text-xl text-white">{quiz.title}</h1>
              {!submitted && (
                <p className="text-sm text-slate-400 mt-1">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              )}
            </div>
            {timeLeft !== null && !submitted && (
              <div className={`flex items-center gap-2 font-mono font-bold text-xl px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-950/50 text-red-400 border border-red-900/50' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {!submitted && (
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Results Banner (Shows after submission) */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-8 mb-8 text-center shadow-2xl ${result.passed ? 'bg-green-950/30 border border-green-800' : 'bg-red-950/30 border border-red-800'}`}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${result.passed ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              {result.passed ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">{result.passed ? 'Exam Passed!' : 'Keep Trying!'}</h2>
            <p className="text-slate-300 mb-4 text-lg">
              You scored <strong className="text-white text-xl">{result.percentage}%</strong> ({result.score}/{result.totalPoints} points)
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-600">
                Back to Course
              </button>
              {!result.passed && (
                <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg">
                  Retake Exam
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Questions Container */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {questionsToRender.map((q, idx) => {
              const displayIndex = submitted ? idx : currentQuestionIndex;
              const userAnswer = answers[q._id];
              const resultAnswer = result?.answers?.find((a) => a.question?.toString() === q._id?.toString());

              return (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <span className="w-8 h-8 bg-blue-900/50 text-blue-400 border border-blue-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {displayIndex + 1}
                    </span>
                    <h3 className="font-semibold text-lg text-white leading-relaxed">{q.question}</h3>
                  </div>

                  <div className="space-y-3 sm:ml-12">
                    {q.options.map((option) => {
                      const isSelected = userAnswer === option._id;
                      const isCorrect = result && resultAnswer?.isCorrect && isSelected;
                      const isWrong = result && !resultAnswer?.isCorrect && isSelected;
                      const isCorrectAnswer = result && result.answers && resultAnswer && !resultAnswer.isCorrect && option._id === resultAnswer.correctOption?._id;

                      return (
                        <button
                          key={option._id}
                          onClick={() => handleAnswer(q._id, option._id)}
                          disabled={submitted}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm md:text-base font-medium transition-all flex items-center justify-between group ${
                            isCorrect ? 'border-green-500 bg-green-950/20 text-green-400'
                            : isWrong ? 'border-red-500 bg-red-950/20 text-red-400'
                            : isCorrectAnswer ? 'border-green-500 bg-green-950/20 text-green-400'
                            : isSelected ? 'border-blue-500 bg-blue-950/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700 text-slate-300 disabled:opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
                              {isSelected && !submitted && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            {option.text}
                          </div>
                          
                          {/* Post-submission icons */}
                          {isCorrect && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                          {isWrong && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {result && resultAnswer?.explanation && (
                    <div className="mt-6 sm:ml-12 p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl text-sm text-blue-200 flex gap-3 items-start">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p>{resultAnswer.explanation}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination & Navigation Buttons (Only visible while taking the test) */}
        {!submitted && hasStarted && (
          <div className="mt-8 flex items-center justify-between pb-10">
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 
                         disabled:bg-slate-900 disabled:border-slate-800 disabled:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Exam <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
