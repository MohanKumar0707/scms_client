import React, { useEffect, useState } from "react";
import {
    Search, Inbox, Filter, Clock, CheckCircle, AlertCircle,
    Eye, Download, Calendar, User, Tag, FileText, Paperclip,
    ChevronDown, ChevronUp, MoreVertical, MessageCircle,
    Shield, AlertTriangle, Circle, X, RotateCw, CheckCircle2,
    UserCircle, Building2, Clock3, Flag, ArrowUpDown,
    SlidersHorizontal, Grid3x3, List, RefreshCw, Star,
    AlertOctagon, Loader2, XCircle, Image as ImageIcon,
    ExternalLink, Maximize2, Mail, Phone
} from "lucide-react";

const MyComplaints = () => {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [complaintDetails, setComplaintDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [viewMode, setViewMode] = useState('list');
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        inProgress: 0,
        avgResolutionTime: 0,
        highPriority: 0
    });

    const API_BASE_URL = "http://localhost:5000";
    const registerNo = sessionStorage.getItem("registerNo");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/api/mycomplaints/my-complaints/${registerNo}`);
                const data = await res.json();

                if (res.ok) {
                    const formattedComplaints = data.map(item => ({
                        id: item._id,
                        title: item.title,
                        category: item.category?.name || "General",
                        status: item.status,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        fullDate: new Date(item.createdAt),
                        priority: item.priority,
                        studentName: item.student?.name || "Unknown",
                        department: item.department?.name || "Not Assigned",
                        hasAttachments: item.attachments?.length > 0,
                        description: item.description,
                        attachments: item.attachments || [],
                        updatedAt: item.updatedAt,
                        resolvedAt: item.resolvedAt
                    }));
                    setComplaints(formattedComplaints);
                    calculateStats(formattedComplaints);
                }
            } catch (err) {
                console.error("Error fetching complaints", err);
            } finally {
                setLoading(false);
            }
        };

        if (registerNo) {
            fetchComplaints();
        }
    }, [registerNo]);

    const calculateStats = (data) => {
        const total = data.length;
        const resolved = data.filter(c => c.status === 'Resolved').length;
        const pending = data.filter(c => c.status === 'Pending').length;
        const inProgress = data.filter(c => c.status === 'In Progress').length;
        const highPriority = data.filter(c => c.priority === 'High' || c.priority === 'Emergency').length;

        // Calculate average resolution time (in hours)
        const resolvedComplaints = data.filter(c => c.status === 'Resolved' && c.resolvedAt);
        let avgTime = 0;
        if (resolvedComplaints.length > 0) {
            const totalTime = resolvedComplaints.reduce((acc, c) => {
                const created = new Date(c.fullDate);
                const resolved = new Date(c.resolvedAt);
                return acc + (resolved - created);
            }, 0);
            avgTime = Math.round((totalTime / resolvedComplaints.length) / (1000 * 60 * 60 * 24) * 10) / 10;
        }

        setStats({ total, resolved, pending, inProgress, avgResolutionTime: avgTime, highPriority });
    };

    const fetchComplaintDetails = async (id) => {
        if (complaintDetails[id]) return;

        setLoadingDetails(prev => ({ ...prev, [id]: true }));
        try {
            const res = await fetch(`${API_BASE_URL}/api/grievanceInbox/${id}`);
            const data = await res.json();
            setComplaintDetails(prev => ({ ...prev, [id]: data }));
        } catch (err) {
            console.error("Error fetching complaint details", err);
        } finally {
            setLoadingDetails(prev => ({ ...prev, [id]: false }));
        }
    };

    const toggleExpand = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            fetchComplaintDetails(id);
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
                label: "Resolved",
                dot: "bg-emerald-500"
            },
            "Pending": {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                lightBg: "bg-amber-500/10",
                icon: AlertCircle,
                label: "Pending",
                dot: "bg-amber-500"
            },
            "In Progress": {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                lightBg: "bg-blue-500/10",
                icon: RotateCw,
                label: "In Progress",
                dot: "bg-blue-500"
            },
            "Assigned": {
                bg: "bg-purple-50",
                text: "text-purple-700",
                border: "border-purple-200",
                lightBg: "bg-purple-500/10",
                icon: User,
                label: "Assigned",
                dot: "bg-purple-500"
            },
            "Closed": {
                bg: "bg-gray-50",
                text: "text-gray-700",
                border: "border-gray-200",
                lightBg: "bg-gray-500/10",
                icon: CheckCircle2,
                label: "Closed",
                dot: "bg-gray-500"
            },
            "Rejected": {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                lightBg: "bg-red-500/10",
                icon: XCircle,
                label: "Rejected",
                dot: "bg-red-500"
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
                icon: AlertOctagon,
                label: "Emergency",
                dot: "bg-red-500"
            },
            "High": {
                bg: "bg-orange-50",
                text: "text-orange-700",
                border: "border-orange-200",
                lightBg: "bg-orange-500/10",
                icon: AlertTriangle,
                label: "High",
                dot: "bg-orange-500"
            },
            "Medium": {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                lightBg: "bg-blue-500/10",
                icon: Flag,
                label: "Medium",
                dot: "bg-blue-500"
            },
            "Low": {
                bg: "bg-green-50",
                text: "text-green-700",
                border: "border-green-200",
                lightBg: "bg-green-500/10",
                icon: Flag,
                label: "Low",
                dot: "bg-green-500"
            }
        };
        return configs[priority] || configs["Medium"];
    };

    const filteredAndSortedComplaints = complaints
        .filter(g => {
            const matchesStatus = filterStatus === 'all' ? true :
                g.status.toLowerCase() === filterStatus.toLowerCase();
            const matchesPriority = filterPriority === 'all' ? true :
                g.priority.toLowerCase() === filterPriority.toLowerCase();
            const matchesSearch = searchTerm === '' ? true :
                g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.department.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesStatus && matchesPriority && matchesSearch;
        })
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

    // Stats Cards Component
    const StatsCard = ({ label, value, icon: Icon, color, subtext }) => {
        const colors = {
            indigo: 'from-indigo-500 to-indigo-600',
            emerald: 'from-emerald-500 to-emerald-600',
            amber: 'from-amber-500 to-amber-600',
            purple: 'from-purple-500 to-purple-600',
            blue: 'from-blue-500 to-blue-600',
            red: 'from-red-500 to-red-600'
        };

        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colors[color]} shadow-lg`}>
                        <Icon size={18} className="text-white" />
                    </div>
                    {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
                </div>
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
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
                                    My Complaints
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Track and manage your submitted complaints
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative hidden lg:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by title, ID, department..."
                                    className="w-80 xl:w-96 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Mobile Search Icon */}
                            <button className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-lg">
                                <Search size={18} className="text-slate-600" />
                            </button>

                            {/* View Toggle */}
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 transition-colors ${viewMode === 'list'
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 transition-colors border-l border-slate-200 ${viewMode === 'grid'
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <Grid3x3 size={18} />
                                </button>
                            </div>

                            {/* Filter Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-sm ${showFilters
                                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                <SlidersHorizontal size={16} />
                                Filters
                                {(filterStatus !== 'all' || filterPriority !== 'all') && (
                                    <span className="w-5 h-5 bg-indigo-500 text-white rounded-full text-xs flex items-center justify-center">
                                        {(filterStatus !== 'all' ? 1 : 0) + (filterPriority !== 'all' ? 1 : 0)}
                                    </span>
                                )}
                            </button>

                            {/* Refresh Button */}
                            <button
                                onClick={() => window.location.reload()}
                                className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="pb-4 border-t border-slate-200">
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                        Status
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['all', 'pending', 'in progress', 'resolved', 'rejected'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${filterStatus === status
                                                    ? status === 'all'
                                                        ? 'bg-slate-900 text-white'
                                                        : status === 'resolved'
                                                            ? 'bg-emerald-500 text-white'
                                                            : status === 'in progress'
                                                                ? 'bg-blue-500 text-white'
                                                                : status === 'pending'
                                                                    ? 'bg-amber-500 text-white'
                                                                    : 'bg-red-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {status}
                                                <span className="ml-1.5 opacity-75">
                                                    ({complaints.filter(c => c.status.toLowerCase() === status).length})
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                        Priority
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['all', 'low', 'medium', 'high', 'emergency'].map((priority) => (
                                            <button
                                                key={priority}
                                                onClick={() => setFilterPriority(priority)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${filterPriority === priority
                                                    ? priority === 'all'
                                                        ? 'bg-slate-900 text-white'
                                                        : priority === 'emergency'
                                                            ? 'bg-red-500 text-white'
                                                            : priority === 'high'
                                                                ? 'bg-orange-500 text-white'
                                                                : priority === 'medium'
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-green-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {priority}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Results Summary */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-700">{filteredAndSortedComplaints.length}</span> complaints
                        {searchTerm && <span> for "<span className="text-indigo-600">{searchTerm}</span>"</span>}
                    </p>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                        <span className="text-slate-500 whitespace-nowrap">Sort by :</span>
                        <button
                            onClick={() => handleSort('date')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${sortField === 'date' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Date <SortIcon field="date" />
                        </button>
                        <button
                            onClick={() => handleSort('priority')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${sortField === 'priority' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Priority <SortIcon field="priority" />
                        </button>
                        <button
                            onClick={() => handleSort('status')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${sortField === 'status' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Status <SortIcon field="status" />
                        </button>
                        <button
                            onClick={() => handleSort('title')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${sortField === 'title' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Title <SortIcon field="title" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-full mb-4">
                            <RefreshCw size={24} className="text-indigo-500 animate-spin" />
                        </div>
                        <p className="text-slate-600 font-medium">Loading your complaints...</p>
                        <p className="text-sm text-slate-400 mt-1">Please wait while we fetch your data</p>
                    </div>
                ) : filteredAndSortedComplaints.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <Inbox className="text-slate-400" size={28} />
                        </div>
                        <p className="text-slate-600 font-medium text-lg">No complaints found</p>
                        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                                ? "No complaints match your current filters. Try adjusting your search criteria."
                                : "You haven't submitted any complaints yet."}
                        </p>
                        {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('all');
                                    setFilterPriority('all');
                                }}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2 transition-colors"
                            >
                                <X size={16} />
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        {/* Desktop Table */}
                        <div className="hidden lg:block">
                            <table className="w-full">
                                {/* Table Header */}
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-center">
                                            <span className="text-xs font-medium tracking-wider text-slate-500">Complaint Details</span>
                                        </th>
                                        <th className="px-6 py-3 text-center">
                                            <span className="text-xs font-medium tracking-wider text-slate-500">Category</span>
                                        </th>
                                        <th className="px-6 py-3 text-center">
                                            <span className="text-xs font-medium tracking-wider text-slate-500">Department</span>
                                        </th>
                                        <th className="px-6 py-3 text-center">
                                            <span className="text-xs font-medium tracking-wider text-slate-500">Priority</span>
                                        </th>
                                        <th className="px-6 py-3 text-center">
                                            <span className="text-xs font-medium tracking-wider text-slate-500">Status</span>
                                        </th>
                                        <th className="px-6 py-3 w-10"></th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="divide-y divide-slate-100">
                                    {filteredAndSortedComplaints.map((item) => {
                                        const StatusIcon = getStatusConfig(item.status).icon;
                                        const PriorityIcon = getPriorityConfig(item.priority).icon;
                                        const isExpanded = expandedId === item.id;
                                        const details = complaintDetails[item.id];
                                        const loadingDetail = loadingDetails[item.id];
                                        const priorityConfig = getPriorityConfig(item.priority);
                                        const statusConfig = getStatusConfig(item.status);

                                        return (
                                            <React.Fragment key={item.id}>
                                                {/* Main Complaint Row */}
                                                <tr
                                                    className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${isExpanded ? 'bg-indigo-50/30' : ''}`}
                                                    onClick={() => toggleExpand(item.id)}
                                                >
                                                    {/* Complaint Details Column */}
                                                    <td className="px-10 py-4">
                                                        <div className="flex gap-3">
                                                            <div className={`w-2 h-2 rounded-full my-auto ${priorityConfig.dot} flex-shrink-0`}></div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="font-medium text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                                                                    {item.title}
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                                                                        {item.id.slice(-8)}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 flex-shrink-0">
                                                                        <Clock3 size={12} />
                                                                        {item.date}
                                                                    </span>
                                                                    {item.hasAttachments && (
                                                                        <span className="flex items-center gap-1 flex-shrink-0">
                                                                            <Paperclip size={12} />
                                                                            {item.attachments?.length || 1}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Category Column */}
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium truncate max-w-[150px]">
                                                            {item.category}
                                                        </span>
                                                    </td>

                                                    {/* Department Column */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0 justify-center">
                                                            <Building2 size={14} className="text-slate-400 flex-shrink-0" />
                                                            <span className="truncate">{item.department}</span>
                                                        </div>
                                                    </td>

                                                    {/* Priority Column */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text} truncate max-w-full`}>
                                                                <PriorityIcon size={10} className="flex-shrink-0" />
                                                                <span className="truncate">{item.priority}</span>
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Status Column */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                                                <StatusIcon size={10} className="flex-shrink-0" />
                                                                <span className="truncate">{item.status}</span>
                                                            </span>
                                                            <button className="opacity-100 ml-4 group-hover:opacity-100 transition-opacity">
                                                                {isExpanded ? (
                                                                    <ChevronUp size={18} className="text-indigo-500" />
                                                                ) : (
                                                                    <ChevronDown size={18} className="text-slate-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded Details Row */}
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan="6" className="p-0">
                                                            <div className="bg-slate-50/70 border-y border-indigo-100">
                                                                {loadingDetail ? (
                                                                    <div className="py-8 text-center">
                                                                        <RefreshCw size={20} className="text-indigo-500 animate-spin mx-auto mb-2" />
                                                                        <p className="text-sm text-slate-500">Loading details...</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-4 sm:p-6">
                                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                            {/* Left - Description & Attachments */}
                                                                            <div className="lg:col-span-2 space-y-5">
                                                                                <div>
                                                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                                        <span className="w-1 h-4 bg-indigo-400 rounded-full"></span>
                                                                                        Description
                                                                                    </h4>
                                                                                    <div className="bg-white rounded-lg border border-slate-200 p-4 text-sm text-slate-600 leading-relaxed max-h-60 overflow-y-auto">
                                                                                        {item.description}
                                                                                    </div>
                                                                                </div>

                                                                                {item.attachments?.length > 0 && (
                                                                                    <div>
                                                                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                                            <span className="w-1 h-4 bg-indigo-400 rounded-full"></span>
                                                                                            Attachments ({item.attachments.length})
                                                                                        </h4>
                                                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                                                            {item.attachments.map((attachment, index) => {
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
                                                                                                                        setSelectedImage(fullImageUrl);
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

                                                                            {/* Right - Metadata */}
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
                                                                                            <div className="min-w-0">
                                                                                                <p className="text-xs text-slate-500">Created</p>
                                                                                                <p className="text-sm font-medium text-slate-700">
                                                                                                    {new Date(item.fullDate).toLocaleDateString('en-US', {
                                                                                                        month: 'short', day: 'numeric', year: 'numeric',
                                                                                                        hour: '2-digit', minute: '2-digit'
                                                                                                    })}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        {item.updatedAt && (
                                                                                            <div className="flex items-start gap-2">
                                                                                                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                                                    <Clock3 size={10} className="text-amber-600" />
                                                                                                </div>
                                                                                                <div className="min-w-0">
                                                                                                    <p className="text-xs text-slate-500">Last Updated</p>
                                                                                                    <p className="text-sm font-medium text-slate-700">
                                                                                                        {new Date(item.updatedAt).toLocaleDateString('en-US', {
                                                                                                            month: 'short', day: 'numeric', year: 'numeric',
                                                                                                            hour: '2-digit', minute: '2-digit'
                                                                                                        })}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.resolvedAt && (
                                                                                            <div className="flex items-start gap-2">
                                                                                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                                                    <CheckCircle size={10} className="text-emerald-600" />
                                                                                                </div>
                                                                                                <div className="min-w-0">
                                                                                                    <p className="text-xs text-slate-500">Resolved</p>
                                                                                                    <p className="text-sm font-medium text-slate-700">
                                                                                                        {new Date(item.resolvedAt).toLocaleDateString('en-US', {
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
                                                                                    <div className="space-y-2">
                                                                                        <div>
                                                                                            <p className="text-xs text-slate-500">Department</p>
                                                                                            <p className="text-sm font-medium text-slate-700">
                                                                                                {item.department}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs text-slate-500">Category</p>
                                                                                            <p className="text-sm font-medium text-slate-700">
                                                                                                {item.category}
                                                                                            </p>
                                                                                        </div>
                                                                                        {details?.assignedTo && (
                                                                                            <div>
                                                                                                <p className="text-xs text-slate-500">Assigned To</p>
                                                                                                <p className="text-sm font-medium text-slate-700">
                                                                                                    {details.assignedTo.name}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                {details?.student && (
                                                                                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                                            <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
                                                                                            Your Info
                                                                                        </h4>
                                                                                        <div className="space-y-2">
                                                                                            {details.student.email && (
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <Mail size={14} className="text-slate-400 flex-shrink-0" />
                                                                                                    <div className="min-w-0">
                                                                                                        <p className="text-xs text-slate-500">Email</p>
                                                                                                        <p className="text-sm font-medium text-slate-700 truncate">
                                                                                                            {details.student.email}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            {details.student.phone && (
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                                                                                                    <div className="min-w-0">
                                                                                                        <p className="text-xs text-slate-500">Phone</p>
                                                                                                        <p className="text-sm font-medium text-slate-700">
                                                                                                            {details.student.phone}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredAndSortedComplaints.map((item) => {
                            const StatusIcon = getStatusConfig(item.status).icon;
                            const PriorityIcon = getPriorityConfig(item.priority).icon;
                            const priorityConfig = getPriorityConfig(item.priority);
                            const statusConfig = getStatusConfig(item.status);
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-2 h-2 rounded-full ${priorityConfig.dot} mt-1.5`}></div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                            <StatusIcon size={10} />
                                            {item.status}
                                        </span>
                                    </div>

                                    <h3 className="font-medium text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-slate-500 mb-4 line-clamp-3">
                                        {item.description}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                                        <span className="text-xs font-mono text-slate-400">
                                            #{item.id.slice(-8)}
                                        </span>
                                        <span className="text-xs text-slate-400 flex-shrink-0">{item.date}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text} truncate max-w-[120px]`}>
                                            <PriorityIcon size={8} className="flex-shrink-0" />
                                            <span className="truncate">{item.priority}</span>
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium truncate max-w-[150px]">
                                            {item.category}
                                        </span>
                                        {item.department !== "Not Assigned" && (
                                            <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium truncate max-w-[150px]">
                                                <Building2 size={8} className="mr-1 flex-shrink-0" />
                                                <span className="truncate">{item.department}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-6xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x600?text=Error+Loading+Image';
                            }}
                        />

                        <div className="absolute top-4 right-4 flex gap-2">
                            <a
                                href={selectedImage}
                                download
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors"
                                title="Download"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download size={20} />
                            </a>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors"
                                title="Close (Esc)"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            Click outside or press ESC to close
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyComplaints;