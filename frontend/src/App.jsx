import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Services = lazy(() => import('./pages/Services'));
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));

// Student pages
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const MyCourses = lazy(() => import('./pages/student/MyCourses'));
const LearnCourse = lazy(() => import('./pages/student/LearnCourse'));
const TestEngine = lazy(() => import('./pages/student/TestEngine'));
const StudentProgress = lazy(() => import('./pages/student/Progress'));
const MyCertificates = lazy(() => import('./pages/student/Certificates'));
const Wishlist = lazy(() => import('./pages/student/Wishlist'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));
const PaymentSuccess = lazy(() => import('./pages/student/PaymentSuccess'));
const PaymentHistory = lazy(() => import('./pages/student/PaymentHistory'));
const QuizPage = lazy(() => import('./pages/student/QuizPage'));

// Instructor pages
const InstructorDashboard = lazy(() => import('./pages/instructor/Dashboard'));
const InstructorAnalytics = lazy(() => import('./pages/instructor/Analytics'));
const InstructorEarnings = lazy(() => import('./pages/instructor/Earnings'));
const StudentManagement = lazy(() => import('./pages/instructor/StudentManagement'));
const TestManagement = lazy(() => import('./pages/instructor/TestManagement'));
const CreateTest = lazy(() => import('./pages/instructor/CreateTest'));
const TestEditor = lazy(() => import('./pages/instructor/TestEditor'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const AdminPayments = lazy(() => import('./pages/admin/Payments'));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
    </div>
);

export default function App() {
    const { fetchMe } = useAuthStore();

    useEffect(() => {
        fetchMe();
    }, []);

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: { borderRadius: '10px', background: '#333', color: '#fff' },
                    success: { style: { background: '#10b981' } },
                    error: { style: { background: '#ef4444' } },
                }}
            />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public routes with MainLayout (Navbar/Footer) */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:slug" element={<CourseDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/verify-certificate/:id" element={<VerifyCertificate />} />
                    </Route>

                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />

                    {/* Student Dashboard Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']} />}>
                        <Route element={<DashboardLayout role="student" />}>
                            <Route path="/dashboard" element={<StudentDashboard />} />
                            <Route path="/my-courses" element={<MyCourses />} />
                            <Route path="/progress" element={<StudentProgress />} />
                            <Route path="/certificates" element={<MyCertificates />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/profile" element={<StudentProfile />} />
                            <Route path="/payment/success" element={<PaymentSuccess />} />
                            <Route path="/payment/history" element={<PaymentHistory />} />
                        </Route>
                        {/* Learning Interface (Distraction Free) */}
                        <Route path="/learn/:slug" element={<LearnCourse />} />
                        <Route path="/test-engine/:slug" element={<TestEngine />} />
                        <Route path="/quiz/:quizId" element={<QuizPage />} />
                    </Route>

                    {/* Instructor / Educator Dashboard Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
                        <Route element={<DashboardLayout role="instructor" />}>
                            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                            {/* ✅ THE FIX: Dedicated profile route for instructors */}
                            <Route path="/instructor/profile" element={<StudentProfile />} />

                            <Route path="/instructor/tests" element={<TestManagement />} />
                            <Route path="/instructor/tests/new" element={<CreateTest />} />
                            <Route path="/instructor/tests/:id/edit" element={<TestEditor />} />
                            <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
                            <Route path="/instructor/earnings" element={<InstructorEarnings />} />
                            <Route path="/instructor/students" element={<StudentManagement />} />
                        </Route>
                    </Route>

                    {/* Admin Dashboard Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route element={<DashboardLayout role="admin" />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            {/* ✅ THE FIX: Dedicated profile route for admins */}
                            <Route path="/admin/profile" element={<StudentProfile />} />

                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/courses" element={<AdminCourses />} />
                            <Route path="/admin/analytics" element={<AdminAnalytics />} />
                            <Route path="/admin/payments" element={<AdminPayments />} />
                        </Route>
                    </Route>

                    {/* Catch-all: Redirect to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </>
    );
}