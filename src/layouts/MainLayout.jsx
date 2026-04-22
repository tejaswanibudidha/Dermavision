import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-secondary-50">
            <Navbar />
            <main className="flex-grow">
                {children || <Outlet />}
            </main>
            <footer className="bg-primary-900 border-t border-primary-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-10 pb-8 border-b border-primary-700">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Derma Vision</h3>
                            <p className="text-primary-100 leading-relaxed">
                                AI-powered skin analysis platform helping users detect skin conditions early and get suggestions.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
                            <div className="flex flex-col gap-3 text-primary-100">
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
                                <Link to="/upload" className="hover:text-white transition-colors">Skin Analysis</Link>
                                <Link to="/about" className="hover:text-white transition-colors">About</Link>
                                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
                            <div className="space-y-3 text-primary-100">
                                <p>Phone: +91 98765 43210</p>
                                <p>Email: dermavision32@gmail.com</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Location</h3>
                            <p className="text-primary-100">GMRITDU, Rajam, Vizianagaram, Andhra Pradesh, India</p>
                        </div>
                    </div>

                    <div className="py-6 border-b border-primary-700">
                        <div className="flex flex-wrap items-center justify-center gap-3 text-primary-100 font-medium">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <span>|</span>
                            <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
                            <span>|</span>
                            <Link to="/upload" className="hover:text-white transition-colors">Skin Analysis</Link>
                            <span>|</span>
                            <Link to="/about" className="hover:text-white transition-colors">About</Link>
                            <span>|</span>
                            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                    </div>

                    <div className="pt-6 text-center text-primary-200 font-medium">
                        Made with ❤️ Team DermaVision
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
