import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send } from 'lucide-react';

const Contact = () => {
    const emailAddress = 'support@dermavision.ai';
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;

    const handleEmailClick = (event) => {
        event.preventDefault();
        window.location.href = `mailto:${emailAddress}`;
    };

    const handleEmailKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleEmailClick(event);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-primary-900 mb-4 font-display">Get in Touch</h1>
                    <p className="text-secondary-600 max-w-2xl mx-auto">
                        Have questions about our AI technology or need support? We're here to help.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-secondary-100 flex items-start space-x-4">
                            <div className="bg-primary-100 p-3 rounded-xl">
                                <MapPin className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary-900 mb-1">Our Location</h3>
                                <a
                                    href="https://maps.app.goo.gl/k1EZteDPew62Vh4Q8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                                >
                                    Gmr,Rajam,Vizianagaram,Andrapadresh,India
                                </a>
                            </div>
                        </div>

                        <div
                            role="button"
                            tabIndex={0}
                            onClick={handleEmailClick}
                            onKeyDown={handleEmailKeyDown}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-secondary-100 flex items-start space-x-4 transition-colors hover:border-primary-200 cursor-pointer"
                        >
                            <div className="bg-primary-100 p-3 rounded-xl">
                                <Mail className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary-900 mb-1">Email Us</h3>
                                
                                <div className="mt-2 flex items-center gap-3 text-sm">
                                    <a
                                        href={gmailComposeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-secondary-600 hover:text-primary-600 transition-colors underline"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        support@dermavisison
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-secondary-100 flex items-start space-x-4">
                            <div className="bg-primary-100 p-3 rounded-xl">
                                <Phone className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary-900 mb-1">Call Support</h3>
                                <a href="tel:+919876543210" className="text-secondary-600 hover:text-primary-600 transition-colors">
                                    +91 9876543210
                                </a>
                            </div>
                        </div>

                        {/* Map Placeholder or Additional Info could go here */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-2xl shadow-xl text-white mt-8">
                            <h3 className="text-xl font-bold mb-4">Why Contact Us?</h3>
                            <p className="opacity-90 leading-relaxed">
                                Whether you're a medical professional looking to partner or a user with questions about our analysis, our team is ready to assist you.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-2xl shadow-xl border border-secondary-100"
                    >
                        <h2 className="text-2xl font-bold text-primary-900 mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-secondary-50"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-secondary-50"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-secondary-50 resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                            >
                                <span>Send Message</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
