import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    ShieldAlert,
    FileText,
    Percent,
    Utensils
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Disease Name', path: '/dashboard/disease', icon: Activity },
        { name: 'Precautions', path: '/dashboard/precautions', icon: ShieldAlert },
        { name: 'Summary', path: '/dashboard/summary', icon: FileText },
        { name: 'Confidence', path: '/dashboard/confidence', icon: Percent },
        { name: 'Diet Plan', path: '/dashboard/diet', icon: Utensils },
    ];

    return (
        <div className="w-64 bg-primary-900 h-[calc(100vh-4rem)] border-r border-primary-800 fixed left-0 top-16 overflow-y-auto hidden md:block shadow-xl">
            <div className="p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path; // Exact match for simplicity

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/20 translate-x-1"
                                    : "text-primary-100/70 hover:bg-primary-800 hover:text-white hover:translate-x-1"
                            )}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-primary-400 group-hover:text-white transition-colors"} />
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
