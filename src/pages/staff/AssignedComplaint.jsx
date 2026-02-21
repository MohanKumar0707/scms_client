import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  User, 
  Calendar, 
  ChevronRight, 
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const AssignedComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const registerNo = sessionStorage.getItem("registerNo");

  useEffect(() => {
    // Mocking the fetch for design purposes
    if (!registerNo) return;
    const fetchAssignedComplaints = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/staff/assigned/${registerNo}`);
        const data = await res.json();
        setComplaints(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchAssignedComplaints();
  }, [registerNo]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* --- Top Navigation / Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">
              Staff Portal
            </h1>
            <h2 className="text-4xl font-semibold tracking-tight">
              Assigned <span className="text-slate-400">Tasks</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
              {registerNo?.charAt(0) || "S"}
            </div>
            <div className="pr-4">
              <p className="text-xs text-slate-400 font-medium leading-none">Logged in as</p>
              <p className="text-sm font-bold text-slate-700">{registerNo}</p>
            </div>
          </motion.div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-40 w-full bg-slate-100 animate-pulse rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode='popLayout'>
              {complaints.map((c, index) => (
                <motion.div
                  layout
                  key={c._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white border border-slate-200/60 rounded-[2rem] p-2 pr-6 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    
                    {/* Status Circle Column */}
                    <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-[1.7rem] bg-slate-50 group-hover:bg-indigo-50 transition-colors duration-500">
                      <div className="relative">
                         <CheckCircle2 className={`w-8 h-8 ${c.priority === 'High' ? 'text-rose-500' : 'text-indigo-500'}`} />
                         <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" 
                         />
                      </div>
                      <span className="text-[10px] font-bold uppercase mt-2 text-slate-400 group-hover:text-indigo-600">
                        {c.status}
                      </span>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 py-4 px-2 md:px-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                           <MapPin size={10} /> {c.department?.name || "General"}
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                           {c.priority} Priority
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                        {c.description}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <User size={14} className="text-slate-300" />
                          {c.student?.name} <span className="text-slate-300 font-normal">#{c.student?.registerNo}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <Calendar size={14} className="text-slate-300" />
                          Last Update: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-2">
                      <button className="h-12 px-6 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 active:scale-95 shadow-lg shadow-slate-200">
                        Resolve Task
                      </button>
                      <button className="p-3 rounded-2xl text-slate-400 hover:bg-slate-100 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedComplaint;