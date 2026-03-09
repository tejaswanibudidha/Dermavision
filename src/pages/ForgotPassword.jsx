import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    requestPasswordReset,
    setNewPassword,
    verifyPasswordResetOtp,
} from '../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
    const [step, setStep] = useState('email');
    const [resetToken, setResetToken] = useState('');
    const [resetForm, setResetForm] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleResetInputChange = (event) => {
        const { name, value } = event.target;
        setResetForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!resetForm.email.trim()) {
            setError('Please enter your email to receive OTP.');
            return;
        }

        try {
            setIsOtpSubmitting(true);
            const response = await requestPasswordReset({ email: resetForm.email.trim() });
            setStep('otp');
            setSuccessMessage(response.message || 'OTP sent successfully.');
        } catch (apiError) {
            setError(apiError.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsOtpSubmitting(false);
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!resetForm.otp.trim()) {
            setError('Please enter the OTP sent to your email.');
            return;
        }

        try {
            setIsOtpSubmitting(true);
            const response = await verifyPasswordResetOtp({
                email: resetForm.email.trim(),
                otp: resetForm.otp.trim(),
            });
            setResetToken(response.reset_token || '');
            setStep('password');
            setSuccessMessage(response.message || 'OTP verified successfully.');
        } catch (apiError) {
            setError(apiError.message || 'Failed to verify OTP.');
        } finally {
            setIsOtpSubmitting(false);
        }
    };

    const handleSetNewPassword = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!resetToken) {
            setError('OTP verification is required before setting a new password.');
            return;
        }

        if (!resetForm.newPassword.trim()) {
            setError('Please enter a new password.');
            return;
        }

        if (resetForm.newPassword !== resetForm.confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            setIsOtpSubmitting(true);
            const response = await setNewPassword({
                reset_token: resetToken,
                new_password: resetForm.newPassword,
            });
            setSuccessMessage(response.message || 'Password reset successful. Redirecting to login...');
            setStep('done');
            setResetToken('');
            setResetForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
            window.setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (apiError) {
            setError(apiError.message || 'Failed to reset password.');
        } finally {
            setIsOtpSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-secondary-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Password Recovery</h2>
                    <p className="text-slate-600 mt-2">Email OTP verification followed by secure password update</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Registered Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={resetForm.email}
                            onChange={handleResetInputChange}
                            className="input block w-full"
                            placeholder="you@example.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn btn-secondary"
                        disabled={isOtpSubmitting || step !== 'email'}
                    >
                        {isOtpSubmitting ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>

                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">OTP</label>
                            <input
                                type="text"
                                name="otp"
                                required
                                value={resetForm.otp}
                                onChange={handleResetInputChange}
                                className="input block w-full"
                                placeholder="Enter 6-digit OTP"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full btn btn-secondary"
                            disabled={isOtpSubmitting || step !== 'otp'}
                        >
                            {isOtpSubmitting ? 'Verifying OTP...' : 'Verify OTP'}
                        </button>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={handleSetNewPassword} className="space-y-3 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                required
                                value={resetForm.newPassword}
                                onChange={handleResetInputChange}
                                className="input block w-full"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={resetForm.confirmPassword}
                                onChange={handleResetInputChange}
                                className="input block w-full"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full btn btn-primary" disabled={isOtpSubmitting}>
                            {isOtpSubmitting ? 'Updating Password...' : 'Set New Password'}
                        </button>
                    </form>
                )}

                {error && <p className="text-sm text-red-600 font-medium mt-4">{error}</p>}
                {successMessage && <p className="text-sm text-emerald-600 font-medium mt-4">{successMessage}</p>}

                <div className="mt-6 text-right">
                    <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
