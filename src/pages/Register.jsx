import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { createUser, setCurrentUser } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setIsSubmitting(true);
            const createdUser = await createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            setCurrentUser(createdUser);
            navigate('/dashboard');
        } catch (apiError) {
            setError(apiError.message || 'Failed to create account.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-secondary-50 px-4 py-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                    <p className="text-slate-600 mt-2">Join DermaVision to start your health journey</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input pl-10 block w-full"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input pl-10 block w-full"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input pl-10 block w-full"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full btn btn-primary py-3">
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {error && (
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    )}
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
