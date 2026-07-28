import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Clock, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Register() {
    const [searchParams] = useSearchParams();
    const { register: registerUser, isLoading } = useAuthStore();
    
    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // New state to track successful submission
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { role: searchParams.get('role') || 'student' },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data) => {
        const result = await registerUser(data);
        if (result.success) {
            // Instead of navigating, trigger the pending approval UI
            setIsSuccess(true);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950 font-sans">
            {/* ── Left Panel (Branding) ──────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0A3D62] via-[#0e4e7c] to-blue-900 text-white flex-col justify-center p-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/4 pointer-events-none" />

                <div className="relative z-10 max-w-lg mx-auto">
                    <Link to="/" className="flex items-center gap-4 font-heading font-bold text-2xl mb-14 hover:opacity-90 transition-opacity">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L1 9L4 10.63V17C4 18.66 7.58 20 12 20C16.42 20 20 18.66 20 17V10.63L23 9L12 3ZM12 18C8.69 18 6 17.11 6 16V11.72L12 15L18 11.72V16C18 17.11 15.31 18 12 18Z" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="tracking-widest text-xl">YOJ SIMCHA</span>
                            <span className="text-[0.65rem] tracking-[0.2em] font-medium mt-1.5 text-blue-200">EDUCATIONAL CONSULTANCY</span>
                        </div>
                    </Link>

                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                        Start your journey today
                    </h2>
                    <p className="text-blue-100 text-lg md:text-xl mb-12 font-light leading-relaxed">
                        Join thousands of successful students and expert instructors achieving their academic dreams with YS Edu.
                    </p>

                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { value: '10K+', label: 'Successful Placements' },
                            { value: '100+', label: 'Study Resources' },
                            { value: '50+', label: 'Expert Instructors' },
                            { value: '100%', label: 'Free Access' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-md shadow-lg shadow-black/5">
                                <div className="text-3xl font-black mb-2 tracking-tight">{stat.value}</div>
                                <div className="text-blue-200 text-sm font-semibold tracking-wide uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Panel (Form / Success State) ─────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative z-10">
                <div className="w-full max-w-md py-8">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-10">
                        <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl text-[#0A3D62] dark:text-white">
                            <div className="w-12 h-12 bg-[#0A3D62] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3L1 9L4 10.63V17C4 18.66 7.58 20 12 20C16.42 20 20 18.66 20 17V10.63L23 9L12 3ZM12 18C8.69 18 6 17.11 6 16V11.72L12 15L18 11.72V16C18 17.11 15.31 18 12 18Z" />
                                </svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="tracking-widest">YOJ SIMCHA</span>
                                <span className="text-[0.6rem] tracking-[0.2em] font-bold mt-1 text-gray-500 dark:text-gray-400 uppercase">Educational Consultancy</span>
                            </div>
                        </Link>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            /* ── REGISTRATION FORM ── */
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h1 className="text-3xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight">Create an account</h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 text-base">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-[#0A3D62] dark:text-blue-400 hover:underline font-bold">Sign in here</Link>
                                </p>

                                {/* Role selector */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {[
                                        { value: 'student', label: 'I want to learn', emoji: '🎓' },
                                        { value: 'instructor', label: 'I want to teach', emoji: '👨‍🏫' },
                                    ].map((role) => (
                                        <label
                                            key={role.value}
                                            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                                selectedRole === role.value
                                                    ? 'border-[#0A3D62] bg-blue-50/50 dark:bg-blue-900/20 shadow-sm scale-[1.02]'
                                                    : 'border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                            }`}
                                        >
                                            <input type="radio" {...register('role')} value={role.value} className="sr-only" />
                                            <span className="text-3xl mb-1">{role.emoji}</span>
                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{role.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#0A3D62] focus:ring-4 focus:ring-blue-900/10 text-gray-900 dark:text-white transition-all font-medium placeholder:font-normal"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-sm font-bold mt-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500"/> {errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' } })}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#0A3D62] focus:ring-4 focus:ring-blue-900/10 text-gray-900 dark:text-white transition-all font-medium placeholder:font-normal"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-sm font-bold mt-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500"/> {errors.email.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters required' } })}
                                                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#0A3D62] focus:ring-4 focus:ring-blue-900/10 text-gray-900 dark:text-white transition-all font-medium placeholder:font-normal"
                                                placeholder="••••••••"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-sm font-bold mt-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500"/> {errors.password.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full px-6 py-4 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(10,61,98,0.2)] hover:shadow-[0_10px_25px_rgba(10,61,98,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 text-lg"
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : 'Create Account'}
                                    </button>
                                </form>

                                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                    By creating an account, you agree to our{' '}
                                    <Link to="/terms" className="text-[#0A3D62] dark:text-blue-400 hover:underline font-bold">Terms</Link> and{' '}
                                    <Link to="/privacy" className="text-[#0A3D62] dark:text-blue-400 hover:underline font-bold">Privacy Policy</Link>
                                </p>
                            </motion.div>
                        ) : (
                            /* ── PENDING APPROVAL STATE ── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-black/5"
                            >
                                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-[#0A3D62] dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-12 h-12" />
                                </div>
                                
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                                    Registration Submitted!
                                </h2>
                                
                                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30 p-5 rounded-2xl mb-8 flex flex-col items-center">
                                    <Clock className="w-8 h-8 text-amber-500 mb-3" />
                                    <p className="text-amber-800 dark:text-amber-500 font-semibold mb-1">
                                        Account Pending Approval
                                    </p>
                                    <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed text-center">
                                        To ensure community quality, an administrator must review your registration details before you can log in.
                                    </p>
                                </div>

                                <ul className="space-y-4 text-left text-sm text-gray-600 dark:text-gray-400 mb-10">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Your details have been securely saved to our system.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Our team is actively reviewing your request.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>You will receive an email notification once your account is activated.</span>
                                    </li>
                                </ul>

                                <Link 
                                    to="/login"
                                    className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
                                >
                                    Return to Login <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
