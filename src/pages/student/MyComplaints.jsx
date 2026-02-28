import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle, Calendar, Building2, Tag, ChevronRight,
    Clock, CheckCircle, Loader2, FileText, ArrowRight,
    Search, X, Download, Image as ImageIcon, Paperclip,
    User, Mail, Phone, AlertTriangle, Flag, ChevronDown,
    ChevronUp, ExternalLink, Filter, RefreshCw, Maximize2,
    MoreVertical, MessageSquare,TrendingUp 
} from 'lucide-react';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 }
};

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedImage, setSelectedImage] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        inProgress: 0,
        avgResolutionTime: 0
    });

    const registerNo = sessionStorage.getItem("registerNo");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/mycomplaints/my-complaints/${registerNo}`);
                const data = await res.json();
                if (res.ok) {
                    setComplaints(data);
                    calculateStats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (registerNo) fetchComplaints();
    }, [registerNo]);

    const calculateStats = (data) => {
        const total = data.length;
        const resolved = data.filter(c => c.status === 'Resolved').length;
        const pending = data.filter(c => c.status === 'Pending').length;
        const inProgress = data.filter(c => c.status === 'In Progress').length;

        const resolvedComplaints = data.filter(c => c.status === 'Resolved' && c.resolvedAt);
        let avgTime = 0;
        if (resolvedComplaints.length > 0) {
            const totalTime = resolvedComplaints.reduce((acc, c) => {
                const created = new Date(c.createdAt);
                const resolved = new Date(c.resolvedAt);
                return acc + (resolved - created);
            }, 0);
            avgTime = Math.round((totalTime / resolvedComplaints.length) / (1000 * 60 * 60));
        }

        setStats({ total, resolved, pending, inProgress, avgResolutionTime: avgTime });
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Filter and sort complaints
    const filteredComplaints = complaints
        .filter(item => {
            const matchesFilter = filter === 'all' ? true :
                item.status.toLowerCase() === filter.toLowerCase();
            const matchesSearch = searchTerm === '' ? true :
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item._id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'priority':
                    const priorityWeight = { 'Emergency': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    return priorityWeight[b.priority] - priorityWeight[a.priority];
                default:
                    return 0;
            }
        });

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Title */}
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                                <FileText size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    My Complaints
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Track and manage your service requests
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search complaints..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 mt-6">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-2">
                            <Filter size={14} className="inline mr-1" />
                            Filter:
                        </span>
                        {['all', 'pending', 'in progress', 'resolved'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full capitalize transition-all ${filter === f
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                {f}
                                {f !== 'all' && (
                                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === f ? 'bg-white/20' : 'bg-slate-200'
                                        }`}>
                                        {complaints.filter(c => c.status.toLowerCase() === f.toLowerCase()).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                    {filteredComplaints.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <EmptyState />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            {filteredComplaints.map((complaint, index) => (
                                <ComplaintCard
                                    key={complaint._id}
                                    complaint={complaint}
                                    index={index}
                                    isExpanded={expandedId === complaint._id}
                                    onToggle={() => toggleExpand(complaint._id)}
                                    onViewImage={(url) => setSelectedImage(url)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Image Viewer Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <ImageViewer
                        imageUrl={selectedImage}
                        onClose={() => setSelectedImage(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Stats Card Component
const StatsCard = ({ label, value, icon: Icon, color }) => {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
        purple: 'from-purple-500 to-purple-600',
        slate: 'from-slate-500 to-slate-600'
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md"
        >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[color]} bg-opacity-10 w-fit mb-2`}>
                <Icon size={16} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
        </motion.div>
    );
};

// Complaint Card Component
const ComplaintCard = ({ complaint, index, isExpanded, onToggle, onViewImage }) => {
    const getStatusColor = (status) => {
        const colors = {
            'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
            'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
            'Assigned': 'bg-purple-100 text-purple-700 border-purple-200',
            'Closed': 'bg-slate-100 text-slate-700 border-slate-200',
            'Rejected': 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            'Emergency': 'bg-red-500 text-white',
            'High': 'bg-orange-500 text-white',
            'Medium': 'bg-yellow-500 text-white',
            'Low': 'bg-blue-500 text-white'
        };
        return colors[priority] || 'bg-slate-500 text-white';
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Emergency': return <AlertTriangle size={12} />;
            case 'High': return <AlertCircle size={12} />;
            default: return <Flag size={12} />;
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            custom={index}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
        >
            {/* Card Header */}
            <div className="p-5 cursor-pointer" onClick={onToggle}>
                <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="hidden sm:block">
                        <div className={`p-3 rounded-xl ${complaint.status === 'Resolved' ? 'bg-emerald-50' :
                                complaint.status === 'In Progress' ? 'bg-blue-50' :
                                    'bg-amber-50'
                            }`}>
                            {complaint.status === 'Resolved' && <CheckCircle className="text-emerald-500" size={24} />}
                            {complaint.status === 'In Progress' && <Loader2 className="text-blue-500 animate-spin" size={24} />}
                            {complaint.status === 'Pending' && <Clock className="text-amber-500" size={24} />}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                #{complaint._id.slice(-6)}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(complaint.status)}`}>
                                {complaint.status}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${getPriorityBadge(complaint.priority)}`}>
                                {getPriorityIcon(complaint.priority)}
                                {complaint.priority}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {complaint.title}
                        </h3>

                        <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                            {complaint.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Building2 size={14} />
                                {complaint.department?.name || 'General'}
                            </span>
                            {complaint.category && (
                                <span className="flex items-center gap-1">
                                    <Tag size={14} />
                                    {complaint.category.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Expand Button */}
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        variants={expandVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="border-t border-slate-100 bg-slate-50/50"
                    >
                        <div className="p-5">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Full Description */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            Description
                                        </h4>
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-200">
                                            {complaint.description}
                                        </p>
                                    </div>

                                    {/* Attachments */}
                                    {complaint.attachments?.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                                Attachments ({complaint.attachments.length})
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {complaint.attachments.map((attachment, idx) => {
                                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="group relative aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden"
                                                        >
                                                            {isImage ? (
                                                                <>
                                                                    <img
                                                                        src={`http://localhost:5000${attachment}`}
                                                                        alt=""
                                                                        className="w-full h-full object-cover cursor-pointer"
                                                                        onClick={() => onViewImage(`http://localhost:5000${attachment}`)}
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://via.placeholder.com/150?text=Error';
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                        <button
                                                                            onClick={() => onViewImage(`http://localhost:5000${attachment}`)}
                                                                            className="p-1.5 bg-white rounded-lg hover:bg-blue-50"
                                                                        >
                                                                            <Maximize2 size={16} className="text-slate-700" />
                                                                        </button>
                                                                        <a
                                                                            href={`http://localhost:5000${attachment}`}
                                                                            download
                                                                            className="p-1.5 bg-white rounded-lg hover:bg-blue-50"
                                                                        >
                                                                            <Download size={16} className="text-slate-700" />
                                                                        </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <a
                                                                    href={`http://localhost:5000${attachment}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-full h-full bg-slate-50 flex flex-col items-center justify-center"
                                                                >
                                                                    <FileText size={24} className="text-slate-400" />
                                                                    <p className="text-xs text-slate-500 mt-1 truncate px-2">
                                                                        {attachment.split('/').pop()}
                                                                    </p>
                                                                </a>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Status Info */}
                                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                            Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-600">Department</span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {complaint.department?.name || 'Not Assigned'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-600">Category</span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {complaint.category?.name || 'General'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-600">Created</span>
                                                <span className="text-sm text-slate-900">
                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-600">Last Updated</span>
                                                <span className="text-sm text-slate-900">
                                                    {new Date(complaint.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Image Viewer Modal
const ImageViewer = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-6xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600?text=Error';
                    }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                    <a
                        href={imageUrl}
                        download
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm"
                    >
                        <Download size={20} />
                    </a>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Empty State Component
const EmptyState = () => (
    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No complaints found</h3>
        <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
        <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 inline-flex items-center gap-2"
        >
            <RefreshCw size={16} />
            Refresh
        </button>
    </div>
);

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/80 rounded-2xl p-6 mb-8 border border-slate-200">
                <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-4" />
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse" />
                ))}
            </div>
        </div>
    </div>
);

export default MyComplaints;


