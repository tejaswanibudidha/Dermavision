import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-secondary-50">
            <Navbar />
            <Sidebar />
            <main className="pt-8 md:pl-64">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
