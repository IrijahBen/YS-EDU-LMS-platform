import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { register: registerUser, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { role: searchParams.get('role') || 'student' },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data) => {
        const result = await registerUser(data);
        if (result.success) {
            const role = result.user.role;
            if (role === 'instructor') navigate('/instructor/dashboard');
            else navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0A3D62] to-blue-900 text-white flex-col justify-center p-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/4 pointer-events-none" />

                <div className="relative z-10 max-w-lg mx-auto">
                    <Link to="/" className="flex items-center gap-3 font-heading font-bold text-2xl mb-12">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L1 9L4 10.63V17C4 18.66 7.58 20 12 20C16.42 20 20 18.66 20 17V10.63L23 9L12 3ZM12 18C8.69 18 6 17.11 6 16V11.72L12 15L18 11.72V16C18 17.11 15.31 18 12 18Z" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="tracking-widest">YOJ SIMCHA</span>
                            <span className="text-[0.6rem] tracking-[0.2em] font-medium mt-1 text-blue-200">EDUCATIONAL CONSULTANCY</span>
                        </div>
                    </Link>

                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">Start learning today</h2>
                    <p className="text-blue-100 text-lg mb-10">Join thousands of successful students achieving their academic dreams with YS Edu.</p>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: '10K+', label: 'Successful Placements' },
                            { value: '100+', label: 'Study Resources' },
                            { value: '50+', label: 'Expert Instructors' },
                            { value: '100%', label: 'Free Access' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
                                <div className="text-2xl font-extrabold mb-1">{stat.value}</div>
                                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md py-8"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl text-[#0A3D62] dark:text-white">
                            <div className="w-10 h-10 bg-[#0A3D62] rounded-xl flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3L1 9L4 10.63V17C4 18.66 7.58 20 12 20C16.42 20 20 18.66 20 17V10.63L23 9L12 3ZM12 18C8.69 18 6 17.11 6 16V11.72L12 15L18 11.72V16C18 17.11 15.31 18 12 18Z" />
                                </svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="tracking-widest">YOJ SIMCHA</span>
                                <span className="text-[0.55rem] tracking-[0.2em] font-medium mt-1 text-gray-500 dark:text-gray-400 uppercase">Educational Consultancy</span>
                            </div>
                        </Link>
                    </div>

                    <h1 className="text-2xl font-heading font-bold mb-2 text-gray-900 dark:text-white">Create your free account</h1>
                    <p className="text-muted-foreground mb-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#0A3D62] dark:text-blue-400 hover:underline font-semibold">Sign in</Link>
                    </p>

                    {/* Role selector */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                            { value: 'student', label: 'I want to learn', emoji: '🎓' },
                            { value: 'instructor', label: 'I want to teach', emoji: '👨‍🏫' },
                        ].map((role) => (
                            <label
                                key={role.value}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === role.value
                                        ? 'border-[#0A3D62] bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800'
                                    }`}
                            >
                                <input type="radio" {...register('role')} value={role.value} className="sr-only" />
                                <span className="text-2xl mb-1">{role.emoji}</span>
                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{role.label}</span>
                            </label>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50 text-gray-900 dark:text-white transition-shadow"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' } })}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50 text-gray-900 dark:text-white transition-shadow"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50 text-gray-900 dark:text-white transition-shadow"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3.5 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-[#0A3D62] dark:text-blue-400 hover:underline font-medium">Terms of Service</Link> and{' '}
                        <Link to="/privacy" className="text-[#0A3D62] dark:text-blue-400 hover:underline font-medium">Privacy Policy</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}