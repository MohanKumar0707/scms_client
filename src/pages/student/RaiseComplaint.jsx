import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AlertCircle, CheckCircle2, Send, Trash2, FileText,
    Tag, Building2, AlertTriangle, ChevronRight, Info,
    ShieldCheck, Sparkles
} from 'lucide-react';

const API_URL = "http://localhost:5000/api";

function RaiseComplaint() {

    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        department: '',
        priority: 'Medium'
    });

    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (formData.department) {
            const filtered = categories.filter(cat => cat.department._id === formData.department);
            setFilteredCategories(filtered);
            setFormData(prev => ({ ...prev, category: '' }));
        } else {
            setFilteredCategories([]);
            setFormData(prev => ({ ...prev, category: '' }));
        }
    }, [formData.department, categories]);

    const fetchData = async () => {
        try {
            const [categoriesRes, departmentsRes] = await Promise.all([
                axios.get(`${API_URL}/categories/fetchcategories`),
                axios.get(`${API_URL}/categories/fetchDepartments/categories`)
            ]);
            setCategories(categoriesRes.data);
            setDepartments(departmentsRes.data);
        } catch (err) {
            setMessage({ text: 'Unable to connect to support servers.', type: 'error' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            department: '',
            priority: 'Medium'
        });
        setFile(null);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const studentId = sessionStorage.getItem('registerNo');

            if (!studentId) {
                setMessage({ text: 'User not authenticated. Please log in again.', type: 'error' });
                setLoading(false);
                return;
            }

            const data = new FormData();
            data.append('studentId', studentId);
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('department', formData.department);
            data.append('priority', formData.priority);

            if (file) {
                data.append('image', file);
            }

            await axios.post(`${API_URL}/complaints/raisecomplaints`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({ text: 'Ticket submitted successfully!', type: 'success' });
            resetForm(); // Reset the form after successful submission

            // Clear success message after 5 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);

        } catch (err) {
            console.error('Error in raising complaints:', err);
            setMessage({
                text: err.response?.data?.message || 'Error uploading complaint. Please try again.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const priorityConfigs = {
        Low: {
            color: 'emerald',
            icon: <CheckCircle2 className="w-4 h-4" />,
            bgClass: 'bg-emerald-600',
            borderClass: 'border-emerald-600',
            shadowClass: 'shadow-emerald-200'
        },
        Medium: {
            color: 'blue',
            icon: <Info className="w-4 h-4" />,
            bgClass: 'bg-blue-600',
            borderClass: 'border-blue-600',
            shadowClass: 'shadow-blue-200'
        },
        High: {
            color: 'orange',
            icon: <AlertTriangle className="w-4 h-4" />,
            bgClass: 'bg-orange-600',
            borderClass: 'border-orange-600',
            shadowClass: 'shadow-orange-200'
        },
        Emergency: {
            color: 'red',
            icon: <AlertCircle className="w-4 h-4" />,
            bgClass: 'bg-red-600',
            borderClass: 'border-red-600',
            shadowClass: 'shadow-red-200'
        }
    };

    const handleClear = () => {
        resetForm();
        setMessage({ text: '', type: '' }); // Clear any messages
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-700">
            <div className="relative">

                {/* Header */}
                <header className="max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-bold tracking-wider text-blue-600 uppercase">Support Portal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Report an <span className="text-blue-600">Issue</span>
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed">
                        Fill out the details below. Our automated system will route your request to the appropriate department for immediate review.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                            {message.text && (
                                <div className={`flex items-center gap-3 p-4 mx-8 mt-8 rounded-xl border animate-in zoom-in-95 duration-300 ${message.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                    : 'bg-red-50 border-red-100 text-red-800'
                                    }`}>
                                    {message.type === 'success'
                                        ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    }
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Subject Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g., Laboratory AC not working"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Selects */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Primary Department <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-10 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none cursor-pointer"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map(dept => (
                                                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Issue Category <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                disabled={!formData.department}
                                                className="w-full pl-12 pr-10 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                required
                                            >
                                                <option value="">
                                                    {formData.department ? 'Select Category' : 'Select Department first'}
                                                </option>
                                                {filteredCategories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                {/* Priority Chips - Fixed with static classes */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-slate-700">Urgency Level</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, priority: 'Low' }))}
                                            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${formData.priority === 'Low'
                                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 scale-[1.02]'
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Low
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, priority: 'Medium' }))}
                                            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${formData.priority === 'Medium'
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            <Info className="w-4 h-4" />
                                            Medium
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, priority: 'High' }))}
                                            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${formData.priority === 'High'
                                                ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-200 scale-[1.02]'
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            High
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, priority: 'Emergency' }))}
                                            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${formData.priority === 'Emergency'
                                                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200 scale-[1.02]'
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            Emergency
                                        </button>
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Attach Image (Optional)</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Sparkles className="w-8 h-8 text-slate-400 mb-2" />
                                                <p className="text-sm text-slate-500">
                                                    {file ? (
                                                        <span className="text-blue-600 font-medium">{file.name}</span>
                                                    ) : (
                                                        "Click to upload image or drag and drop"
                                                    )}
                                                </p>
                                                {file && (
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    {file && (
                                        <button
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="text-xs text-red-600 hover:text-red-700 mt-1"
                                        >
                                            Remove file
                                        </button>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Detailed Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Please provide specific details like room numbers, times, or people involved..."
                                        className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                                        required
                                        minLength="20"
                                    />
                                    <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        Minimum 20 characters recommended for faster resolution.
                                        {formData.description.length > 0 && (
                                            <span className="ml-1">
                                                ({formData.description.length} characters)
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || !formData.department || !formData.category || !formData.title || !formData.description}
                                        className="flex-[2] group relative flex items-center justify-center bg-slate-900 text-white py-4 px-8 rounded-2xl font-bold overflow-hidden hover:bg-slate-800 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>Submit Ticket</span>
                                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </div>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="flex-1 flex items-center justify-center bg-white text-slate-600 py-4 px-8 rounded-2xl font-bold border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
                            <h3 className="text-xl font-bold mb-4">Submission Guidelines</h3>
                            <ul className="space-y-4 text-blue-50/80 text-sm">
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">1</div>
                                    Be specific about the location and time of the incident.
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">2</div>
                                    Choose the correct department to ensure the right staff is notified.
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">3</div>
                                    Use 'Emergency' only for safety hazards or immediate dangers.
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-slate-800">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <span className="font-bold">Privacy Policy</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Your report is encrypted and only accessible by authorized department heads. We value your privacy and identity security.
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 text-center border-t border-slate-200 pt-8">
                    <p className="text-slate-400 text-sm">
                        For urgent physical emergencies, please contact campus security at
                        <span className="text-slate-700 font-bold ml-1"> (555) 012-3456</span>
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default RaiseComplaint;