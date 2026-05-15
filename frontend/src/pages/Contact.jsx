import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        // Target email address
        const targetEmail = 'yojsimcha@gmail.com';

        // Format the subject and body for the email client
        const emailSubject = encodeURIComponent(`YS Edu Website Inquiry: ${data.subject}`);
        const emailBody = encodeURIComponent(
            `Name: ${data.name}\nReturn Email: ${data.email}\n\nMessage:\n${data.message}`
        );

        // Create the mailto link
        const mailtoLink = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

        // Open the default email client (e.g., Gmail, Outlook, Apple Mail)
        window.location.href = mailtoLink;

        toast.success('Opening your email client...');
        reset(); // Clear the form after opening the email app
    };

    return (
        <div className="bg-slate-50 dark:bg-gray-950 min-h-screen pb-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#0A3D62] to-blue-900 text-white py-16">
                <div className="page-container text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact YS Edu</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Have a question about studying abroad or our services? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="py-16 page-container -mt-8">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">

                    {/* Contact Info Panel */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-lg">
                        <h2 className="text-2xl font-heading font-bold text-[#0A3D62] dark:text-white mb-8">Get in Touch</h2>
                        <div className="space-y-8">
                            {[
                                {
                                    icon: Mail,
                                    label: 'Email Address',
                                    value: 'yojsimcha@gmail.com',
                                    href: 'mailto:yojsimcha@gmail.com'
                                },
                                {
                                    icon: Phone,
                                    label: 'Phone Number',
                                    value: '+(234) 8177-899-371',
                                    href: 'tel:+2348177899371'
                                },
                                {
                                    icon: MapPin,
                                    label: 'Office Address',
                                    value: 'B203-204, Abimbolu shopping Compex, Bola Ige, Liberty Road, Oke-Ado, Ibadan (Appointments Only)',
                                    href: 'https://maps.google.com/?q=Liberty+Road,Oke-Ado,Ibadan'
                                },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.label} className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800">
                                            <Icon className="w-6 h-6 text-[#0A3D62] dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white mb-1">{item.label}</p>
                                            <a
                                                href={item.href}
                                                target={item.label === 'Office Address' ? '_blank' : undefined}
                                                rel="noopener noreferrer"
                                                className="text-gray-600 dark:text-gray-400 text-sm hover:text-[#0A3D62] dark:hover:text-blue-400 transition-colors leading-relaxed"
                                            >
                                                {item.value}
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Form Panel */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Send a Message</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Fill out the form below, and it will open your email app ready to send to us.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                                    <input
                                        {...register('name', { required: "Name is required" })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50 text-gray-900 dark:text-white"
                                        placeholder="e.g. John Doe"
                                    />
                                    {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Your Email</label>
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50 text-gray-900 dark:text-white"
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                                <input
                                    {...register('subject', { required: "Subject is required" })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50 text-gray-900 dark:text-white"
                                    placeholder="e.g. Admission Inquiry"
                                />
                                {errors.subject && <span className="text-xs text-red-500 mt-1">{errors.subject.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                                <textarea
                                    {...register('message', { required: "Please enter a message" })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/50 text-gray-900 dark:text-white resize-none"
                                    placeholder="How can we assist you today?"
                                />
                                {errors.message && <span className="text-xs text-red-500 mt-1">{errors.message.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                            >
                                <Send className="w-5 h-5" />
                                Open Email App to Send
                            </button>
                        </form>
                    </div>

                </div>
            </section>
        </div>
    );
}