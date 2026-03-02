import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, User, Briefcase, Search, Inbox,
    ArrowUpRight, Clock, AlertCircle,
    CheckCircle2, Activity, Hash, ChevronDown,
    ChevronUp, FileText, Paperclip, Download,
    Eye, Mail, Phone, MapPin, Tag, Shield,
    MessageSquare, X, Filter
} from 'lucide-react';

const AssignedComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const registerNo = sessionStorage.getItem("registerNo") || "STF-2024";

    useEffect(() => {
        const fetchAssignedComplaints = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/staff/assigned/${registerNo}`);
                const data = await res.json();
                if (res.ok) setComplaints(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (registerNo) fetchAssignedComplaints();
    }, [registerNo]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const filtered = complaints.filter(c => {
        const matchesFilter = filter === 'all' || c.status.toLowerCase() === filter.toLowerCase();
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c._id.includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Image Preview Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <ImagePreviewModal 
                        image={selectedImage} 
                        onClose={() => setSelectedImage(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Assigned Complaints</h1>
                                <p className="text-xs text-gray-500">Operator: {registerNo}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
                                <Search size={16} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search complaints..."
                                    className="bg-transparent border-none text-sm focus:outline-none px-2 w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Filter */}
                            <select 
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{filtered.length}</span> complaints
                    </p>
                </div>

                {/* Complaints List */}
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((item, idx) => (
                                <ComplaintCard
                                    key={item._id}
                                    item={item}
                                    index={idx}
                                    isExpanded={expandedId === item._id}
                                    onToggle={() => toggleExpand(item._id)}
                                    onImageClick={setSelectedImage}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

// Complaint Card Component
const ComplaintCard = ({ item, index, isExpanded, onToggle, onImageClick }) => {
    // Get the base URL for images
    const baseURL = 'http://localhost:5000';
    
    // Function to get full image URL
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${baseURL}${path}`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
            {/* Card Header - Always Visible */}
            <div 
                onClick={onToggle}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {/* Priority Indicator */}
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`} />
                            
                            {/* Status Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                                {item.status}
                            </span>
                            
                            {/* Complaint ID */}
                            <span className="text-xs font-mono text-gray-400">
                                #{item._id.slice(-8).toUpperCase()}
                            </span>
                        </div>
                        
                        <h3 className="text-base font-medium text-gray-900 mb-1">
                            {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <User size={14} />
                                {item.student?.name || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    
                    {/* Expand/Collapse Icon */}
                    <div className="ml-4">
                        {isExpanded ? (
                            <ChevronUp size={20} className="text-indigo-600" />
                        ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 bg-gray-50"
                    >
                        <div className="p-4">
                            {/* Two Column Layout */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Requester Information */}
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Requester Information
                                    </h4>
                                    <div className="space-y-2">
                                        <InfoRow 
                                            icon={<User size={14} />}
                                            label="Name"
                                            value={item.student?.name || 'N/A'}
                                        />
                                        <InfoRow 
                                            icon={<Mail size={14} />}
                                            label="Email"
                                            value={item.student?.email || 'N/A'}
                                        />
                                        <InfoRow 
                                            icon={<Phone size={14} />}
                                            label="Phone"
                                            value={item.student?.phone || 'N/A'}
                                        />
                                        <InfoRow 
                                            icon={<Briefcase size={14} />}
                                            label="Department"
                                            value={item.department?.name || 'N/A'}
                                        />
                                    </div>
                                </div>

                                {/* Complaint Details */}
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Complaint Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Category</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.category?.name || 'General'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Priority</p>
                                            <p className={`text-sm font-medium ${getPriorityTextColor(item.priority)}`}>
                                                {item.priority}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Description</p>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            {item.attachments && item.attachments.length > 0 && (
                                <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Paperclip size={14} />
                                        Attachments ({item.attachments.length})
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {item.attachments.map((attachment, idx) => (
                                            <AttachmentCard 
                                                key={idx}
                                                attachment={attachment}
                                                baseURL="http://localhost:5000"
                                                onClick={() => onImageClick(getImageUrl(attachment))}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Assigned To Information */}
                            {item.assignedTo && (
                                <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Assigned To
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <User size={16} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.assignedTo.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.assignedTo.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                    Message
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Info Row Component
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-2">
        <div className="w-4 text-gray-400 mt-0.5">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm text-gray-900">{value}</p>
        </div>
    </div>
);

// Attachment Card Component
const AttachmentCard = ({ attachment, baseURL, onClick }) => {
    const [imageError, setImageError] = useState(false);
    
    // Get full image URL
    const getFullUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${baseURL}${path}`;
    };

    const fullUrl = getFullUrl(attachment);
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(attachment);
    const fileName = attachment.split('/').pop() || 'file';

    // If it's not an image or image failed to load, show file icon
    if (!isImage || imageError) {
        return (
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-center h-16 mb-2">
                    <FileText size={32} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 truncate text-center">{fileName}</p>
                <button 
                    onClick={onClick}
                    className="mt-2 w-full px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                    View File
                </button>
            </div>
        );
    }

    // Show image
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-100">
                <img 
                    src={fullUrl}
                    alt={fileName}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={onClick}
                    onError={() => setImageError(true)}
                />
            </div>
            <div className="p-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600 truncate">{fileName}</p>
            </div>
        </div>
    );
};

// Image Preview Modal
const ImagePreviewModal = ({ image, onClose }) => {
    const [loadError, setLoadError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {loadError ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                        <p className="text-gray-700">Failed to load image</p>
                        <button 
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <img 
                            src={image}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain"
                            onError={() => setLoadError(true)}
                        />
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <a 
                            href={image}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                            <Download size={20} />
                        </a>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

// Helper Functions
const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'assigned': return 'bg-blue-100 text-blue-700';
        case 'in progress': return 'bg-purple-100 text-purple-700';
        case 'closed': return 'bg-gray-100 text-gray-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'Emergency': return 'bg-red-500';
        case 'High': return 'bg-orange-500';
        case 'Medium': return 'bg-yellow-500';
        case 'Low': return 'bg-blue-500';
        default: return 'bg-gray-400';
    }
};

const getPriorityTextColor = (priority) => {
    switch (priority) {
        case 'Emergency': return 'text-red-600';
        case 'High': return 'text-orange-600';
        case 'Medium': return 'text-yellow-600';
        case 'Low': return 'text-blue-600';
        default: return 'text-gray-600';
    }
};

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-24 bg-white rounded-lg animate-pulse" />
                ))}
            </div>
        </div>
    </div>
);

// Empty State
const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 text-center bg-white rounded-lg border-2 border-dashed border-gray-300"
    >
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <Inbox size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No complaints found</h3>
        <p className="text-sm text-gray-500 mt-1">
            No complaints match your current filter criteria.
        </p>
    </motion.div>
);

export default AssignedComplaint;