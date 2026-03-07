import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Clock, Calendar, User, Filter, Search,
    FileText, X, Tag, AlertCircle, Layers, Mail, Phone,
    Award, Star, TrendingUp, Briefcase, ChevronRight
} from 'lucide-react';

function CompletedComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const staffRegisterNo = sessionStorage.getItem("registerNo");
    const staffName = sessionStorage.getItem("name");
    const staffRole = sessionStorage.getItem("role");

    useEffect(() => {
        if (staffRole !== 'staff') {
            navigate('/auth');
            return;
        }
        fetchCompletedComplaints();
    }, []);

    const fetchCompletedComplaints = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/staff/completed/${staffRegisterNo}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch completed complaints');

            const data = await response.json();
            setComplaints(data.complaints || []);
        } catch (err) {
            console.error('Error fetching completed complaints:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch =
            complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.student?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;

        return matchesSearch && matchesPriority;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Emergency': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Emergency': return <AlertCircle size={16} className="text-rose-500" />;
            case 'High': return <TrendingUp size={16} className="text-amber-500" />;
            case 'Medium': return <Award size={16} className="text-blue-500" />;
            case 'Low': return <Star size={16} className="text-emerald-500" />;
            default: return <Tag size={16} className="text-slate-500" />;
        }
    };

    const openModal = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
        document.body.style.overflow = 'unset';
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <AlertCircle className="text-rose-500 mr-3" size={24} />
                            <p className="text-rose-700 font-medium">Error: {error}</p>
                        </div>
                        <button
                            onClick={fetchCompletedComplaints}
                            className="mt-4 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                    <CheckCircle className="text-emerald-500" size={32} />
                                    Completed Complaints
                                </h1>
                                <p className="text-slate-600 mt-1">
                                    Welcome back, <span className="font-semibold text-slate-900">{staffName}</span>. Here are your resolved complaints.
                                </p>
                            </div>
                            <Briefcase className="text-slate-300" size={40} />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Completed</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{complaints.length}</p>
                                </div>
                                <div className="bg-emerald-100 p-3 rounded-lg">
                                    <CheckCircle className="text-emerald-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">This Month</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">
                                        {complaints.filter(c => {
                                            const date = new Date(c.resolvedAt || c.updatedAt);
                                            const now = new Date();
                                            return date.getMonth() === now.getMonth() &&
                                                date.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg Resolution</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">2.5d</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Clock className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by title, ID, or student name..."
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-slate-400" />
                                <select
                                    className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50"
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Complaints List */}
                    {filteredComplaints.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No completed complaints</h3>
                            <p className="text-slate-500">
                                {searchTerm || filterPriority !== 'all'
                                    ? 'No complaints match your filters. Try adjusting your search.'
                                    : 'You haven\'t completed any complaints yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredComplaints.map((complaint) => (
                                <div
                                    key={complaint._id}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => openModal(complaint)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                    #{complaint.complaintId}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                                                    {getPriorityIcon(complaint.priority)}
                                                    {complaint.priority}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle size={12} />
                                                    Completed
                                                </span>
                                            </div>

                                            <h3 className="text-base font-semibold text-slate-900 truncate mb-1">
                                                {complaint.title}
                                            </h3>

                                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                {complaint.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <User size={14} className="text-slate-400" />
                                                    <span className="truncate max-w-[120px]">{complaint.student?.name || 'Unknown'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>Resolved: {formatDate(complaint.resolvedAt || complaint.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openModal(complaint);
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
                                        >
                                            View Details
                                            <ChevronRight size={16} className="ml-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedComplaint && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-slate-900/70 transition-opacity"
                        onClick={closeModal}
                        aria-hidden="true"
                    ></div>

                    {/* Modal container - centers the panel */}
                    <div className="flex min-h-screen items-center justify-center p-4">
                        {/* Modal panel */}
                        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl transform transition-all">
                            {/* Close button */}
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    onClick={closeModal}
                                    className="bg-white rounded-lg p-1 text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Header */}
                            <div className="bg-indigo-700 px-6 py-5 rounded-t-xl">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2" id="modal-title">
                                    <FileText size={20} />
                                    Complaint Details
                                </h3>
                                <p className="text-sm text-slate-300 mt-1">ID: #{selectedComplaint.complaintId}</p>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                                {/* Title */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-slate-500 mb-1">Title</h4>
                                    <p className="text-lg font-semibold text-slate-900">{selectedComplaint.title}</p>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-slate-500 mb-1">Description</h4>
                                    <p className="text-slate-700 whitespace-pre-wrap">{selectedComplaint.description}</p>
                                </div>

                                {/* Student Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Student Details</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm">
                                                <User size={16} className="text-slate-400 mr-2" />
                                                <span className="text-slate-700">{selectedComplaint.student?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Mail size={16} className="text-slate-400 mr-2" />
                                                <span className="text-slate-700">{selectedComplaint.student?.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Phone size={16} className="text-slate-400 mr-2" />
                                                <span className="text-slate-700">{selectedComplaint.student?.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Complaint Metadata */}
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Complaint Info</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm">
                                                <Tag size={16} className="text-slate-400 mr-2" />
                                                <span className="text-slate-700">Priority: </span>
                                                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(selectedComplaint.priority)}`}>
                                                    {selectedComplaint.priority}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Layers size={16} className="text-slate-400 mr-2" />
                                                <span className="text-slate-700">Category: {selectedComplaint.category?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Briefcase size={16} className="text-slate-400 mr-2" />
                                                <span className="text-slate-700">Department: {selectedComplaint.department?.name || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Created</h4>
                                        <p className="text-sm text-slate-700">{formatDate(selectedComplaint.createdAt)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Resolved</h4>
                                        <p className="text-sm text-slate-700">{formatDate(selectedComplaint.resolvedAt || selectedComplaint.updatedAt)}</p>
                                    </div>
                                </div>

                                {/* Resolution Details (if any) */}
                                {selectedComplaint.resolutionNotes && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-slate-500 mb-1">Resolution Notes</h4>
                                        <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedComplaint.resolutionNotes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-200 rounded-b-xl">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-indigo-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CompletedComplaints;