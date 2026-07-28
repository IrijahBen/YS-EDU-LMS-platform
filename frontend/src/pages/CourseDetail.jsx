import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Play, Clock, Users, Star, Award, Globe, CheckCircle, Lock,
    ChevronDown, ChevronUp, BookOpen, Download, Shield, FileText, 
    RotateCcw, AlertCircle, Info, CheckSquare
} from 'lucide-react';
import { formatDuration, formatDate } from '../lib/utils';
import { enrollmentService, userService } from '../services/api';
import useCourseStore from '../store/courseStore';
import useAuthStore from '../store/authStore';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CourseDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { fetchCourse, currentCourse, isLoading } = useCourseStore();
    const { user, isAuthenticated } = useAuthStore();
    const [expandedSections, setExpandedSections] = useState({});
    const [enrolling, setEnrolling] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchCourse(slug);
        window.scrollTo(0, 0);
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!currentCourse?.course) {
        return (
            <div className="page-container min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-[#0A3D62] dark:text-white">Subject not found</h2>
                <p className="text-gray-500 mb-8 max-w-md">The course or exam you are looking for doesn't exist or has been removed.</p>
                <Link to="/courses" className="px-8 py-3.5 bg-[#0A3D62] hover:bg-[#072a44] text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 font-bold">
                    Browse Catalog
                </Link>
            </div>
        );
    }

    const { course, isEnrolled, progress } = currentCourse;
    const isTest = course.type === 'test';

    const toggleSection = (id) => setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/courses/${slug}` } });
            return;
        }
        setEnrolling(true);
        try {
            // YS Edu is 100% Free - direct enrollment
            await enrollmentService.enrollFree(course._id);
            toast.success(isTest ? 'Successfully registered for exam!' : 'Successfully enrolled!');

            // Route directly to Test Engine if it is a Mock Exam
            if (isTest) {
                navigate(`/test-engine/${course.slug}`);
            } else {
                navigate(`/learn/${course.slug}`);
            }

        } catch (err) {
            toast.error(err.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const totalLessons = course.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 0;
    const testQuestionCount = course.sections?.[0]?.lessons?.length || 0;

    // Determine which tabs to show (Hide Curriculum for Tests so they don't see questions early)
    const availableTabs = isTest
        ? ['overview', 'instructor', 'reviews']
        : ['overview', 'curriculum', 'instructor', 'reviews'];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
            {/* HERO SECTION */}
            <div className="bg-gradient-to-br from-[#0A3D62] via-[#0e4e7c] to-blue-900 text-white pt-16 pb-32 md:pt-20 md:pb-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="page-container relative z-10">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 pr-0 lg:pr-8">
                            
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold tracking-wide uppercase shadow-sm ${isTest ? 'bg-amber-500 text-amber-950' : 'bg-blue-500 text-white'}`}>
                                    {isTest ? 'Mock Exam' : 'Course'}
                                </span>
                                <span className="text-sm font-semibold text-blue-200 bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                                    {course.category} • {course.level || course.examType}
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight shadow-sm text-white">
                                {course.title}
                            </h1>
                            
                            {course.subtitle && (
                                <p className="text-blue-100 mb-8 text-lg md:text-xl max-w-3xl leading-relaxed font-light">
                                    {course.subtitle}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-6 text-sm mb-8 bg-black/10 inline-flex p-3 px-5 rounded-2xl backdrop-blur-md border border-white/10">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-lg">{course.averageRating?.toFixed(1) || '0.0'}</span>
                                    <span className="text-blue-200">({course.totalReviews || 0} reviews)</span>
                                </div>
                                <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
                                <div className="flex items-center gap-2 text-blue-100 font-medium">
                                    <Users className="w-5 h-5 opacity-80" />
                                    {course.totalStudents?.toLocaleString() || 0} {isTest ? 'candidates' : 'students'}
                                </div>
                                <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
                                <div className="flex items-center gap-2 text-blue-100 font-medium">
                                    <Clock className="w-5 h-5 opacity-80" />
                                    {isTest ? `${course.duration} Minutes` : formatDuration(course.totalDuration)}
                                </div>
                                <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
                                {isTest ? (
                                    <div className="flex items-center gap-2 text-blue-100 font-medium">
                                        <FileText className="w-5 h-5 opacity-80" />
                                        {testQuestionCount} Questions
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-blue-100 font-medium">
                                        <Globe className="w-5 h-5 opacity-80" />
                                        {course.language || 'English'}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {course.instructor?.avatar?.url ? (
                                    <img src={course.instructor.avatar.url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-md" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg font-bold border-2 border-white/30 shadow-md">
                                        {course.instructor?.name?.[0] || 'T'}
                                    </div>
                                )}
                                <div>
                                    <div className="text-sm text-blue-200">{isTest ? 'Exam curated by' : 'Course created by'}</div>
                                    <div className="font-bold text-lg">{course.instructor?.name || 'YS Edu Expert'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT & STICKY SIDEBAR */}
            <div className="page-container relative z-20">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Left Column: Content */}
                    <div className="lg:col-span-8 pb-20">
                        {/* Dynamic Tabs */}
                        <div className="flex gap-2 sm:gap-6 border-b border-gray-200 dark:border-gray-800 mb-10 overflow-x-auto custom-scrollbar bg-white dark:bg-gray-950 sticky top-[60px] lg:top-[80px] z-30 pt-4 pb-0">
                            {availableTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-4 text-base font-bold capitalize transition-all border-b-[3px] whitespace-nowrap ${activeTab === tab
                                        ? 'border-[#0A3D62] text-[#0A3D62] dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* TAB CONTENT: Overview */}
                        {activeTab === 'overview' && (
                            <div className="space-y-12 animate-in fade-in duration-500">
                                
                                {isTest ? (
                                    <>
                                        {/* Premium Instructions Panel */}
                                        <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900 border border-amber-200/60 dark:border-amber-900/50 rounded-2xl p-6 md:p-8 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-200/40 dark:border-amber-900/40">
                                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                                                    <AlertCircle className="w-6 h-6" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-500">Exam Rules & Guidelines</h2>
                                            </div>
                                            
                                            <ul className="space-y-4">
                                                {course.instructions?.length > 0 ? (
                                                    course.instructions.map((inst, i) => (
                                                        <li key={i} className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                                                            <CheckSquare className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                            <span className="leading-relaxed text-base">{inst}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <>
                                                        <li className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                                                            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                            <span className="leading-relaxed text-base">The timer cannot be paused once the exam begins. If you leave or close the page, the timer continues running.</span>
                                                        </li>
                                                        <li className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                                                            <CheckSquare className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                            <span className="leading-relaxed text-base">Ensure you have a stable internet connection before starting to prevent progress loss.</span>
                                                        </li>
                                                        <li className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                                                            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                            <span className="leading-relaxed text-base">The test will automatically submit when the timer reaches zero, grading whatever you have answered.</span>
                                                        </li>
                                                        <li className="flex items-start gap-4 text-gray-800 dark:text-gray-200 bg-amber-100/50 dark:bg-amber-900/20 p-4 rounded-xl mt-6">
                                                            <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                            <span className="font-semibold text-base">Practice makes perfect! You can revisit and retake this mock exam as many times as you like.</span>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="prose dark:prose-invert max-w-none">
                                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About this Mock Exam</h2>
                                            <div className="text-gray-600 dark:text-gray-400 text-base leading-loose whitespace-pre-line bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                {course.description || `Prepare for your ${course.examType || 'upcoming'} exam with this standard CBT practice test. Analyze your performance, review answers immediately after completion, and try again until you achieve a perfect score.`}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Standard Course Overview UI */}
                                        {course.whatYouWillLearn?.length > 0 && (
                                            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 md:p-10">
                                                <h2 className="text-2xl font-bold mb-6 text-[#0A3D62] dark:text-white">What you'll learn</h2>
                                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                                                    {course.whatYouWillLearn.map((item, i) => (
                                                        <div key={i} className="flex items-start gap-3 text-base text-gray-700 dark:text-gray-300">
                                                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                                            <span className="leading-relaxed">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="prose dark:prose-invert max-w-none">
                                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Course Description</h2>
                                            <div className="text-gray-600 dark:text-gray-400 text-base leading-loose whitespace-pre-line">
                                                {course.description || "No description provided for this subject."}
                                            </div>
                                        </div>

                                        {course.requirements?.length > 0 && (
                                            <div>
                                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Requirements</h2>
                                                <ul className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                    {course.requirements.map((req, i) => (
                                                        <li key={i} className="flex items-center gap-4 text-base text-gray-700 dark:text-gray-300">
                                                            <div className="w-2 h-2 rounded-full bg-[#0A3D62] dark:bg-blue-400 flex-shrink-0" />
                                                            {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: Curriculum */}
                        {activeTab === 'curriculum' && !isTest && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-[#0A3D62] dark:text-blue-400" />
                                        Syllabus ({course.sections?.length || 0} modules)
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {totalLessons} lessons • {formatDuration(course.totalDuration)} total
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {course.sections?.map((section) => (
                                        <div key={section._id} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <button
                                                onClick={() => toggleSection(section._id)}
                                                className="w-full flex items-center justify-between p-5 bg-gray-50/80 dark:bg-gray-900/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {expandedSections[section._id] ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-base text-gray-900 dark:text-white block mb-0.5">{section.title}</span>
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            {section.lessons.length} lessons
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>

                                            {expandedSections[section._id] && (
                                                <div className="border-t border-gray-100 dark:border-gray-800">
                                                    {section.lessons.map((lesson) => (
                                                        <div key={lesson._id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                                                            {lesson.isPreview ? (
                                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A3D62] group-hover:text-white transition-colors">
                                                                    <Play className="w-4 h-4 text-[#0A3D62] dark:text-blue-400 group-hover:text-white" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{lesson.title}</span>

                                                            {lesson.duration > 0 && (
                                                                <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md tracking-wide">
                                                                    {formatDuration(lesson.duration)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {(!course.sections || course.sections.length === 0) && (
                                        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
                                            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4 opacity-50" />
                                            <p className="font-medium text-lg">No curriculum content uploaded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Instructor */}
                        {activeTab === 'instructor' && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 animate-in fade-in duration-500">
                                <div className="flex flex-col sm:flex-row gap-8 items-start">
                                    {course.instructor?.avatar?.url ? (
                                        <img src={course.instructor.avatar.url} alt="" className="w-32 h-32 rounded-2xl object-cover flex-shrink-0 shadow-lg" />
                                    ) : (
                                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center text-4xl font-extrabold text-[#0A3D62] dark:text-blue-400 flex-shrink-0 shadow-inner border border-blue-200/50">
                                            {course.instructor?.name?.[0] || 'T'}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{course.instructor?.name || 'YS Edu Expert'}</h3>
                                        <p className="text-[#0A3D62] dark:text-blue-400 text-base font-bold mb-5">{course.instructor?.headline || 'Educational Consultant'}</p>

                                        <div className="flex flex-wrap gap-5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 inline-flex">
                                            <span className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> Top Instructor</span>
                                            <span className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> {course.instructor?.totalStudents || 0} Students</span>
                                            <span className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-500" /> {course.instructor?.courses?.length || 0} Courses</span>
                                        </div>

                                        <p className="text-base text-gray-600 dark:text-gray-400 leading-loose">
                                            {course.instructor?.bio || 'Dedicated to providing high-quality educational resources for UTME and secondary school students.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Reviews */}
                        {activeTab === 'reviews' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 p-10 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                                    <div className="text-center sm:border-r border-blue-200 dark:border-blue-800 sm:pr-10 w-full sm:w-auto">
                                        <div className="text-7xl font-black text-amber-500 mb-3 tracking-tighter">{course.averageRating?.toFixed(1) || '0.0'}</div>
                                        <StarRating rating={course.averageRating || 0} size="lg" className="justify-center" />
                                        <div className="text-sm font-bold text-[#0A3D62] dark:text-blue-300 mt-3 uppercase tracking-wider">Overall Rating</div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Student Feedback</h3>
                                        <p className="text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                            Based on <strong>{course.totalReviews || 0}</strong> verified ratings. Only enrolled {isTest ? 'candidates' : 'students'} are permitted to leave reviews to ensure all feedback remains authentic and constructive.
                                        </p>
                                        <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <Info className="w-4 h-4 text-blue-500" /> Authentic Reviews Only
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Enrollment Card (Desktop) */}
                    <div className="hidden lg:block lg:col-span-4 relative">
                        {/* The -mt-[340px] pulls the card up into the hero section space perfectly */}
                        <div className="sticky top-28 -mt-[320px] z-30 pb-20">
                            <EnrollCard
                                course={course}
                                isEnrolled={isEnrolled}
                                progress={progress}
                                enrolling={enrolling}
                                onEnroll={handleEnroll}
                                navigate={navigate}
                                isTest={isTest}
                                testQuestionCount={testQuestionCount}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Enrollment Sticky Footer (Visible only on small screens) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Price</div>
                        <div className="text-2xl font-black text-[#0A3D62] dark:text-blue-400">Free</div>
                    </div>
                    {isEnrolled ? (
                        <button
                            onClick={() => navigate(isTest ? `/test-engine/${course.slug}` : `/learn/${course.slug}`)}
                            className="px-8 py-3.5 bg-[#0A3D62] hover:bg-[#072a44] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                        >
                            {isTest ? 'Start Exam' : 'Continue'}
                        </button>
                    ) : (
                        <button 
                            onClick={handleEnroll} 
                            disabled={enrolling} 
                            className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {enrolling ? <LoadingSpinner size="sm" /> : null}
                            {isTest ? 'Register Free' : 'Enroll Free'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Extracted Enrollment Card Component
function EnrollCard({ course, isEnrolled, progress, enrolling, onEnroll, navigate, isTest, testQuestionCount }) {

    // Custom Feature lists based on type
    const testFeatures = [
        { icon: Clock, text: `Time Limit: ${course.duration} Minutes` },
        { icon: FileText, text: `${testQuestionCount} Practice Questions` },
        { icon: RotateCcw, text: 'Unlimited Retakes for Practice' },
        { icon: Award, text: 'Instant Automated Grading' },
    ];

    const courseFeatures = [
        { icon: Clock, text: `${formatDuration(course.totalDuration)} of video content` },
        { icon: BookOpen, text: `${course.totalLessons} comprehensive lessons` },
        { icon: Globe, text: 'Full lifetime access' },
        { icon: Download, text: 'Downloadable study materials' },
        ...(course.hasCertificate ? [{ icon: Award, text: 'Certificate of completion' }] : []),
    ];

    const featuresToDisplay = isTest ? testFeatures : courseFeatures;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden text-gray-900 dark:text-white">
            {/* Thumbnail */}
            {course.thumbnail?.url ? (
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img src={course.thumbnail.url} alt="Preview" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                            {isTest ? <FileText className="w-7 h-7 text-[#0A3D62]" /> : <Play className="w-7 h-7 text-[#0A3D62] ml-1" />}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-gray-800 flex flex-col items-center justify-center text-[#0A3D62] dark:text-blue-400 border-b border-gray-100 dark:border-gray-800">
                    {isTest ? <FileText className="w-16 h-16 mb-3 opacity-40" /> : <BookOpen className="w-16 h-16 mb-3 opacity-40" />}
                    <span className="font-bold tracking-wide opacity-60 uppercase text-sm">{isTest ? 'Mock Exam Preview' : 'Course Preview'}</span>
                </div>
            )}

            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-4xl font-black text-[#0A3D62] dark:text-blue-400 tracking-tight">Free</div>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800/50">
                        100% Off
                    </div>
                </div>

                {isEnrolled ? (
                    <div className="space-y-5">
                        {progress && !isTest && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between text-sm font-bold text-[#0A3D62] dark:text-blue-300 mb-3">
                                    <span>Your Progress</span>
                                    <span>{progress.completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progress.completionPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {progress && isTest && progress.completionPercentage > 0 && (
                            <div className="bg-amber-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-amber-200/50 dark:border-gray-700 text-center">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Latest Score
                                </div>
                                <div className="text-3xl font-black text-[#0A3D62] dark:text-blue-400">
                                    {progress.completionPercentage}%
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate(isTest ? `/test-engine/${course.slug}` : `/learn/${course.slug}`)}
                            className="w-full py-4 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(10,61,98,0.2)] hover:shadow-[0_10px_25px_rgba(10,61,98,0.3)] transition-all text-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {progress?.completionPercentage > 0
                                ? (isTest ? 'Review Results / Retake' : 'Continue Learning')
                                : (isTest ? 'Start Exam Now' : 'Start Learning')}
                        </button>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={onEnroll}
                            disabled={enrolling}
                            className="w-full py-4.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(22,163,74,0.2)] hover:shadow-[0_10px_25px_rgba(22,163,74,0.3)] flex items-center justify-center gap-3 mb-4 transition-all text-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {enrolling ? <LoadingSpinner size="sm" /> : null}
                            {isTest ? 'Register for Free' : 'Enroll for Free'}
                        </button>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-2 mb-8">
                            <Shield className="w-4 h-4 text-green-500" /> Full Access • No hidden fees
                        </p>
                    </div>
                )}

                {/* Dynamic Feature List */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-extrabold text-gray-900 dark:text-white mb-4 text-base">
                        {isTest ? 'Exam Features:' : 'This course includes:'}
                    </h4>
                    {featuresToDisplay.map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-[#0A3D62] dark:text-blue-400" />
                            </div>
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
