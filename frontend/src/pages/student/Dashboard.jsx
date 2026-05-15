import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, Star, ArrowRight, Play, FileText } from 'lucide-react';
import { userService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAuthStore from '../../store/authStore';

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data: res } = await userService.getDashboard();
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

    const stats = data?.stats || {};
    const recentProgress = data?.recentProgress || [];
    const enrolledCourses = data?.enrolledCourses || [];

    const statCards = [
        { label: 'Total Enrollments', value: stats.totalCourses || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Completed', value: stats.completedCourses || 0, icon: Award, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { label: 'Hours Learned', value: stats.totalWatchTime || 0, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { label: 'Certificates', value: stats.totalCertificates || 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-muted-foreground mt-1">Continue your learning journey</p>
                </div>
                <Link to="/courses" className="hidden sm:flex items-center gap-2 btn-primary text-sm">
                    <BookOpen className="w-4 h-4" /> Browse Catalog
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card border border-border rounded-xl p-4"
                        >
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Gamification */}
            {(stats.points > 0 || stats.badges?.length > 0) && (
                <div className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold mb-1">Your Progress</h3>
                            <div className="flex items-center gap-4 text-sm">
                                <span>⭐ {stats.points} points</span>
                                <span>🏆 Level {stats.level}</span>
                                {stats.badges?.length > 0 && <span>🎖️ {stats.badges.length} badges</span>}
                            </div>
                        </div>
                        <div className="text-4xl">🚀</div>
                    </div>
                </div>
            )}

            {/* Continue Learning */}
            {recentProgress.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Activity</h2>
                        <Link to="/my-courses" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentProgress.slice(0, 3).map((p) => {
                            const isTest = p.course?.type === 'test';

                            return (
                                <div key={p._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    {p.course?.thumbnail?.url ? (
                                        <img src={p.course.thumbnail.url} alt="" className="w-full h-32 object-cover" />
                                    ) : (
                                        <div className="w-full h-32 bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/40 dark:to-purple-900/40 flex items-center justify-center">
                                            {isTest ? <FileText className="w-8 h-8 text-brand-400" /> : <BookOpen className="w-8 h-8 text-brand-400" />}
                                        </div>
                                    )}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isTest ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {isTest ? 'Mock Exam' : 'Course'}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-sm mb-3 line-clamp-2 flex-1">{p.course?.title}</h3>

                                        <div className="mb-4">
                                            {isTest ? (
                                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-muted-foreground">Latest Score:</span>
                                                        <span className="font-bold text-[#0A3D62] dark:text-blue-400">{p.completionPercentage}%</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                        <span>Progress</span>
                                                        <span>{p.completionPercentage}%</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${p.completionPercentage}%` }} />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <Link
                                            to={isTest ? `/test-engine/${p.course?.slug}` : `/learn/${p.course?.slug}`}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                        >
                                            {isTest ? (
                                                <>
                                                    <FileText className="w-4 h-4" />
                                                    {p.completionPercentage > 0 ? 'Review / Retake' : 'Start Exam'}
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4" />
                                                    {p.completionPercentage > 0 ? 'Continue' : 'Start'}
                                                </>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {enrolledCourses.length === 0 && (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <h3 className="text-lg font-semibold mb-2">No enrollments yet</h3>
                    <p className="text-muted-foreground mb-6">Start your learning journey by enrolling in a course or practice test.</p>
                    <Link to="/courses" className="btn-primary">Browse Catalog</Link>
                </div>
            )}
        </div>
    );
}