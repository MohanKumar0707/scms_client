import React, { useEffect, useState } from "react";
import { 
    Search, Inbox, Filter, Clock, CheckCircle, AlertCircle, 
    Eye, Download, Calendar, User, Tag, FileText, Paperclip,
    ChevronDown, ChevronUp, MoreVertical, MessageCircle, 
    Shield, AlertTriangle, Circle, X, RotateCw, CheckCircle2,
    UserCircle, Building2, Clock3, Flag, ArrowUpDown,
    SlidersHorizontal, Grid3x3, List, RefreshCw
} from "lucide-react";

const GrievanceInbox = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [grievanceDetails, setGrievanceDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');

    const API_BASE_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/grievanceInbox`);
                const data = await res.json();

                setGrievances(
                    data.map(item => ({
                        id: item._id,
                        title: item.title,
                        category: item.category?.name || "General",
                        status: item.status,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        fullDate: new Date(item.createdAt),
                        priority: item.priority,
                        studentName: item.student?.name || "Unknown",
                        studentId: item.student?.registerNo || "N/A",
                        department: item.department?.name || "Not Assigned",
                        hasAttachments: item.attachments?.length > 0,
                        description: item.description
                    }))
                );
            } catch (err) {
                console.error("Error fetching grievances", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchGrievanceDetails = async (id) => {
        if (grievanceDetails[id]) return;
        
        setLoadingDetails(prev => ({ ...prev, [id]: true }));
        try {
            const res = await fetch(`${API_BASE_URL}/api/grievanceInbox/${id}`);
            const data = await res.json();
            setGrievanceDetails(prev => ({ ...prev, [id]: data }));
        } catch (err) {
            console.error("Error fetching grievance details", err);
        } finally {
            setLoadingDetails(prev => ({ ...prev, [id]: false }));
        }
    };

    const toggleExpand = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            fetchGrievanceDetails(id);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getFullImageUrl = (attachmentPath) => {
        if (!attachmentPath) return '';
        if (attachmentPath.startsWith('http')) return attachmentPath;
        return `${API_BASE_URL}${attachmentPath}`;
    };

    const getStatusConfig = (status) => {
        const configs = {
            "Resolved": { 
                bg: "bg-emerald-50", 
                text: "text-emerald-700", 
                border: "border-emerald-200",
                lightBg: "bg-emerald-500/10",
                icon: CheckCircle,
                label: "Resolved"
            },
            "Pending": { 
                bg: "bg-amber-50", 
                text: "text-amber-700", 
                border: "border-amber-200",
                lightBg: "bg-amber-500/10",
                icon: AlertCircle,
                label: "Pending"
            },
            "In Progress": { 
                bg: "bg-blue-50", 
                text: "text-blue-700", 
                border: "border-blue-200",
                lightBg: "bg-blue-500/10",
                icon: RotateCw,
                label: "In Progress"
            },
            "Assigned": { 
                bg: "bg-purple-50", 
                text: "text-purple-700", 
                border: "border-purple-200",
                lightBg: "bg-purple-500/10",
                icon: User,
                label: "Assigned"
            },
            "Closed": { 
                bg: "bg-gray-50", 
                text: "text-gray-700", 
                border: "border-gray-200",
                lightBg: "bg-gray-500/10",
                icon: CheckCircle2,
                label: "Closed"
            },
            "Rejected": { 
                bg: "bg-red-50", 
                text: "text-red-700", 
                border: "border-red-200",
                lightBg: "bg-red-500/10",
                icon: X,
                label: "Rejected"
            }
        };
        return configs[status] || configs["Pending"];
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            "Emergency": { 
                bg: "bg-red-50", 
                text: "text-red-700", 
                border: "border-red-200",
                lightBg: "bg-red-500/10",
                icon: AlertTriangle,
                label: "Emergency",
                dot: "bg-red-500"
            },
            "High": { 
                bg: "bg-orange-50", 
                text: "text-orange-700", 
                border: "border-orange-200",
                lightBg: "bg-orange-500/10",
                icon: Flag,
                label: "High",
                dot: "bg-orange-500"
            },
            "Medium": { 
                bg: "bg-blue-50", 
                text: "text-blue-700", 
                border: "border-blue-200",
                lightBg: "bg-blue-500/10",
                icon: Circle,
                label: "Medium",
                dot: "bg-blue-500"
            },
            "Low": { 
                bg: "bg-green-50", 
                text: "text-green-700", 
                border: "border-green-200",
                lightBg: "bg-green-500/10",
                icon: Circle,
                label: "Low",
                dot: "bg-green-500"
            }
        };
        return configs[priority] || configs["Medium"];
    };

    const filteredAndSortedGrievances = grievances
        .filter(g =>
            g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let comparison = 0;
            if (sortField === 'date') {
                comparison = a.fullDate - b.fullDate;
            } else if (sortField === 'priority') {
                const priorityOrder = { 'Emergency': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortField === 'status') {
                comparison = a.status.localeCompare(b.status);
            } else if (sortField === 'title') {
                comparison = a.title.localeCompare(b.title);
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ArrowUpDown size={14} className="text-slate-400" />;
        return sortDirection === 'asc' ? 
            <ChevronUp size={14} className="text-indigo-600" /> : 
            <ChevronDown size={14} className="text-indigo-600" />;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased">
            {/* Header - Sleek & Professional */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-[1600px] mx-auto px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-200 rounded-lg blur-sm"></div>
                                <div className="relative h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                    <Inbox className="text-white" size={20} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                                    Grievance Management
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Review and track all student grievances
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search Bar - Refined */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by title, student, ID..."
                                    className="w-96 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-indigo-50 text-indigo-600' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 transition-colors border-l border-slate-200 ${
                                        viewMode === 'grid' 
                                            ? 'bg-indigo-50 text-indigo-600' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <Grid3x3 size={18} />
                                </button>
                            </div>

                            {/* Filter Button */}
                            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-sm">
                                <SlidersHorizontal size={16} />
                                Filters
                            </button>

                            {/* Refresh Button */}
                            <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all">
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-8 py-6">
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-700">{filteredAndSortedGrievances.length}</span> grievances
                        {searchTerm && <span> for "<span className="text-indigo-600">{searchTerm}</span>"</span>}
                    </p>
                    
                    {/* Sort Options */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Sort by:</span>
                        <button
                            onClick={() => handleSort('date')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                                sortField === 'date' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Date <SortIcon field="date" />
                        </button>
                        <button
                            onClick={() => handleSort('priority')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                                sortField === 'priority' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Priority <SortIcon field="priority" />
                        </button>
                        <button
                            onClick={() => handleSort('status')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                                sortField === 'status' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Status <SortIcon field="status" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-full mb-4">
                            <RefreshCw size={24} className="text-indigo-500 animate-spin" />
                        </div>
                        <p className="text-slate-600 font-medium">Loading grievances...</p>
                        <p className="text-sm text-slate-400 mt-1">Please wait while we fetch the data</p>
                    </div>
                ) : filteredAndSortedGrievances.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <Inbox className="text-slate-400" size={28} />
                        </div>
                        <p className="text-slate-600 font-medium text-lg">No grievances found</p>
                        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                            {searchTerm 
                                ? `No results match "${searchTerm}". Try different keywords or clear the search.`
                                : "There are no grievances to display at the moment."}
                        </p>
                    </div>
                ) : viewMode === 'list' ? (
                    // List View - Professional & Clean
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        {/* Table Header */}
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
                            <div className="grid grid-cols-12 gap-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                                <div className="col-span-4">Grievance Details</div>
                                <div className="col-span-2">Student</div>
                                <div className="col-span-2">Category</div>
                                <div className="col-span-2">Department</div>
                                <div className="col-span-1">Priority</div>
                                <div className="col-span-1">Status</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-slate-100">
                            {filteredAndSortedGrievances.map((item) => {
                                const StatusIcon = getStatusConfig(item.status).icon;
                                const PriorityIcon = getPriorityConfig(item.priority).icon;
                                const isExpanded = expandedId === item.id;
                                const details = grievanceDetails[item.id];
                                const loadingDetail = loadingDetails[item.id];
                                const priorityConfig = getPriorityConfig(item.priority);

                                return (
                                    <React.Fragment key={item.id}>
                                        {/* Main Row */}
                                        <div 
                                            className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50/80 transition-all cursor-pointer group ${
                                                isExpanded ? 'bg-indigo-50/30' : ''
                                            }`}
                                            onClick={() => toggleExpand(item.id)}
                                        >
                                            <div className="col-span-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-0.5 w-2 h-2 rounded-full ${priorityConfig.dot} flex-shrink-0`}></div>
                                                    <div>
                                                        <div className="font-medium text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                                            {item.title}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                                                {item.id.slice(-8)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock3 size={12} />
                                                                {item.date}
                                                            </span>
                                                            {item.hasAttachments && (
                                                                <span className="flex items-center gap-1">
                                                                    <Paperclip size={12} />
                                                                    {grievanceDetails[item.id]?.attachments?.length || 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <UserCircle size={16} className="text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-700">{item.studentName}</div>
                                                        <div className="text-xs text-slate-500">{item.studentId}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-2">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                                                    {item.category}
                                                </span>
                                            </div>
                                            
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Building2 size={14} className="text-slate-400" />
                                                    {item.department}
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-1">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
                                                    <PriorityIcon size={10} />
                                                    {item.priority}
                                                </span>
                                            </div>
                                            
                                            <div className="col-span-1 flex items-center justify-between">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${getStatusConfig(item.status).bg} ${getStatusConfig(item.status).text}`}>
                                                    <StatusIcon size={10} />
                                                    {item.status}
                                                </span>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {isExpanded ? 
                                                        <ChevronUp size={18} className="text-indigo-500" /> : 
                                                        <ChevronDown size={18} className="text-slate-400" />
                                                    }
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="bg-slate-50/70 border-t border-b border-indigo-100">
                                                {loadingDetail ? (
                                                    <div className="py-8 text-center">
                                                        <RefreshCw size={20} className="text-indigo-500 animate-spin mx-auto mb-2" />
                                                        <p className="text-sm text-slate-500">Loading details...</p>
                                                    </div>
                                                ) : details && (
                                                    <div className="p-6">
                                                        <div className="grid grid-cols-3 gap-6">
                                                            {/* Left - Description & Attachments */}
                                                            <div className="col-span-2 space-y-5">
                                                                <div>
                                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                        <span className="w-1 h-4 bg-indigo-400 rounded-full"></span>
                                                                        Description
                                                                    </h4>
                                                                    <div className="bg-white rounded-lg border border-slate-200 p-4 text-sm text-slate-600 leading-relaxed">
                                                                        {details.description}
                                                                    </div>
                                                                </div>

                                                                {details.attachments?.length > 0 && (
                                                                    <div>
                                                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                            <span className="w-1 h-4 bg-indigo-400 rounded-full"></span>
                                                                            Attachments ({details.attachments.length})
                                                                        </h4>
                                                                        <div className="grid grid-cols-3 gap-3">
                                                                            {details.attachments.map((attachment, index) => {
                                                                                const fullImageUrl = getFullImageUrl(attachment);
                                                                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment);
                                                                                
                                                                                return (
                                                                                    <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
                                                                                        {isImage ? (
                                                                                            <div className="relative aspect-video">
                                                                                                <img 
                                                                                                    src={fullImageUrl} 
                                                                                                    alt={`Attachment ${index + 1}`}
                                                                                                    className="w-full h-full object-cover cursor-pointer"
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        window.open(fullImageUrl, '_blank');
                                                                                                    }}
                                                                                                    onError={(e) => {
                                                                                                        e.target.onerror = null;
                                                                                                        e.target.src = 'https://via.placeholder.com/300x200?text=Error';
                                                                                                    }}
                                                                                                />
                                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                                                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                                                                                        View
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="p-3 flex flex-col items-center gap-2">
                                                                                                <FileText size={24} className="text-slate-400" />
                                                                                                <span className="text-xs text-slate-500 truncate w-full text-center">
                                                                                                    {attachment.split('/').pop()}
                                                                                                </span>
                                                                                                <a 
                                                                                                    href={fullImageUrl} 
                                                                                                    download
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                                >
                                                                                                    Download
                                                                                                </a>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Right - Metadata Cards */}
                                                            <div className="space-y-4">
                                                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                        <span className="w-1 h-4 bg-emerald-400 rounded-full"></span>
                                                                        Timeline
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-start gap-2">
                                                                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                                <Calendar size={10} className="text-indigo-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-xs text-slate-500">Created</p>
                                                                                <p className="text-sm font-medium text-slate-700">
                                                                                    {new Date(details.createdAt).toLocaleDateString('en-US', {
                                                                                        month: 'short', day: 'numeric', year: 'numeric',
                                                                                        hour: '2-digit', minute: '2-digit'
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {details.resolvedAt && (
                                                                            <div className="flex items-start gap-2">
                                                                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                                    <CheckCircle size={10} className="text-emerald-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs text-slate-500">Resolved</p>
                                                                                    <p className="text-sm font-medium text-slate-700">
                                                                                        {new Date(details.resolvedAt).toLocaleDateString('en-US', {
                                                                                            month: 'short', day: 'numeric', year: 'numeric',
                                                                                            hour: '2-digit', minute: '2-digit'
                                                                                        })}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                        <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                                                        Assignment
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <Shield size={14} className="text-slate-400" />
                                                                            <div>
                                                                                <p className="text-xs text-slate-500">Assigned To</p>
                                                                                <p className="text-sm font-medium text-slate-700">
                                                                                    {details.assignedTo?.name || 'Not Assigned'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                        <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
                                                                        Student Info
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        {details.student?.registerNo && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Tag size={14} className="text-slate-400" />
                                                                                <div>
                                                                                    <p className="text-xs text-slate-500">Register No</p>
                                                                                    <p className="text-sm font-medium text-slate-700">
                                                                                        {details.student.registerNo}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {details.student?.email && (
                                                                            <div className="flex items-center gap-2">
                                                                                <MessageCircle size={14} className="text-slate-400" />
                                                                                <div>
                                                                                    <p className="text-xs text-slate-500">Email</p>
                                                                                    <p className="text-sm font-medium text-slate-700 break-all">
                                                                                        {details.student.email}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Grid View - Alternative Layout
                    <div className="grid grid-cols-3 gap-4">
                        {filteredAndSortedGrievances.map((item) => {
                            const StatusIcon = getStatusConfig(item.status).icon;
                            const PriorityIcon = getPriorityConfig(item.priority).icon;
                            const priorityConfig = getPriorityConfig(item.priority);
                            
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-2 h-2 rounded-full ${priorityConfig.dot} mt-1.5`}></div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusConfig(item.status).bg} ${getStatusConfig(item.status).text}`}>
                                            <StatusIcon size={10} />
                                            {item.status}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-medium text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                                        {item.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <UserCircle size={16} className="text-slate-400" />
                                            <span className="text-xs font-medium text-slate-600">{item.studentName}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{item.date}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default GrievanceInbox;