import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AlertCircle, Calendar, Building2, Tag, ChevronRight, 
    User, CheckCircle2, Clock, Briefcase 
} from 'lucide-react';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.2 
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 260, damping: 20 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

function AssignedComplaint() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const registerNo = sessionStorage.getItem("registerNo");

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

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased selection:bg-indigo-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Header Section - MyComplaints Style */}
                <header className="mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '2.5rem' }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="h-1 bg-indigo-600 mb-4 rounded-full"
                        />
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Assigned Tasks</h1>
                        <p className="text-slate-500 mt-2 font-medium">Manage and resolve service requests assigned to you</p>
                    </motion.div>
                </header>

                {/* Main Grid Area */}
                <AnimatePresence mode="wait">
                    {complaints.length === 0 ? (
                        <EmptyState key="empty" />
                    ) : (
                        <motion.div 
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {complaints.map((item) => (
                                <motion.div 
                                    key={item._id}
                                    layout
                                    variants={itemVariants}
                                    whileHover={{ 
                                        y: -8, 
                                        shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" 
                                    }}
                                    className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all duration-300 shadow-sm"
                                >
                                    {/* Status Indicator */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-current flex items-center gap-1.5 ${getStatusColor(item.status)}`}>
                                            <motion.span 
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="h-1.5 w-1.5 rounded-full bg-current" 
                                            />
                                            {item.status}
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-300">#{item._id.slice(-6)}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 mb-6">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Student Info & Meta - Staff Specific */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-indigo-600">
                                                {item.student?.name?.charAt(0) || 'S'}
                                            </div>
                                            {item.student?.name} <span className="text-slate-400 font-normal">({item.student?.registerNo})</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <TagBadge icon={<Building2 className="w-3 h-3" />} label={item.department?.name || 'General'} />
                                            <TagBadge icon={<Tag className="w-3 h-3" />} label={item.priority || 'Medium'} />
                                        </div>
                                    </div>

                                    {/* Bottom Row */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-400 font-semibold text-[11px]">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                        <motion.button 
                                            whileHover={{ x: 3 }}
                                            className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-0.5"
                                        >
                                            Take Action 
                                            <ChevronRight className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* --- Helpers --- */

const TagBadge = ({ icon, label }) => (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100">
        {icon}
        {label}
    </div>
);

const getStatusColor = (status) => {
    switch (status) {
        case 'Resolved': return 'text-emerald-600 bg-emerald-50/50 border-emerald-100';
        case 'Pending': return 'text-amber-600 bg-amber-50/50 border-amber-100';
        case 'In Progress': return 'text-indigo-600 bg-indigo-50/50 border-indigo-100';
        default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
};

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-72 bg-white border border-slate-100 rounded-2xl animate-pulse" />
            ))}
        </div>
    </div>
);

const EmptyState = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem]"
    >
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
            <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">All caught up!</h2>
        <p className="text-slate-400 text-sm mt-1">No new tasks have been assigned to you yet.</p>
    </motion.div>
);

export default AssignedComplaint;