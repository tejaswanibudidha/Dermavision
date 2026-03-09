import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-secondary-50">
            <Navbar />
            <main className="flex-grow">
                {children || <Outlet />}
            </main>
            <footer className="bg-primary-900 border-t border-primary-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-100/60 text-sm">
                    &copy; {new Date().getFullYear()} DermaVision AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
