import React, { useState, useCallback, useMemo } from 'react';
import {
    Search,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ShieldCheck,
    ChevronRight,
    Archive,
    Calendar,
    XCircle
} from 'lucide-react';

// -------------------- Configuration --------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// -------------------- Constants --------------------
const STATUS_STYLES = {
    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
    Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Closed: 'bg-slate-100 text-slate-500 border-slate-200',
    Rejected: 'bg-rose-50 text-rose-600 border-rose-100'
};

// -------------------- Custom Hook: useComplaintSearch --------------------
/**
 * Custom hook to manage complaint search state and API calls.
 */
const useComplaintSearch = () => {
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userRegisterNo = sessionStorage.getItem('registerNo');

    const searchComplaint = useCallback(async (searchId) => {
        if (!searchId.trim()) return;

        setLoading(true);
        setError('');
        setComplaint(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/complaintStatus/${encodeURIComponent(searchId)}?registerNo=${encodeURIComponent(
                    userRegisterNo
                )}`
            );
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Complaint not found.');
            } else {
                setComplaint(data);
            }
        } catch (err) {
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [userRegisterNo]);

    const closeComplaint = useCallback(async (complaintId) => {
        if (!window.confirm('Are you sure you want to close this complaint? This action cannot be undone.')) {
            return false;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/complaintStatus/close/${complaintId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ registerNo: userRegisterNo })
                }
            );

            if (response.ok) {
                setComplaint(prev => ({ ...prev, status: 'Closed' }));
                return true;
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to close complaint.');
                return false;
            }
        } catch (err) {
            alert('Error closing complaint. Please check your connection.');
            return false;
        } finally {
            setLoading(false);
        }
    }, [userRegisterNo]);

    return {
        complaint,
        loading,
        error,
        searchComplaint,
        closeComplaint
    };
};

// -------------------- Sub-components --------------------

/**
 * Timeline step indicator for complaint progress.
 */
const TimelineStep = ({ label, description, isDone, isLast }) => (
    <div className="relative flex gap-4">
        {!isLast && (
            <div
                className={`absolute left-3 top-8 w-0.5 h-10 ${isDone ? 'bg-indigo-500' : 'bg-slate-100'}`}
                aria-hidden="true"
            />
        )}
        <div
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${isDone
                ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-100'
                : 'bg-slate-100 text-slate-300'
                }`}
            aria-label={isDone ? 'Completed' : 'Pending'}
        >
            <CheckCircle2 size={14} />
        </div>
        <div>
            <p className={`text-sm font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{description}</p>
        </div>
    </div>
);

/**
 * Status badge component.
 */
const StatusBadge = ({ status }) => {
    const baseStyles = 'px-5 py-2 rounded-full border-2 text-xs font-black uppercase tracking-wider';
    const statusStyle = STATUS_STYLES[status] || 'bg-slate-50 text-slate-500 border-slate-100';
    return (
        <div className={`${baseStyles} ${statusStyle}`} aria-label={`Status: ${status}`}>
            {status}
        </div>
    );
};

/**
 * Complaint details card.
 */
const ComplaintCard = ({ complaint, onClose, isClosing }) => {
    const getStatusStyles = useCallback((status) => STATUS_STYLES[status] || 'bg-slate-50 text-slate-500 border-slate-100', []);

    return (
        <article
            className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden animate-in zoom-in-95 duration-500"
            aria-label="Complaint details"
        >
            {/* Header */}
            <div className="p-8 sm:p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">
                        Tracking Identity
                    </p>
                    <h2 className="text-3xl font-black text-slate-900">{complaint.complaintId}</h2>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <StatusBadge status={complaint.status} />
                    {complaint.status === 'Resolved' && (
                        <button
                            onClick={onClose}
                            disabled={isClosing}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-100 hover:border-rose-600 disabled:opacity-50"
                            aria-label="Close this complaint"
                        >
                            <Archive size={14} aria-hidden="true" />
                            {isClosing ? 'Closing...' : 'Close Complaint'}
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-8" aria-labelledby="details-heading">
                    <h3 id="details-heading" className="sr-only">Complaint Details</h3>
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                            Grievance Subject
                        </h4>
                        <p className="text-lg font-bold text-slate-800 mb-2">{complaint.title}</p>
                        <p className="text-slate-500 leading-relaxed text-sm font-medium">
                            {complaint.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <MapPin size={14} aria-hidden="true" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">Department</span>
                            </div>
                            <p className="text-xs font-bold text-slate-700">
                                {complaint.department?.name || 'Unassigned'}
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <Calendar size={14} aria-hidden="true" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">Date Filed</span>
                            </div>
                            <p className="text-xs font-bold text-slate-700">
                                {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="timeline-heading">
                    <h4 id="timeline-heading" className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                        Resolution Progress
                    </h4>
                    <div className="space-y-8">
                        <TimelineStep
                            label="Complaint Logged"
                            description="Your grievance has been safely recorded."
                            isDone={true}
                        />
                        <TimelineStep
                            label="Under Review"
                            description="Administrative staff is assigning your case."
                            isDone={!!complaint.assignedTo || complaint.status !== 'Pending'}
                        />
                        <TimelineStep
                            label="Final Resolution"
                            description="Issue solved and verified by department."
                            isDone={complaint.status === 'Resolved' || complaint.status === 'Closed'}
                            isLast={true}
                        />
                    </div>
                </section>
            </div>
        </article>
    );
};

// -------------------- Main Component --------------------
/**
 * ComplaintStatusTracker allows students to track the status of their grievances.
 */
const ComplaintStatusTracker = () => {
    const [searchId, setSearchId] = useState('');
    const { complaint, loading, error, searchComplaint, closeComplaint } = useComplaintSearch();
    const [isClosing, setIsClosing] = useState(false);

    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        await searchComplaint(searchId);
    }, [searchId, searchComplaint]);

    const handleClose = useCallback(async () => {
        if (!complaint) return;
        setIsClosing(true);
        await closeComplaint(complaint.complaintId);
        setIsClosing(false);
    }, [complaint, closeComplaint]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-10">
            <div className="mx-auto space-y-8">
                {/* Header Section */}
                <header className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck size={14} aria-hidden="true" />
                        <span>Secure Tracking Portal</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Track Your Grievance</h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        Enter your unique Complaint ID to view real-time status updates and resolution progress.
                    </p>
                </header>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative group" aria-label="Complaint search form">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter Complaint ID (e.g., CMP-8829)"
                        className="w-full pl-14 pr-36 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-slate-700 shadow-sm"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        disabled={loading}
                        aria-label="Complaint ID input"
                    />
                    <button
                        type="submit"
                        disabled={loading || !searchId.trim()}
                        className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={loading ? 'Searching...' : 'Track Status'}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                                <span>Searching</span>
                            </>
                        ) : (
                            'Track Status'
                        )}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div
                        className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300"
                        role="alert"
                    >
                        <AlertCircle size={20} aria-hidden="true" />
                        <span className="font-bold text-sm">{error}</span>
                    </div>
                )}

                {/* Complaint Details Card */}
                {complaint && (
                    <ComplaintCard
                        complaint={complaint}
                        onClose={handleClose}
                        isClosing={isClosing}
                    />
                )}
            </div>
        </div>
    );
};

export default ComplaintStatusTracker;