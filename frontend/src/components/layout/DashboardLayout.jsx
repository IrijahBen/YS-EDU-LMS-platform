import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookOpen, TrendingUp, Award, Heart, User,
    DollarSign, Users, BarChart2, LogOut, Menu,
    GraduationCap, ChevronRight, FileQuestion, ClipboardList
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getInitials } from '../../lib/utils';

const navConfig = {
    student: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'My Courses', href: '/my-courses', icon: BookOpen },
        { label: 'Progress', href: '/progress', icon: TrendingUp },
        { label: 'Certificates', href: '/certificates', icon: Award },
        { label: 'Wishlist', href: '/wishlist', icon: Heart },
        { label: 'Payment History', href: '/payment/history', icon: DollarSign },
        { label: 'Profile', href: '/profile', icon: User },
    ],
    instructor: [
        { label: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
        { label: 'Practice Tests', href: '/instructor/tests', icon: ClipboardList },
        { label: 'Analytics', href: '/instructor/analytics', icon: BarChart2 },
        { label: 'Earnings', href: '/instructor/earnings', icon: DollarSign },
        { label: 'Students', href: '/instructor/students', icon: Users },
        { label: 'Profile', href: '/instructor/profile', icon: User },
    ],
    admin: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Courses', href: '/admin/courses', icon: BookOpen },
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
        { label: 'Payments', href: '/admin/payments', icon: DollarSign },
        { label: 'Profile', href: '/admin/profile', icon: User },
    ],
};

export default function DashboardLayout() {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ✅ THE FIX: We completely removed the `role` prop override. 
    // Now, it strictly uses your actual database role. You will never be downgraded to a student again!
    const effectiveRole = user?.role || 'student';

    const navItems = navConfig[effectiveRole] || navConfig.student;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-4 border-b border-border">
                <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
                    <div className="w-8 h-8 bg-[#0A3D62] rounded-lg flex items-center justify-center shadow-md">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[#0A3D62] tracking-tight">YS EDU</span>
                        <span className="text-[0.5rem] text-gray-400 uppercase tracking-tighter">Consultancy</span>
                    </div>
                </Link>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                    {user?.avatar?.url ? (
                        <img src={user.avatar.url} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm border border-border" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#0A3D62] flex items-center justify-center text-white font-bold shadow-sm">
                            {getInitials(user?.name)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">{user?.name}</p>
                        <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-[#0A3D62] dark:text-blue-300 px-2 py-0.5 rounded-full capitalize font-bold border border-blue-100 dark:border-blue-800">
                            {effectiveRole}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive
                                ? 'bg-[#0A3D62] text-white shadow-lg shadow-blue-900/20'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0A3D62]'
                                }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {item.label}
                            {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 border-t border-border space-y-1">
                <Link to="/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                    <BookOpen className="w-4 h-4" /> Browse Library
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-white dark:bg-gray-900 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-border z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="flex-1 lg:flex-none">
                        <h1 className="text-sm font-bold text-[#0A3D62] dark:text-white ml-2 lg:ml-0">
                            {navItems.find((n) => location.pathname.startsWith(n.href))?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-[10px] font-black uppercase text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-800">
                            {effectiveRole} Account
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}