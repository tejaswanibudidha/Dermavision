import React, { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, LogOut, Mail, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
    API_BASE_URL,
    clearCurrentUser,
    getCurrentUser,
    getUserById,
    removeUserAvatar,
    setCurrentUser,
    uploadUserAvatar,
    updateUser,
} from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => getCurrentUser());
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);
    const avatarMenuRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        async function loadProfile() {
            if (!user?.id) {
                if (mounted) {
                    setIsLoading(false);
                }
                return;
            }

            try {
                const latest = await getUserById(user.id);
                if (!mounted) {
                    return;
                }

                setUser(latest);
                setCurrentUser(latest);
                setFormData({ name: latest.name, email: latest.email });
                setError('');
            } catch (apiError) {
                if (mounted) {
                    setError(apiError.message || 'Failed to load profile.');
                    setFormData({ name: user.name || '', email: user.email || '' });
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            mounted = false;
        };
    }, [user?.id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setSuccessMessage('');
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!user?.id) {
            setError('Please login first to update your profile.');
            return;
        }

        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Name and email are required.');
            return;
        }

        try {
            setIsSaving(true);
            const updatedUser = await updateUser(user.id, {
                name: formData.name.trim(),
                email: formData.email.trim(),
            });
            setUser(updatedUser);
            setCurrentUser(updatedUser);
            setSuccessMessage('Profile updated successfully.');
        } catch (apiError) {
            setError(apiError.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        clearCurrentUser();
        navigate('/');
    };

    useEffect(() => {
        if (!avatarMenuOpen) {
            return;
        }

        const handleOutsideClick = (event) => {
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
                setAvatarMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [avatarMenuOpen]);

    const handleAvatarUpload = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file || !user?.id) {
            return;
        }

        try {
            setIsUploadingAvatar(true);
            setError('');
            setSuccessMessage('');
            const updatedUser = await uploadUserAvatar(user.id, file);
            setUser(updatedUser);
            setCurrentUser(updatedUser);
            setSuccessMessage('Profile picture updated successfully.');
            setAvatarMenuOpen(false);
        } catch (apiError) {
            setError(apiError.message || 'Failed to upload profile picture.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!user?.id || !user.avatar_url) {
            setAvatarMenuOpen(false);
            return;
        }

        try {
            setIsRemovingAvatar(true);
            setError('');
            setSuccessMessage('');
            const updatedUser = await removeUserAvatar(user.id);
            setUser(updatedUser);
            setCurrentUser(updatedUser);
            setSuccessMessage('Profile picture removed successfully.');
            setAvatarMenuOpen(false);
        } catch (apiError) {
            setError(apiError.message || 'Failed to remove profile picture.');
        } finally {
            setIsRemovingAvatar(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-slate-600">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!user?.id) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-4">
                    <p className="text-slate-700">No active user session found. Please login first.</p>
                    <Link to="/login" className="btn btn-primary inline-flex">Go To Login</Link>
                </div>
            </div>
        );
    }

    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || user.name)}&background=0284c7&color=fff`;
    const avatarUrl = user.avatar_url
        ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${API_BASE_URL}${user.avatar_url}`)
        : fallbackAvatar;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6" ref={avatarMenuRef}>
                        <div className="relative inline-block">
                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white"
                            />

                            <button
                                type="button"
                                onClick={() => setAvatarMenuOpen((prev) => !prev)}
                                className="absolute bottom-1 right-1 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-md transition-colors"
                                title="Profile photo options"
                            >
                                <Camera size={16} />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={isUploadingAvatar}
                            />

                            {avatarMenuOpen && (
                                <div className="absolute top-full mt-2 right-0 z-10 w-44 bg-white border border-slate-200 rounded-lg shadow-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-2"
                                        disabled={isUploadingAvatar || isRemovingAvatar}
                                    >
                                        <ImagePlus size={16} />
                                        {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 disabled:text-slate-400 disabled:hover:bg-transparent"
                                        disabled={!user.avatar_url || isUploadingAvatar || isRemovingAvatar}
                                    >
                                        <Trash2 size={16} />
                                        {isRemovingAvatar ? 'Removing...' : 'Remove Photo'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 -mt-3 mb-4">
                        Click the camera icon on your photo to change or remove it.
                    </p>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                            <div className="flex items-center text-slate-600 mt-1">
                                <Mail size={16} className="mr-2" />
                                {user.email}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                        >
                            <LogOut size={18} className="mr-2" />
                            Sign Out
                        </button>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-8">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Details</h3>
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium text-slate-500">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input mt-1 block w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-slate-500">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input mt-1 block w-full"
                                    required
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Member Since</p>
                                <p className="mt-1 text-sm text-slate-900">User ID: {user.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Account Type</p>
                                <p className="mt-1 text-sm text-slate-900">Personal</p>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
                                {error && <p className="text-sm text-red-600">{error}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
