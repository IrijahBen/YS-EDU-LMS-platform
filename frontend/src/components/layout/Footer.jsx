import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Facebook, Instagram, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    // Updated the links to fit the educational consultancy theme
    const links = {
        Company: [
            { label: 'Home', href: '/' },
            { label: 'Why Hire Us', href: '/about#why-hire-us' },
            { label: 'Our Services', href: '/services' },
            { label: 'Vision & Mission', href: '/about#vision' },
        ],
        Support: [
            { label: 'Help Center', href: '/contact' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
        ],
        Services: [
            { label: 'Study Abroad', href: '/services?category=Study+Abroad' },
            { label: 'Visa Processing', href: '/services?category=Visa+Processing' },
            { label: 'Scholarships', href: '/services?category=Scholarships' },
            { label: 'Career Counseling', href: '/services?category=Career+Counseling' },
        ],
    };

    return (
        <footer className="bg-gray-950 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-white mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span>YOJ SIMCHA</span>
                                <span className="text-[0.55rem] tracking-widest text-gray-400 uppercase font-medium">Educational Consultancy</span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-sm">
                            Empowering your Higher Education Journey with Expert Guidance. <br />
                            <span className="italic">...wisdom nonstop</span>
                        </p>

                        {/* Added the full address here since it's quite long in the image */}
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
                            <strong>Address:</strong> B203-204, Abimbolu shopping Compex, Bola Ige, Liberty Road, Oke-Ado, Ibadan (Appointments Only)
                        </p>

                        {/* Social Icons Updated from the Image */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Facebook, href: 'https://facebook.com/yojsimchaedu' },
                                { icon: Instagram, href: 'https://instagram.com/yojsimchaedu' },
                                { icon: Twitter, href: 'https://twitter.com/yojsimchaedu' },
                                { icon: MessageCircle, href: 'https://wa.me/2348177899371' }, // WhatsApp
                                { icon: Mail, href: 'mailto:yojsimcha@gmail.com' },
                            ].map(({ icon: Icon, href }, i) => (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-white mb-4">{title}</h4>
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <Link to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar Updated with Details from Image */}
                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">© {year} YOJ SIMCHA. All rights reserved.</p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-500 text-center sm:text-left">
                        <span>📍 Ibadan, Oyo State</span>
                        <span className="hidden sm:block">•</span>
                        <a href="tel:+2348177899371" className="hover:text-white transition-colors">📞 +(234) 8177-899-371</a>
                        <span className="hidden sm:block">•</span>
                        <a href="mailto:yojsimcha@gmail.com" className="hover:text-white transition-colors">✉️ yojsimcha@gmail.com</a>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}