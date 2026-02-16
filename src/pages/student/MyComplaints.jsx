import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const registerNo = sessionStorage.getItem("registerNo");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/student/my-complaints/${registerNo}`);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">Loading your requests...</div>;

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900">My Complaints</h1>
                    <p className="text-slate-500">Track the status of your submitted concerns.</p>
                </div>

                {complaints.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No complaints found</h3>
                        <p className="text-slate-500">You haven't submitted any concerns yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {complaints.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                                        <p className="text-slate-600 text-sm line-clamp-2">{item.description}</p>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2 border-l border-slate-100 pl-4">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Department</span>
                                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                            {item.department?.name || "General"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyComplaints;