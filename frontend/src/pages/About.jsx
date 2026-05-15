import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Award, Globe, Heart, Shield, CheckCircle, Target } from 'lucide-react';

export default function About() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0A3D62] to-blue-900 text-white py-20">
                <div className="page-container text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About Yoj Simcha</h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Empowering your higher education journey with expert guidance. ...wisdom nonstop.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 page-container border-b border-border">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-[#0A3D62] dark:text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-[#0A3D62] dark:text-white">Our Mission</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Our mission is to provide expert educational consulting services, bridging aspirations with opportunities. We strive to enhance learning experiences, foster growth, and unlock potential for every student we serve.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-[#0A3D62] dark:text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-[#0A3D62] dark:text-white">Our Vision</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                To be the trusted partner in shaping educational success, empowering learners worldwide through personalized guidance and innovative solutions.
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Users, value: '10K+', label: 'Successful Placements' },
                            { icon: BookOpen, value: '50+', label: 'Partner Universities' },
                            { icon: Award, value: '15+', label: 'Years Experience' },
                            { icon: Shield, value: '98%', label: 'Visa Success Rate' },
                        ].map((s) => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                    <Icon className="w-8 h-8 text-[#0A3D62] dark:text-blue-400 mx-auto mb-3" />
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium mt-1">{s.label}</div>
                                </div>
                            );
                        })}
                    </motion.div>

                </div>
            </section>

            {/* Why Hire Us */}
            <section className="py-20 bg-slate-50 dark:bg-gray-900/30">
                <div className="page-container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0A3D62] dark:text-white mb-4">Why Hire Us?</h2>
                        <p className="text-muted-foreground text-lg">
                            At YS Edu, we simplify your higher education journey with expert guidance and personalized support. Here's why we are the right choice:
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Globe,
                                title: 'Global Expertise',
                                desc: 'Years of collaboration with top educators worldwide ensure accurate, informed advice.'
                            },
                            {
                                icon: Heart,
                                title: 'Tailored Guidance',
                                desc: 'Solutions designed to address your unique challenges and aspirations.'
                            },
                            {
                                icon: Shield,
                                title: 'Easy Accessibility',
                                desc: 'Convenient online consultations whenever and wherever you need them.'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Proven Results',
                                desc: 'Helping students achieve their goals and become leaders in their fields.'
                            },
                        ].map((v, i) => {
                            const Icon = v.icon;
                            return (
                                <motion.div
                                    key={v.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <Icon className="w-7 h-7 text-[#0A3D62] dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{v.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-block px-6 py-3 bg-[#0A3D62]/5 dark:bg-blue-900/20 rounded-full border border-[#0A3D62]/10 dark:border-blue-900/30 text-[#0A3D62] dark:text-blue-300 font-semibold">
                            <span className="mr-2">✨</span> Your success is our priority — Let us guide you toward a brighter future!
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}