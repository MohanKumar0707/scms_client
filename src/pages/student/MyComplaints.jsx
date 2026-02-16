import React, { useEffect, useState } from 'react';
import { 
    Clock, CheckCircle, AlertCircle, RefreshCcw, 
    Search, Filter, ArrowUpRight, Inbox, Tag, Calendar
} from 'lucide-react';

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const registerNo = sessionStorage.getItem("registerNo");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/mycomplaints/my-complaints/${registerNo}`);
                const data = await res.json();
                if (res.ok) {
                    setComplaints(data);
                }
            } catch (err) {
                console.error("Error fetching complaints:", err);
            } finally {
                setLoading(false);
            }
        };

        if (registerNo) fetchComplaints();
    }, [registerNo]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Resolved': 
                return { 
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
                    icon: <CheckCircle className="w-4 h-4" /> 
                };
            case 'Pending': 
                return { 
                    bg: 'bg-amber-50 text-amber-700 border-amber-200', 
                    icon: <Clock className="w-4 h-4" /> 
                };
            case 'In Progress': 
                return { 
                    bg: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse', 
                    icon: <RefreshCcw className="w-4 h-4" /> 
                };
            case 'Rejected': 
                return { 
                    bg: 'bg-rose-50 text-rose-700 border-rose-200', 
                    icon: <AlertCircle className="w-4 h-4" /> 
                };
            default: 
                return { 
                    bg: 'bg-slate-50 text-slate-700 border-slate-200', 
                    icon: <Inbox className="w-4 h-4" /> 
                };
        }
    };

    // Calculate quick stats
    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Syncing your requests...</p>
        </div>
    );

    return (
        <div className="p-6 md:p-12 bg-[#f8fafc8a] min-h-screen font-sans rounded-2xl">
            <div className="mx-auto">
                {/* Header & Stats Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support History</h1>
                        <p className="text-slate-500 mt-2 text-lg">Manage and track your submitted tickets.</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Active</p>
                            <p className="text-2xl font-black text-blue-600">{stats.pending}</p>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Resolved</p>
                            <p className="text-2xl font-black text-emerald-600">{stats.resolved}</p>
                        </div>
                    </div>
                </div>

                {complaints.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center shadow-inner">
                        <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                            <Inbox className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Your inbox is empty</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">When you submit a complaint, it will appear here for you to track.</p>
                        <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            Submit First Complaint
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {complaints.map((item) => {
                            const status = getStatusStyles(item.status);
                            return (
                                <div key={item._id} className="group bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            {/* Status and Date Header */}
                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${status.bg}`}>
                                                    {status.icon}
                                                    {item.status}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 leading-relaxed text-sm md:text-base max-w-3xl">
                                                {item.description}
                                            </p>
                                        </div>
                                        
                                        {/* Meta Info Sidebar */}
                                        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 shrink-0">
                                            <div className="text-right">
                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</span>
                                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-xl">
                                                    <Tag className="w-3.5 h-3.5" />
                                                    {item.category?.name || "Uncategorized"}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Department</span>
                                                <span className="text-slate-700 font-bold text-sm">
                                                    {item.department?.name || "General Support"}
                                                </span>
                                            </div>
                                            <button className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Subtle hover accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <footer className="mt-20 text-center">
                <p className="text-slate-400 text-sm font-medium">
                    Showing {complaints.length} recent support requests
                </p>
            </footer>
        </div>
    );
}

export default MyComplaints;