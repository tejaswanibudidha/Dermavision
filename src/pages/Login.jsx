import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import {
    loginUser,
    setCurrentUser,
} from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!password.trim()) {
            setError('Password is required.');
            return;
        }

        try {
            setIsSubmitting(true);
            const loggedInUser = await loginUser({ email, password });
            setCurrentUser(loggedInUser);
            navigate('/');
        } catch (apiError) {
            setError(apiError.message || 'Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-secondary-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-600 mt-2">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input pl-10 block w-full"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input pl-10 block w-full"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full btn btn-primary py-3">
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>

                    {error && (
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    )}
                    {successMessage && (
                        <p className="text-sm text-emerald-600 font-medium">{successMessage}</p>
                    )}
                </form>

                <div className="mt-4 text-right">
                    <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                        Forgot Password?
                    </Link>
                </div>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
