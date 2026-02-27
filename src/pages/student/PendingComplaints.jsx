import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle, Calendar, Building2, Tag, ChevronRight,
    Clock, CheckCircle, Loader2, FileText, ArrowRight,
    Search, LayoutGrid, List as ListIcon
} from 'lucide-react';

const listVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }
    })
};

function MyComplaints() {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
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
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Pending Complaints</h1>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Manage Service Requests</p>
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
        </div>
    );
}


const SummaryCard = ({ label, count, sub, icon: Icon, accent }) => {
    const styles = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        slate: 'text-slate-600 bg-slate-50 border-slate-100'
    };
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl border ${styles[accent]}`}>
                    <Icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{sub}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{count}</p>
            <p className="text-sm font-semibold text-slate-500 mt-1">{label}</p>
        </div>
    );
};

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'Resolved': return <CheckCircle className="text-emerald-500" size={24} />;
        case 'In Progress': return <Loader2 className="text-blue-500 animate-spin-slow" size={24} />;
        default: return <Clock className="text-amber-500" size={24} />;
    }
};

const getStatusColor = (status) => {
    if (status === 'Resolved') return 'text-emerald-600';
    if (status === 'In Progress') return 'text-blue-600';
    return 'text-amber-600';
};

const getStatusBg = (status) => {
    if (status === 'Resolved') return 'bg-emerald-500';
    if (status === 'In Progress') return 'bg-blue-500';
    return 'bg-amber-500';
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

export default MyComplaints;