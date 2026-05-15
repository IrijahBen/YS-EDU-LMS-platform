import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Play, Clock, Users, Star, Award, Globe, CheckCircle, Lock,
    ChevronDown, ChevronUp, BookOpen, Download, Shield, FileText, RotateCcw
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
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!currentCourse?.course) {
        return (
            <div className="page-container py-20 text-center">
                <h2 className="text-2xl font-bold mb-4 text-[#0A3D62] dark:text-white">Subject not found</h2>
                <Link to="/courses" className="px-6 py-3 bg-[#0A3D62] hover:bg-[#072a44] text-white rounded-lg transition-colors">
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

            // ✅ THE FIX: Route directly to Test Engine if it is a Mock Exam
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
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <div className="bg-gradient-to-r from-[#0A3D62] to-blue-900 text-white py-12">
                <div className="page-container">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="text-sm text-blue-200 mb-3 font-semibold tracking-wide uppercase flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md ${isTest ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'}`}>
                                    {isTest ? 'Mock Exam' : 'Course'}
                                </span>
                                {course.category} • {course.level || course.examType}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{course.title}</h1>
                            {course.subtitle && <p className="text-blue-100 mb-6 text-lg max-w-2xl">{course.subtitle}</p>}

                            <div className="flex flex-wrap items-center gap-5 text-sm mb-6">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-bold">{course.averageRating?.toFixed(1) || '0.0'}</span>
                                    <span className="text-blue-200">({course.totalReviews || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-blue-100">
                                    <Users className="w-4 h-4" />
                                    {course.totalStudents?.toLocaleString() || 0} {isTest ? 'candidates' : 'students'}
                                </div>

                                {/* Dynamic Time Display based on type */}
                                <div className="flex items-center gap-1.5 text-blue-100">
                                    <Clock className="w-4 h-4" />
                                    {isTest ? `${course.duration} Minutes` : formatDuration(course.totalDuration)}
                                </div>

                                {/* Show question count instead of language for tests */}
                                {isTest ? (
                                    <div className="flex items-center gap-1.5 text-blue-100">
                                        <FileText className="w-4 h-4" />
                                        {testQuestionCount} Questions
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-blue-100">
                                        <Globe className="w-4 h-4" />
                                        {course.language || 'English'}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {course.instructor?.avatar?.url ? (
                                    <img src={course.instructor.avatar.url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-blue-400" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-sm font-bold border-2 border-blue-400">
                                        {course.instructor?.name?.[0] || 'T'}
                                    </div>
                                )}
                                <span className="text-sm">
                                    {isTest ? 'Exam set by' : 'Created by'} <span className="text-white font-semibold">{course.instructor?.name || 'YS Edu Expert'}</span>
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-6 text-xs font-medium">
                                <span className="bg-white/10 px-3 py-1.5 rounded-full">Last updated {formatDate(course.updatedAt)}</span>
                                {!isTest && course.hasCertificate && (
                                    <span className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5" /> Certificate of Completion
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Sticky Enrollment Card - Desktop */}
                        <div className="hidden lg:block">
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

            {/* Mobile Enrollment Sticky Footer */}
            <div className="lg:hidden sticky top-[60px] z-20 bg-white dark:bg-gray-900 border-b border-border p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-extrabold text-[#0A3D62] dark:text-blue-400">Free</span>
                    </div>
                    {isEnrolled ? (
                        <button
                            onClick={() => navigate(isTest ? `/test-engine/${course.slug}` : `/learn/${course.slug}`)}
                            className="px-6 py-2.5 bg-[#0A3D62] text-white rounded-lg font-semibold"
                        >
                            {isTest ? 'Start Exam' : 'Continue'}
                        </button>
                    ) : (
                        <button onClick={handleEnroll} disabled={enrolling} className="px-6 py-2.5 bg-[#0A3D62] hover:bg-[#072a44] text-white rounded-lg font-semibold flex items-center gap-2">
                            {enrolling ? <LoadingSpinner size="sm" /> : null}
                            {isTest ? 'Register Free' : 'Enroll Free'}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="page-container py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">

                        {/* Dynamic Tabs */}
                        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto custom-scrollbar">
                            {availableTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab
                                        ? 'border-[#0A3D62] text-[#0A3D62] dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in">
                                {/* Conditional Rendering based on Course vs Test */}
                                {isTest ? (
                                    <>
                                        <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8">
                                            <h2 className="text-xl font-bold mb-4 text-[#0A3D62] dark:text-white">Exam Guidelines & Rules</h2>
                                            <ul className="space-y-3">
                                                {course.instructions?.length > 0 ? (
                                                    course.instructions.map((inst, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                            <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                                            <span className="leading-tight">{inst}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    // Fallback instructions if none provided
                                                    <>
                                                        <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                            <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                                            <span>Ensure you have a stable internet connection before starting.</span>
                                                        </li>
                                                        <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                            <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                                            <span>The timer cannot be paused once the exam begins. If you leave the page, the timer continues.</span>
                                                        </li>
                                                        <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                            <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                                            <span>The test will automatically submit when the timer reaches zero.</span>
                                                        </li>
                                                        <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                            <span className="font-bold">You can revisit and retake this mock exam as many times as you like to perfect your score!</span>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About this Mock Exam</h2>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                                {course.description || `Prepare for your ${course.examType || 'upcoming'} exam with this standard CBT practice test. Analyze your performance, review answers immediately after completion, and try again until you achieve a perfect score.`}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {course.whatYouWillLearn?.length > 0 && (
                                            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 md:p-8">
                                                <h2 className="text-xl font-bold mb-5 text-[#0A3D62] dark:text-white">What you'll learn</h2>
                                                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                                                    {course.whatYouWillLearn.map((item, i) => (
                                                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                            <span className="leading-tight">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Course Description</h2>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                                {course.description || "No description provided for this subject."}
                                            </div>
                                        </div>

                                        {course.requirements?.length > 0 && (
                                            <div>
                                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Requirements</h2>
                                                <ul className="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    {course.requirements.map((req, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D62] dark:bg-blue-400 mt-1.5 flex-shrink-0" />
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

                        {/* Curriculum Tab (Only shown for non-tests) */}
                        {activeTab === 'curriculum' && !isTest && (
                            <div className="animate-in fade-in">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {course.sections?.length || 0} sections • {totalLessons} lessons • {formatDuration(course.totalDuration)} total
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {course.sections?.map((section) => (
                                        <div key={section._id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-card">
                                            <button
                                                onClick={() => toggleSection(section._id)}
                                                className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                            >
                                                <div>
                                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{section.title}</span>
                                                    <span className="text-xs font-medium text-gray-500 ml-3">
                                                        {section.lessons.length} lessons
                                                    </span>
                                                </div>
                                                {expandedSections[section._id] ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                            </button>

                                            {expandedSections[section._id] && (
                                                <div className="border-t border-gray-100 dark:border-gray-800">
                                                    {section.lessons.map((lesson) => (
                                                        <div key={lesson._id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                                            {lesson.isPreview ? (
                                                                <Play className="w-4 h-4 text-[#0A3D62] dark:text-blue-400 flex-shrink-0" />
                                                            ) : (
                                                                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                            )}
                                                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{lesson.title}</span>

                                                            {lesson.duration > 0 && (
                                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
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
                                        <div className="text-center py-10 text-gray-500">
                                            No curriculum content uploaded yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Instructor Tab */}
                        {activeTab === 'instructor' && (
                            <div className="flex flex-col sm:flex-row gap-6 bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in">
                                {course.instructor?.avatar?.url ? (
                                    <img src={course.instructor.avatar.url} alt="" className="w-24 h-24 rounded-full object-cover flex-shrink-0 shadow-md" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-bold text-[#0A3D62] dark:text-blue-400 flex-shrink-0">
                                        {course.instructor?.name?.[0] || 'T'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.instructor?.name || 'YS Edu Expert'}</h3>
                                    <p className="text-[#0A3D62] dark:text-blue-400 text-sm font-medium mb-3">{course.instructor?.headline || 'Educational Consultant'}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 bg-white dark:bg-gray-800 py-2 px-4 rounded-lg inline-flex shadow-sm">
                                        <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> Top Instructor</span>
                                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> {course.instructor?.totalStudents || 0} Students</span>
                                        <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-500" /> {course.instructor?.courses?.length || 0} Courses</span>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {course.instructor?.bio || 'Dedicated to providing high-quality educational resources for UTME and secondary school students.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="animate-in fade-in">
                                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                    <div className="text-center sm:border-r border-blue-200 dark:border-blue-800 sm:pr-8">
                                        <div className="text-6xl font-extrabold text-amber-500 mb-2">{course.averageRating?.toFixed(1) || '0.0'}</div>
                                        <StarRating rating={course.averageRating || 0} size="md" />
                                        <div className="text-sm font-medium text-[#0A3D62] dark:text-blue-300 mt-2">Overall Rating</div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left text-sm text-gray-600 dark:text-gray-400">
                                        <p className="mb-1 font-medium text-gray-900 dark:text-white">Based on {course.totalReviews || 0} reviews</p>
                                        <p>Only enrolled {isTest ? 'candidates' : 'students'} can leave reviews to ensure authentic feedback.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block" />
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
        <div className="bg-white dark:bg-card border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden sticky top-[100px] z-10 text-gray-900 dark:text-white">
            {/* Thumbnail */}
            {course.thumbnail?.url ? (
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                    <img src={course.thumbnail.url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            {isTest ? <FileText className="w-7 h-7 text-[#0A3D62]" /> : <Play className="w-7 h-7 text-[#0A3D62] ml-1" />}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-gray-800 flex flex-col items-center justify-center text-[#0A3D62] dark:text-blue-400">
                    {isTest ? <FileText className="w-12 h-12 mb-2 opacity-50" /> : <BookOpen className="w-12 h-12 mb-2 opacity-50" />}
                    <span className="font-semibold opacity-70">{isTest ? 'Mock Exam Preview' : 'Course Preview'}</span>
                </div>
            )}

            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-[#0A3D62] dark:text-blue-400">Free</span>
                </div>

                {isEnrolled ? (
                    <div className="space-y-4">
                        {progress && !isTest && (
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between text-sm font-semibold text-[#0A3D62] dark:text-blue-300 mb-2">
                                    <span>Your Progress</span>
                                    <span>{progress.completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${progress.completionPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {progress && isTest && progress.completionPercentage > 0 && (
                            <div className="bg-amber-50 dark:bg-gray-900 p-4 rounded-xl border border-amber-100 dark:border-gray-800">
                                <div className="flex justify-between text-sm font-semibold text-[#0A3D62] dark:text-blue-300 mb-1">
                                    <span>Latest Score:</span>
                                    <span className="text-lg">{progress.completionPercentage}%</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate(isTest ? `/test-engine/${course.slug}` : `/learn/${course.slug}`)}
                            className="w-full py-4 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all text-lg"
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
                            className="w-full py-4 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mb-3 transition-all text-lg"
                        >
                            {enrolling ? <LoadingSpinner size="sm" /> : null}
                            {isTest ? 'Register for Free' : 'Enroll for Free'}
                        </button>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-1.5 mb-6">
                            <Shield className="w-4 h-4 text-green-500" /> 100% Free • No hidden fees
                        </p>
                    </div>
                )}

                {/* Dynamic Feature List */}
                <div className="space-y-3.5 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        {isTest ? 'Exam Features:' : 'This course includes:'}
                    </h4>
                    {featuresToDisplay.map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Icon className="w-4 h-4 flex-shrink-0 text-[#0A3D62] dark:text-blue-400" />
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}