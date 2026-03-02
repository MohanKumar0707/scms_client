import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail, Phone,
    BookOpen, Hash, Calendar,
    Edit2, Save, X,
    ArrowLeft,
    AlertCircle, Loader,
} from 'lucide-react';
import toast from 'react-hot-toast';

function Profile() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchUserData();
    }, []);

    const roleBadgeColor = useMemo(() => {
        switch (user?.role) {
            case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'staff': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
    }, [user?.role]);

    const fetchUserData = async () => {
        try {
            const registerNo = sessionStorage.getItem('registerNo');
            const role = sessionStorage.getItem('role');

            if (!registerNo) {
                navigate('/auth');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/profile/users/${registerNo}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Role': role,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch user data');
            }

            setUser(data.user);
            setEditedUser(data.user);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setValidationErrors({});
    };

    const handleCancel = () => {
        if (JSON.stringify(user) !== JSON.stringify(editedUser)) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                resetEdit();
            }
        } else {
            resetEdit();
        }
    };

    const resetEdit = () => {
        setIsEditing(false);
        setEditedUser(user);
        setValidationErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!editedUser.name?.trim()) errors.name = 'Name is required';
        if (!editedUser.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
            errors.email = 'Email is invalid';
        }
        if (editedUser.phone && !/^[0-9+\-\s()]{10,}$/.test(editedUser.phone)) {
            errors.phone = 'Phone number is invalid';
        }
        if (user?.role === 'student' && !editedUser.semester) {
            errors.semester = 'Semester is required';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const hasChanges = useMemo(() => {
        if (!user) return false;
        const fields = ['name', 'email', 'phone', 'department', 'semester'];
        return fields.some(field => user[field] !== editedUser[field]);
    }, [user, editedUser]);

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        const toastId = toast.loading('Updating profile...');

        try {
            const response = await fetch(`http://localhost:5000/api/profile/users/${user.registerNo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editedUser.name,
                    email: editedUser.email,
                    phone: editedUser.phone,
                    department: editedUser.department,
                    semester: editedUser.semester,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            if (editedUser.name !== user.name) {
                sessionStorage.setItem('name', editedUser.name);
            }

            setUser(editedUser);
            setIsEditing(false);
            toast.success('Profile updated successfully!', { id: toastId });
        } catch (err) {
            toast.error(err.message || 'Failed to update profile', { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) return <ProfileSkeleton />;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to load profile</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg py-2 px-3 bg-white shadow-sm border border-gray-200"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>

                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                        >
                            <Edit2 size={18} />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Cover */}
                    <div className="h-36 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 relative">
                        {/* Optional subtle pattern overlay */}
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="px-6 sm:px-10 pb-10">
                        {/* Avatar */}
                        <div className="flex justify-center -mt-16 mb-8">
                            <div className="relative">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl ring-2 ring-white/50">
                                    <span className="text-3xl sm:text-4xl font-bold text-white">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border ${roleBadgeColor} text-xs font-semibold capitalize shadow-sm whitespace-nowrap`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {/* Name and email */}
                        <div className="text-center mb-8">
                            {isEditing ? (
                                <div className="max-w-md mx-auto">
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedUser.name || ''}
                                        onChange={handleChange}
                                        className={`w-full text-2xl sm:text-3xl font-bold text-center text-gray-900 border-b-2 ${validationErrors.name ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                            } bg-transparent px-4 py-2 outline-none transition-colors`}
                                        placeholder="Full Name"
                                        aria-invalid={!!validationErrors.name}
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                                    )}
                                </div>
                            ) : (
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
                            )}
                            <p className="text-gray-500 text-sm sm:text-base mt-1.5">{user.email}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <ProfileField
                                icon={Hash}
                                label="Register Number"
                                value={user.registerNo}
                            />

                            <ProfileField
                                icon={BookOpen}
                                label="Department"
                                value={user.department}
                                isEditing={isEditing}
                                editType="select"
                                name="department"
                                valueEdit={editedUser.department}
                                onChange={handleChange}
                                options={[
                                    'Computer Science & Engineering',
                                    'Electrical Engineering',
                                    'Mechanical Engineering',
                                    'Business Administration',
                                ]}
                            />

                            <ProfileField
                                icon={Mail}
                                label="Email"
                                value={user.email}
                                isEditing={isEditing}
                                name="email"
                                valueEdit={editedUser.email}
                                onChange={handleChange}
                                error={validationErrors.email}
                                type="email"
                            />

                            <ProfileField
                                icon={Phone}
                                label="Phone"
                                value={user.phone || 'Not provided'}
                                isEditing={isEditing}
                                name="phone"
                                valueEdit={editedUser.phone}
                                onChange={handleChange}
                                error={validationErrors.phone}
                                type="tel"
                            />

                            {user.role === 'student' && (
                                <ProfileField
                                    icon={Calendar}
                                    label="Semester"
                                    value={user.semester || 'Not specified'}
                                    isEditing={isEditing}
                                    editType="select"
                                    name="semester"
                                    valueEdit={editedUser.semester}
                                    onChange={handleChange}
                                    options={Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`)}
                                    error={validationErrors.semester}
                                />
                            )}

                            <ProfileField
                                icon={Calendar}
                                label="Member Since"
                                value={formatDate(user.createdAt)}
                            />
                        </div>

                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10">
                                <button
                                    onClick={handleSave}
                                    disabled={!hasChanges || isSaving}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                                >
                                    {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Subcomponent for individual profile fields
function ProfileField({
    icon: Icon,
    label,
    value,
    isEditing,
    editType,
    name,
    valueEdit,
    onChange,
    options = [],
    error,
    type = 'text',
}) {
    return (
        <div className="group bg-gray-50 rounded-xl p-5 hover:bg-gray-100/50 transition-colors border border-gray-100">
            <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
                    <Icon className="text-indigo-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                    {isEditing ? (
                        <div>
                            {editType === 'select' ? (
                                <select
                                    name={name}
                                    value={valueEdit || ''}
                                    onChange={onChange}
                                    className={`w-full bg-transparent border-b ${error ? 'border-red-300' : 'border-gray-300 focus:border-indigo-500'
                                        } text-gray-900 font-medium py-1.5 outline-none transition-colors`}
                                    aria-invalid={!!error}
                                >
                                    <option value="">Select {label}</option>
                                    {options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={type}
                                    name={name}
                                    value={valueEdit || ''}
                                    onChange={onChange}
                                    className={`w-full bg-transparent border-b ${error ? 'border-red-300' : 'border-gray-300 focus:border-indigo-500'
                                        } text-gray-900 font-medium py-1.5 outline-none transition-colors`}
                                    aria-invalid={!!error}
                                />
                            )}
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                    ) : (
                        <p className="text-gray-900 font-medium truncate" title={value}>
                            {value}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Skeleton Loader
function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="h-36 bg-gradient-to-r from-indigo-200 to-purple-200 animate-pulse" />
                    <div className="px-6 sm:px-10 pb-10">
                        <div className="flex justify-center -mt-16 mb-8">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-300 animate-pulse" />
                        </div>
                        <div className="text-center mb-8">
                            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
                            <div className="h-4 w-64 bg-gray-200 rounded mx-auto mt-3 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-gray-200 rounded-lg w-10 h-10 animate-pulse" />
                                        <div className="flex-1">
                                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;