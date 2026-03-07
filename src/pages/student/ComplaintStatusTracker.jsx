import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
    XCircle,
    User,
    FileText,
    MessageSquare,
    Activity,
    DollarSign,
    Image,
    Copy,
    RotateCw,
    ArrowUp
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_STYLES = {
    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
    Assigned: 'bg-purple-50 text-purple-600 border-purple-100',
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
    Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Closed: 'bg-slate-100 text-slate-500 border-slate-200',
    Rejected: 'bg-rose-50 text-rose-600 border-rose-100'
};

const useComplaintSearch = () => {

    const [complaint, setComplaint] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userRegisterNo = sessionStorage.getItem('registerNo');

    const searchComplaint = useCallback(async (searchId) => {

        if (!searchId.trim()) return;
        setLoading(true);
        setError('');
        setComplaint(null);
        setHistory([]);

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
                setComplaint(data.complaint);
                setHistory(data.history || []);
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

                const closureEntry = {
                    _id: Date.now().toString(),
                    status: 'Closed',
                    description: 'Complaint closed by student',
                    createdAt: new Date().toISOString(),
                    updatedBy: { name: 'You', role: 'Student' }
                };
                setHistory(prev => [...prev, closureEntry]);

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
        history,
        loading,
        error,
        searchComplaint,
        closeComplaint
    };
};
const ComplaintSkeleton = () => (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden animate-pulse">
        <div className="p-8 sm:p-10 border-b border-slate-100">
            <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
            <div className="h-8 w-48 bg-slate-300 rounded"></div>
        </div>
        <div className="p-8 sm:p-10 space-y-6">
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
            <div className="h-16 w-full bg-slate-100 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-slate-100 rounded-2xl"></div>
                <div className="h-20 bg-slate-100 rounded-2xl"></div>
            </div>
        </div>
    </div>
);

const CopyButton = ({ text }) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="ml-2 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            aria-label="Copy complaint ID"
            title="Copy ID"
        >
            {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
        </button>
    );
};

const StatusBadge = ({ status }) => {
    const baseStyles = 'px-5 py-2 rounded-full border-2 text-xs font-black uppercase tracking-wider shadow-sm transition-transform hover:scale-105';
    const statusStyle = STATUS_STYLES[status] || 'bg-slate-50 text-slate-500 border-slate-100';
    return (
        <div className={`${baseStyles} ${statusStyle}`} aria-label={`Status: ${status}`}>
            {status}
        </div>
    );
};

const HistoryItem = ({ entry, isLast }) => {

    const [selectedImage, setSelectedImage] = useState(null);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={16} />;
            case 'Assigned': return <User size={16} />;
            case 'In Progress': return <Activity size={16} />;
            case 'Resolved': return <CheckCircle2 size={16} />;
            case 'Closed': return <Archive size={16} />;
            case 'Rejected': return <XCircle size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const getStatusColor = (status) => {
        return STATUS_STYLES[status]?.split(' ')[1] || 'text-slate-500';
    };

    const getImageUrl = (photoPath) => {
        if (photoPath.startsWith('http')) return photoPath;
        const baseUrl = API_BASE_URL.replace('/api', '');
        const cleanPath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
        return `${baseUrl}/${cleanPath}`;
    };

    return (
        <>
            <div className="relative flex gap-4 group">
                {!isLast && (
                    <div
                        className="absolute left-4 top-10 w-0.5 h-16 bg-gradient-to-b from-indigo-200 to-slate-100"
                        aria-hidden="true"
                    />
                )}

                <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 
                    ${entry.status ? getStatusColor(entry.status).replace('text-', 'bg-').replace('600', '100') : 'bg-slate-100'}
                    border-2 border-white shadow-md group-hover:scale-110 group-hover:shadow-lg`}
                >
                    <div className={entry.status ? getStatusColor(entry.status) : 'text-slate-400'}>
                        {getStatusIcon(entry.status)}
                    </div>
                </div>

                <div className="flex-1 pb-6">
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {new Date(entry.createdAt).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                {entry.status && <StatusBadge status={entry.status} />}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <User size={12} />
                                <span className="font-medium">{entry.updatedBy?.name || 'System'}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-400">{entry.updatedBy?.role || 'Update'}</span>
                            </div>
                        </div>

                        {entry.title && (
                            <div className="mb-2 flex items-start gap-2">
                                <FileText size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-bold text-slate-700">{entry.title}</p>
                            </div>
                        )}

                        {entry.description && (
                            <div className="mb-2 flex items-start gap-2">
                                <MessageSquare size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-600">{entry.description}</p>
                            </div>
                        )}

                        {entry.charges && (
                            <div className="mb-2 flex items-start gap-2">
                                <DollarSign size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium text-slate-700">Charges: ₹{entry.charges}</p>
                            </div>
                        )}

                        {entry.photos && entry.photos.length > 0 && (
                            <div className="mt-3">
                                <div className="flex items-start gap-2 mb-2">
                                    <Image size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Attachments ({entry.photos.length})
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                    {entry.photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            className="relative group/image cursor-pointer rounded-lg overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                                            onClick={() => setSelectedImage(getImageUrl(photo))}
                                        >
                                            <img
                                                src={getImageUrl(photo)}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-24 object-cover hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-xs text-white font-bold">Click to view</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] animate-in zoom-in-95">
                        <img
                            src={selectedImage}
                            alt="Enlarged attachment"
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
                            aria-label="Close image"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// Enhanced: Complaint details card with copy, refresh, and scroll behaviour
const ComplaintCard = ({ complaint, history, onClose, isClosing, onRefresh }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const cardRef = useRef(null);

    // Auto-scroll to card when it appears
    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const getImageUrl = (photoPath) => {
        if (photoPath.startsWith('http')) return photoPath;
        const baseUrl = API_BASE_URL.replace('/api', '');
        return `${baseUrl}/uploads/${photoPath}`;
    };

    return (
        <>
            <article
                ref={cardRef}
                className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500"
                aria-label="Complaint details"
            >
                {/* Header with copy and refresh */}
                <div className="p-8 sm:p-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-50/30 to-transparent">
                    <div className="space-y-1">
                        <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center">
                            Tracking Identity
                            <CopyButton text={complaint.complaintId} />
                        </p>
                        <h2 className="text-3xl font-black text-slate-900">{complaint.complaintId}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onRefresh}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            aria-label="Refresh status"
                            title="Refresh"
                        >
                            <RotateCw size={18} />
                        </button>
                        {complaint.status === 'Resolved' && (
                            <button
                                onClick={onClose}
                                disabled={isClosing}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-100 hover:border-rose-600 disabled:opacity-50"
                                aria-label="Close this complaint"
                            >
                                <Archive size={14} />
                                {isClosing ? 'Closing...' : 'Close Complaint'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 sm:p-10">
                    {/* Main details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
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

                            {complaint.photos && complaint.photos.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                        Complaint Attachments ({complaint.photos.length})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {complaint.photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="relative group/image cursor-pointer rounded-lg overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                                                onClick={() => setSelectedImage(getImageUrl(photo))}
                                            >
                                                <img
                                                    src={getImageUrl(photo)}
                                                    alt={`Complaint attachment ${index + 1}`}
                                                    className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-xs text-white font-bold">Click to view</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <MapPin size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Department</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">
                                        {complaint.department?.name || 'Unassigned'}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Calendar size={14} />
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

                            {complaint.assignedTo && (
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-1">
                                        <User size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Assigned To</span>
                                    </div>
                                    <p className="text-xs font-bold text-indigo-700">
                                        {complaint.assignedTo.name}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Current Status Summary */}
                        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                Current Status
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Priority:</span>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${complaint.priority === 'Emergency' ? 'bg-rose-100 text-rose-700' :
                                        complaint.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                            complaint.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {complaint.priority}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Last Updated:</span>
                                    <span className="text-sm font-bold text-slate-700">
                                        {new Date(complaint.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {complaint.resolvedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Resolved On:</span>
                                        <span className="text-sm font-bold text-emerald-700">
                                            {new Date(complaint.resolvedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* History Timeline Section */}
                    {history && history.length > 0 ? (
                        <section className="border-t border-slate-100 pt-8">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Clock size={16} />
                                <span>Complete Timeline ({history.length} {history.length === 1 ? 'update' : 'updates'})</span>
                            </h4>

                            <div className="space-y-1">
                                {history.map((entry, index) => (
                                    <HistoryItem
                                        key={entry._id}
                                        entry={entry}
                                        isLast={index === history.length - 1}
                                    />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <div className="border-t border-slate-100 pt-8 text-center text-slate-400">
                            <Clock size={24} className="mx-auto mb-2" />
                            <p className="text-sm font-medium">No history updates yet.</p>
                        </div>
                    )}
                </div>
            </article>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] animate-in zoom-in-95">
                        <img
                            src={selectedImage}
                            alt="Enlarged attachment"
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
                            aria-label="Close image"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const ComplaintStatusTracker = () => {

    const [searchId, setSearchId] = useState('');
    const { complaint, history, loading, error, searchComplaint, closeComplaint } = useComplaintSearch();
    const [isClosing, setIsClosing] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleRefresh = useCallback(() => {
        if (complaint) {
            searchComplaint(complaint.complaintId);
        }
    }, [complaint, searchComplaint]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto space-y-8">
                {/* Header */}
                <header className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        <ShieldCheck size={14} />
                        <span>Secure Tracking Portal</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Track Your Grievance</h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        Enter your unique Complaint ID to view real-time status updates and complete history.
                    </p>
                </header>

                {/* Search Form - Enhanced with glass effect */}
                <form onSubmit={handleSearch} className="relative group" aria-label="Complaint search form">
                    <input
                        type="text"
                        placeholder="Enter Complaint ID (e.g., CMP-8829)"
                        className="w-full pl-6 pr-36 py-5 bg-white/70 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-bold text-slate-700 shadow-lg"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        disabled={loading}
                        aria-label="Complaint ID input"
                    />
                    <button
                        type="submit"
                        disabled={loading || !searchId.trim()}
                        className="absolute right-3 top-3 bottom-3 px-8 bg-blue-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        aria-label={loading ? 'Searching...' : 'Track Status'}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                <span>Searching</span>
                            </>
                        ) : (
                            <>
                                <span>Track Status</span>
                                <ChevronRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Error Message with retry */}
                {error && (
                    <div
                        className="flex items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300"
                        role="alert"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                        <button
                            onClick={() => searchId && searchComplaint(searchId)}
                            className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-100 px-3 py-1 rounded-lg hover:bg-rose-200 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && !complaint && <ComplaintSkeleton />}

                {/* Complaint Details */}
                {complaint && (
                    <ComplaintCard
                        complaint={complaint}
                        history={history}
                        onClose={handleClose}
                        isClosing={isClosing}
                        onRefresh={handleRefresh}
                    />
                )}
            </div>

            {/* Back to top button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    aria-label="Back to top"
                >
                    <ArrowUp size={20} />
                </button>
            )}
        </div>
    );
};

export default ComplaintStatusTracker;