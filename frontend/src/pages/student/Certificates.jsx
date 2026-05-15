import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, Share2, ExternalLink, FileText, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { certificateService, userService } from '../../services/api';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Certificates() {
    const [certificates, setCertificates] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            certificateService.getMyCertificates(),
            userService.getDashboard()
        ])
            .then(([certRes, dashRes]) => {
                setCertificates(certRes.data.certificates || []);

                const enrolled = dashRes.data.enrolledCourses || [];
                const recentProgress = dashRes.data.recentProgress || [];

                const progressMap = {};
                recentProgress.forEach((p) => { progressMap[p.course?._id] = p; });

                const completedTests = enrolled.reduce((acc, enrollment) => {
                    const course = enrollment.course;
                    const progress = progressMap[course?._id];

                    if (course?.type === 'test' && progress?.isCompleted) {
                        acc.push({
                            _id: progress._id,
                            courseSlug: course.slug,
                            title: course.title,
                            score: progress.completionPercentage || 0,
                            completedAt: progress.completedAt || progress.updatedAt || new Date(),
                            subject: course.subject || course.category,
                            examType: course.examType || 'Practice Test',
                            duration: course.duration || 0
                        });
                    }
                    return acc;
                }, []);

                setTestResults(completedTests);
            })
            .catch(() => toast.error("Failed to load achievements"))
            .finally(() => setLoading(false));
    }, []);

    const handleShare = (cert) => {
        const url = `${window.location.origin}/verify-certificate/${cert.verificationId}`;
        navigator.clipboard.writeText(url);
        toast.success('Certificate link copied!');
    };

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

    const hasNoAchievements = certificates.length === 0 && testResults.length === 0;

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-heading font-bold">My Achievements & Results</h1>
            </div>

            {hasNoAchievements ? (
                <div className="text-center py-20 bg-card border border-border rounded-xl">
                    <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                    <p className="text-muted-foreground mb-6">Complete a course or a mock exam to see your results here.</p>
                    <Link to="/courses" className="btn-primary">Browse Catalog</Link>
                </div>
            ) : (
                <>
                    {/* SECTION 1: Mock Exam Score Reports */}
                    {testResults.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-2">
                                <FileText className="w-5 h-5 text-[#0A3D62]" /> Mock Exam Score Reports
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {testResults.map((test) => (
                                    <div key={test._id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-6 text-center border-b border-border relative">
                                            <div className="absolute top-3 right-3 bg-white/80 dark:bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-[#0A3D62] dark:text-blue-300">
                                                {test.examType}
                                            </div>
                                            <div className="w-20 h-20 bg-gradient-to-br from-[#0A3D62] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border-4 border-white dark:border-gray-800">
                                                {/* 💡 Explicit Score out of 100 */}
                                                <span className="text-2xl font-black text-white">{test.score}%</span>
                                            </div>
                                            <h3 className="font-bold text-sm mb-1 text-[#0A3D62] dark:text-blue-400">Official Score Report</h3>
                                            <p className="text-xs text-muted-foreground">YS Edu CBT Platform</p>
                                        </div>

                                        <div className="p-5">
                                            <h4 className="font-semibold text-sm mb-4 line-clamp-2">{test.title}</h4>

                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2 mb-4">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground flex items-center gap-1"><BookOpen className="w-3 h-3" /> Subject:</span>
                                                    <span className="font-semibold">{test.subject}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Duration:</span>
                                                    <span className="font-semibold">{test.duration ? `${test.duration} Mins` : 'Standard'}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground flex items-center gap-1"><Award className="w-3 h-3" /> Score:</span>
                                                    {/* 💡 Explicit Score out of 100 */}
                                                    <span className={`font-bold ${test.score >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                                                        {test.score} / 100
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Completed {formatDate(test.completedAt)}
                                            </div>

                                            <Link
                                                to={`/test-engine/${test.courseSlug}`}
                                                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#0A3D62] hover:bg-[#072a44] text-white text-xs font-bold rounded-lg transition-colors"
                                            >
                                                <FileText className="w-3 h-3" /> Review Exam / Retake
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: Formal Course Certificates */}
                    {certificates.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-2 mt-8">
                                <Award className="w-5 h-5 text-amber-500" /> Course Certificates
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {certificates.map((cert) => (
                                    <div key={cert._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30 p-6 text-center border-b border-border">
                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                                                <Award className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">Certificate of Completion</h3>
                                            <p className="text-xs text-muted-foreground">Issued to {cert.studentName}</p>
                                        </div>

                                        <div className="p-5">
                                            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{cert.courseName}</h4>

                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2 mb-4">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Instructor:</span>
                                                    <span className="font-semibold">{cert.instructorName}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Score:</span>
                                                    {/* 💡 Replaces "Completion" with "100%" */}
                                                    <span className="font-bold text-amber-600">
                                                        {cert.grade === 'Completion' ? '100%' : `${cert.grade}%`}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground mb-3 text-center">
                                                Completed {formatDate(cert.completionDate || cert.issuedAt)}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mb-4 font-mono bg-muted p-1.5 rounded text-center">
                                                ID: {cert.verificationId}
                                            </p>

                                            <div className="flex gap-2">
                                                {cert.pdfUrl && (
                                                    <a
                                                        href={cert.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0A3D62] hover:bg-[#072a44] text-white text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" /> Download
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleShare(cert)}
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2 border border-border rounded-lg hover:bg-muted text-xs font-medium transition-colors"
                                                >
                                                    <Share2 className="w-3 h-3" /> Share
                                                </button>
                                                <Link
                                                    to={`/verify-certificate/${cert.verificationId}`}
                                                    className="flex items-center justify-center p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                                    title="Verify Certificate"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}