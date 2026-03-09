import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { getCurrentUser } from '../services/api';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const currentUser = getCurrentUser();
    const isLoggedIn = Boolean(currentUser?.id);

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">D</span>
                            </div>
                            <span className="font-bold text-xl text-primary-900">DermaVision AI</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-primary-900 hover:text-primary-600 font-medium transition-colors">Home</Link>
                        <Link to="/about" className="text-primary-900 hover:text-primary-600 font-medium transition-colors">About</Link>
                        <Link to="/contact" className="text-primary-900 hover:text-primary-600 font-medium transition-colors">Contact</Link>

                        {isLoggedIn ? (
                            <Link to="/profile" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium transition-colors">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                    <User size={18} />
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-primary-900 hover:text-primary-600 font-medium transition-colors">Login</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-primary-900 hover:text-primary-600 hover:bg-primary-50">Home</Link>
                        <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-primary-900 hover:text-primary-600 hover:bg-primary-50">About</Link>
                        <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-primary-900 hover:text-primary-600 hover:bg-primary-50">Contact</Link>
                        {!isLoggedIn && (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-slate-50">Register</Link>
                            </>
                        )}
                        {isLoggedIn && (
                            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Profile</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
