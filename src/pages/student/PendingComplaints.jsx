import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle, Calendar, Building2, Tag, ChevronRight,
    Clock, CheckCircle, Loader2, FileText, ArrowRight,
    Search, LayoutGrid, List as ListIcon, X, Download,
    User, Mail, Phone, BookOpen, Layers, AlertTriangle,
    Paperclip, Image as ImageIcon
} from 'lucide-react';

const listVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }
    })
};

function PendingComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const registerNo = sessionStorage.getItem("registerNo");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/mycomplaints/my-complaints/${registerNo}`);
                const data = await res.json();
                if (res.ok) setComplaints(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (registerNo) fetchComplaints();
    }, [registerNo]);

    const handleViewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const filteredComplaints = complaints.filter(item =>
        filter === 'all' ? true : item.status.toLowerCase() === filter.toLowerCase()
    );

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-[#FAFAFB] text-[#1A1C21] font-sans antialiased">
            {/* Top Navigation / Progress Summary */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">My Complaints</h1>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Manage Service Requests</p>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                        {['pending', 'in progress', 'resolved', 'all'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                                    filter === f 
                                        ? 'bg-white text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto px-6 py-6">
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredComplaints.length === 0 ? (
                            <EmptyState key="empty" filter={filter} />
                        ) : (
                            filteredComplaints.map((item, i) => (
                                <motion.div
                                    key={item._id}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    variants={listVariants}
                                    className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        {/* Status Column */}
                                        <div className="flex lg:flex-col items-center gap-2 min-w-[100px]">
                                            <StatusIcon status={item.status} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase">
                                                    ID-{item._id.slice(-6)}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 truncate">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 line-clamp-1 mt-1 font-medium">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Meta Tags */}
                                        <div className="flex items-center gap-3">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Department</span>
                                                <span className="text-sm font-semibold text-slate-700">{item.department?.name || 'General'}</span>
                                            </div>
                                            <div className="h-8 w-px bg-slate-100 hidden sm:block mx-2" />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleViewDetails(item)}
                                                className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                                            >
                                                <ArrowRight size={20} />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Progress Micro-Bar */}
                                    <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: item.status === 'Resolved' ? '100%' : item.status === 'In Progress' ? '50%' : '10%' }}
                                            className={`h-full ${getStatusBg(item.status)}`}
                                        />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Complaint Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedComplaint && (
                    <ComplaintModal 
                        complaint={selectedComplaint} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Complaint Modal Component
const ComplaintModal = ({ complaint, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Mock attachments for demo - replace with actual attachments from complaint
    const attachments = complaint.attachments || [
        'https://via.placeholder.com/800x600?text=Complaint+Image+1',
        'https://via.placeholder.com/800x600?text=Complaint+Image+2',
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Complaint Details</h2>
                        <p className="text-sm text-slate-500 mt-1">ID: {complaint._id}</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
                    >
                        <X size={20} />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-2xl ${getStatusBg(complaint.status)}/10 border ${getStatusBorder(complaint.status)}`}>
                                <div className="flex items-center gap-4">
                                    <StatusIcon status={complaint.status} size={32} />
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Current Status: {complaint.status}</h3>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {getStatusMessage(complaint.status)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{complaint.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{complaint.description}</p>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Timeline</h4>
                                <div className="space-y-4">
                                    <TimelineItem 
                                        icon={Calendar}
                                        label="Submitted"
                                        value={new Date(complaint.createdAt).toLocaleString()}
                                        status="completed"
                                    />
                                    {complaint.assignedTo && (
                                        <TimelineItem 
                                            icon={User}
                                            label="Assigned to"
                                            value={complaint.assignedTo.name || 'Staff Member'}
                                            status="completed"
                                        />
                                    )}
                                    {complaint.resolvedAt && (
                                        <TimelineItem 
                                            icon={CheckCircle}
                                            label="Resolved"
                                            value={new Date(complaint.resolvedAt).toLocaleString()}
                                            status="completed"
                                        />
                                    )}
                                    <TimelineItem 
                                        icon={Clock}
                                        label="Last Updated"
                                        value={new Date(complaint.updatedAt).toLocaleString()}
                                        status="pending"
                                    />
                                </div>
                            </div>

                            {/* Attachments Section */}
                            {attachments.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Paperclip size={16} />
                                        Attachments ({attachments.length})
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {attachments.map((url, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedImage(url)}
                                                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                                            >
                                                <img 
                                                    src={url} 
                                                    alt={`Attachment ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ImageIcon className="text-white" size={24} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Meta Info */}
                        <div className="space-y-6">
                            {/* Priority Card */}
                            <div className="bg-slate-50 rounded-2xl p-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Priority Level</h4>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${getPriorityColor(complaint.priority)}`}>
                                    <AlertTriangle size={16} />
                                    <span className="font-bold">{complaint.priority}</span>
                                </div>
                            </div>

                            {/* Category & Department */}
                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</h4>
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-slate-400" />
                                        <span className="font-medium text-slate-900">{complaint.category?.name || 'General'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Department</h4>
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400" />
                                        <span className="font-medium text-slate-900">{complaint.department?.name || 'General'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Student Info (if available) */}
                            {complaint.student && (
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Student Details</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User size={16} className="text-slate-400" />
                                            <span className="text-sm text-slate-900">{complaint.student.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail size={16} className="text-slate-400" />
                                            <span className="text-sm text-slate-600">{complaint.student.email}</span>
                                        </div>
                                        {complaint.student.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} className="text-slate-400" />
                                                <span className="text-sm text-slate-600">{complaint.student.phone}</span>
                                            </div>
                                        )}
                                        {complaint.student.registerNo && (
                                            <div className="flex items-center gap-3">
                                                <BookOpen size={16} className="text-slate-400" />
                                                <span className="text-sm text-slate-600">{complaint.student.registerNo}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Track Progress
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
                                >
                                    <Download size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="relative max-w-5xl max-h-[90vh]"
                        >
                            <img 
                                src={selectedImage} 
                                alt="Preview" 
                                className="w-full h-full object-contain rounded-2xl"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-xl hover:bg-black/70 flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Timeline Item Component
const TimelineItem = ({ icon: Icon, label, value, status }) => (
    <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
            status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
        }`}>
            <Icon size={14} />
        </div>
        <div>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
    </div>
);

// Helper functions
const StatusIcon = ({ status, size = 24 }) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return <CheckCircle className="text-emerald-500" size={size} />;
        case 'in progress': return <Loader2 className="text-blue-500 animate-spin-slow" size={size} />;
        case 'assigned': return <User className="text-purple-500" size={size} />;
        case 'rejected': return <AlertCircle className="text-red-500" size={size} />;
        case 'closed': return <X className="text-slate-500" size={size} />;
        default: return <Clock className="text-amber-500" size={size} />;
    }
};

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return 'text-emerald-600';
        case 'in progress': return 'text-blue-600';
        case 'assigned': return 'text-purple-600';
        case 'rejected': return 'text-red-600';
        case 'closed': return 'text-slate-600';
        default: return 'text-amber-600';
    }
};

const getStatusBg = (status) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return 'bg-emerald-500';
        case 'in progress': return 'bg-blue-500';
        case 'assigned': return 'bg-purple-500';
        case 'rejected': return 'bg-red-500';
        case 'closed': return 'bg-slate-500';
        default: return 'bg-amber-500';
    }
};

const getStatusBorder = (status) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return 'border-emerald-200';
        case 'in progress': return 'border-blue-200';
        case 'assigned': return 'border-purple-200';
        case 'rejected': return 'border-red-200';
        case 'closed': return 'border-slate-200';
        default: return 'border-amber-200';
    }
};

const getStatusMessage = (status) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return 'This complaint has been successfully resolved.';
        case 'in progress': return 'Your complaint is currently being worked on.';
        case 'assigned': return 'This complaint has been assigned to a staff member.';
        case 'rejected': return 'This complaint has been rejected. Please contact support for more information.';
        case 'closed': return 'This complaint has been closed.';
        default: return 'Your complaint is pending review.';
    }
};

const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'emergency': return 'bg-red-100 text-red-700 border border-red-200';
        case 'high': return 'bg-orange-100 text-orange-700 border border-orange-200';
        case 'medium': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
        case 'low': return 'bg-green-100 text-green-700 border border-green-200';
        default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
};

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-[#FAFAFB] p-10">
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />)}
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />)}
            </div>
        </div>
    </div>
);

const EmptyState = ({ filter }) => (
    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
            <Search size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No matching requests</h3>
        <p className="text-slate-500 text-sm mt-1">Try adjusting your filters to find what you're looking for.</p>
    </div>
);

export default PendingComplaints;