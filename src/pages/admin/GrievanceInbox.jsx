import React, { useEffect, useState } from "react";
import { Search, Inbox, Filter, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";

const GrievanceInbox = () => {

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/grievanceInbox");
                const data = await res.json();

                setGrievances(
                    data.map(item => ({
                        id: item._id,
                        title: item.title,
                        category: item.category?.name || "General",
                        status: item.status,
                        date: new Date(item.createdAt).toISOString().split("T")[0],
                        priority: item.priority
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
    const getStatusStyle = (status) => {
        switch (status) {
            case "Resolved":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Pending":
                return "bg-amber-50 text-amber-700 border-amber-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Inbox className="text-indigo-600" size={20} />
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                                Grievance Inbox
                            </h1>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            Review and manage employee concerns
                        </p>
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-md font-bold text-sm transition-all">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6">
                {/* Search */}
                <div className="mb-6 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by ID, title or category..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full table-auto">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">
                                    Grievance ID
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">
                                    Title & Category
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">
                                    Submission Date
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest text-center">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-center">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-slate-400 text-sm">
                                        Loading grievances...
                                    </td>
                                </tr>
                            ) : grievances.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-slate-400 text-sm">
                                        No grievances found.
                                    </td>
                                </tr>
                            ) : (
                                grievances
                                    .filter(
                                        g =>
                                            g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            g.id.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
                                            <td className="px-6 py-5">
                                                <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                    {item.id}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="font-bold text-sm">{item.title}</div>
                                                <div className="text-[11px] text-indigo-500 font-bold uppercase">
                                                    {item.category}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-xs text-slate-500 flex justify-center items-center gap-1.5">
                                                <Clock size={12} /> {item.date}
                                            </td>

                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(item.status)}`}>
                                                    {item.status === "Pending" && <AlertCircle size={10} className="mr-1" />}
                                                    {item.status === "Resolved" && <CheckCircle size={10} className="mr-1" />}
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={() => console.log("View", item.id)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default GrievanceInbox;