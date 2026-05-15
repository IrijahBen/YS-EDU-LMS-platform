import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
    {
        name: 'Undergraduates',
        price: 'Free',
        desc: 'For UTME, WAEC & admission seekers',
        features: [
            'Access to all core subjects',
            'University admission guides',
            'Scholarship alerts',
            'Community forum access'
        ],
        cta: 'Join for Free',
        href: '/register',
        highlighted: false,
    },
    {
        name: 'All-Access Pass',
        price: '$0',
        desc: 'Our commitment to accessible education',
        features: [
            'Unlimited course access',
            'Expert counseling materials',
            'Study abroad guidance',
            'Downloadable resources',
            'Ad-free experience',
            'Zero hidden charges'
        ],
        cta: 'Get Started Now',
        href: '/register',
        highlighted: true,
        badge: '100% Free Forever',
    },
    {
        name: 'Postgraduates',
        price: 'Free',
        desc: 'For Masters & PhD candidates',
        features: [
            'Global university network access',
            'Research & thesis guidance',
            'Visa processing tips',
            'Custom learning paths'
        ],
        cta: 'Join for Free',
        href: '/register',
        highlighted: false,
    },
];

export default function Pricing() {
    return (
        <div>
            <section className="bg-gradient-to-br from-[#0A3D62] to-blue-900 text-white py-16">
                <div className="page-container text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Education for Everyone.</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        At YS EDU, we believe quality education should have no barriers. That's why our platform is completely free to accommodate all learners.
                    </p>
                </div>
            </section>

            <section className="py-16 page-container">
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative rounded-2xl p-6 border ${plan.highlighted
                                    ? 'border-[#0A3D62] bg-gradient-to-b from-blue-50 to-white dark:from-[#0A3D62]/20 dark:to-card shadow-xl scale-105 z-10'
                                    : 'border-border bg-card'
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-[#0A3D62] text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                                        <Zap className="w-3 h-3 text-yellow-400" /> {plan.badge}
                                    </span>
                                </div>
                            )}
                            <h3 className="text-xl font-heading font-bold mb-1 text-gray-900 dark:text-white">{plan.name}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>

                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-[#0A3D62] dark:text-blue-400">{plan.price}</span>
                                {plan.price === '$0' && <span className="text-muted-foreground font-medium">/forever</span>}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="leading-tight">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link
                                    to={plan.href}
                                    className={`block text-center py-3.5 rounded-xl font-semibold transition-colors ${plan.highlighted
                                            ? 'bg-[#0A3D62] hover:bg-[#072a44] text-white shadow-md'
                                            : 'border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12 max-w-lg mx-auto p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <p className="text-sm text-[#0A3D62] dark:text-blue-300 font-medium flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> No credit card required. No hidden fees. Just learning.
                    </p>
                </div>
            </section>
        </div>
    );
}