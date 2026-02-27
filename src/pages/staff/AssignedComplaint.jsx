import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, User, Briefcase, Search, Inbox,
    ArrowUpRight, MoreHorizontal, Clock, AlertCircle,
    CheckCircle2, Activity, Hash
} from 'lucide-react';

const AssignedComplaint = () => {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState("");
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

    const filtered = complaints.filter(c => {
        const matchesFilter = filter === 'all' || c.status.toLowerCase() === filter.toLowerCase();
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c._id.includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-indigo-100">
            {/* Top Modern Command Bar */}
            <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                            <Activity size={22} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Command Center</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Operator: {registerNo}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Input */}
                        <div className="hidden lg:flex items-center bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 focus-within:ring-2 ring-indigo-500/20 transition-all">
                            <Search size={16} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="bg-transparent border-none text-sm focus:outline-none ml-2 w-48 font-medium"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="hidden md:flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                            {['all', 'pending', 'resolved'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-5 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${filter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Assignment Stream</h2>
                    <p className="text-xs text-slate-500 font-medium">Showing {filtered.length} tasks</p>
                </div>
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((item, idx) => (
                                <TaskRow key={item._id} item={item} index={idx} />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const TaskRow = ({ item, index }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
        >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Title & Badge */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(item.priority)} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                            {item.status}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <Hash size={12} />
                            {item._id.slice(-6).toUpperCase()}
                        </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                    </h3>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Requester</p>
                            <p className="text-sm font-bold text-slate-700">{item.student?.name || 'Academic User'}</p>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Created</p>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                            <Calendar size={14} className="text-slate-400" />
                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all active:scale-95">
                            View
                            <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Metric = ({ label, value, trend, icon, color = "text-slate-900" }) => (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                {icon}
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {trend}
            </span>
        </div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <h4 className={`text-2xl font-black tracking-tight ${color}`}>{value}</h4>
    </div>
);

const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
        default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
};

const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-rose-500 shadow-rose-200';
    if (priority === 'Medium') return 'bg-amber-500 shadow-amber-200';
    return 'bg-slate-300 shadow-slate-100';
};

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 flex-1 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
        {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
    </div>
);

const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[2rem]"
    >
        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
            <Inbox size={40} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">All caught up</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">No complaints matching your current filter. Enjoy the quiet!</p>
    </motion.div>
);

export default AssignedComplaint;