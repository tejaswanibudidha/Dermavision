import React from 'react';
import { motion } from 'framer-motion';
import { Building2, HeartPulse, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6 font-display"
                    >
                        About DermaVision AI
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90"
                    >
                        DermaVision AI uses advanced artificial intelligence to analyze skin images and provide early detection of skin diseases. Our goal is to help users get quick insights and encourage early medical consultation.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-xl border border-secondary-100"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                            <Activity className="w-6 h-6 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Mission</h2>
                        <p className="text-secondary-600 leading-relaxed">
                            To leverage the power of artificial intelligence for the early detection of skin conditions, making advanced diagnostic tools accessible to everyone. We strive to bridge the gap between initial concern and professional medical advice.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-xl border border-secondary-100"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                            <HeartPulse className="w-6 h-6 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Vision</h2>
                        <p className="text-secondary-600 leading-relaxed">
                            A world where healthcare is accessible to everyone instantly. We envision a future where technology empowers individuals to take proactive control of their skin health through accurate, immediate insights.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">How it Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Upload Image", desc: "Take a clear photo of the skin area and upload it securely.", step: "01" },
                            { title: "AI Analysis", desc: "Our advanced AI scans the image for patterns of common skin diseases.", step: "02" },
                            { title: "Get Insights", desc: "Receive immediate insights, probability scores, and precautions.", step: "03" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative bg-slate-50 p-8 rounded-2xl border border-slate-200"
                            >
                                <span className="absolute top-4 right-4 text-6xl font-black text-slate-200/50 select-none">
                                    {item.step}
                                </span>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 relative z-10">{item.title}</h3>
                                <p className="text-slate-600 relative z-10">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4 bg-gradient-to-br from-primary-900 to-primary-800 text-white text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to check your skin health?</h2>
                
            </section>
        </div>
    );
};

export default About;
