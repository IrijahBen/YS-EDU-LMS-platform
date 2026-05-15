import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Award, FileText } from 'lucide-react';
import { userService } from '../../services/api';
import { SkeletonCard } from '../../components/common/LoadingSpinner';

export default function MyCourses() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        userService.getDashboard().then(({ data: res }) => {
            setData(res);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-4">
            <div className="skeleton h-8 w-48 rounded" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    );

    const enrolledCourses = data?.enrolledCourses || [];
    const progressMap = {};
    (data?.recentProgress || []).forEach((p) => { progressMap[p.course?._id] = p; });

    const filtered = enrolledCourses.filter((e) => {
        const p = progressMap[e.course?._id];
        const isTest = e.course?.type === 'test';

        if (filter === 'courses') return !isTest;
        if (filter === 'tests') return isTest;
        if (filter === 'completed') return p?.isCompleted;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-heading font-bold">My Learning</h1>
                <Link to="/courses" className="btn-primary text-sm">Browse More</Link>
            </div>

            {/* Filter tabs updated to separate Courses and Tests */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { value: 'all', label: `All (${enrolledCourses.length})` },
                    { value: 'courses', label: 'Video Courses' },
                    { value: 'tests', label: 'Mock Exams' },
                    { value: 'completed', label: 'Completed' },
                ].map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f.value ? 'bg-brand-600 text-white' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No items found in this category</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((enrollment) => {
                        const course = enrollment.course;
                        if (!course) return null;

                        const isTest = course.type === 'test';
                        const p = progressMap[course._id];
                        const pct = p?.completionPercentage || 0;

                        return (
                            <div key={enrollment._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                {course.thumbnail?.url ? (
                                    <img src={course.thumbnail.url} alt="" className="w-full h-36 object-cover" />
                                ) : (
                                    <div className="w-full h-36 bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
                                        {isTest ? <FileText className="w-10 h-10 text-brand-400" /> : <BookOpen className="w-10 h-10 text-brand-400" />}
                                    </div>
                                )}

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isTest ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {isTest ? 'Mock Exam' : 'Course'}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-sm mb-3 line-clamp-2 flex-1">{course.title}</h3>

                                    <div className="mb-4">
                                        {isTest ? (
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Latest Score:</span>
                                                    <span className="font-bold text-[#0A3D62] dark:text-blue-400">{pct}%</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                    <span>{pct === 100 ? '✅ Completed' : `${pct}% complete`}</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={isTest ? `/test-engine/${course.slug}` : `/learn/${course.slug}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg transition-colors"
                                        >
                                            {isTest ? (
                                                <>
                                                    <FileText className="w-4 h-4" /> {pct > 0 ? 'Review / Retake' : 'Start Exam'}
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4" /> {pct > 0 ? 'Continue' : 'Start'}
                                                </>
                                            )}
                                        </Link>

                                        {!isTest && pct === 100 && (
                                            <Link to="/certificates" className="p-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                                                <Award className="w-5 h-5 text-amber-500" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}