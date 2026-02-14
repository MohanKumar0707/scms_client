import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit3, X, User, MessageSquare, Loader2 } from "lucide-react";

const API_URL = 'http://localhost:5000/api/complaints';

const ComplaintPage = () => {
    // --- State Management ---
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    const initialFormState = { user: '', issue: '', priority: 'Medium', status: 'Open' };
    const [formData, setFormData] = useState(initialFormState);

    // --- API Interactions ---
    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            // Ensure we handle data whether it's an array or wrapped in an object
            setComplaints(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Database connection failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            setIsModalOpen(false);
            fetchComplaints();
        } catch (err) {
            alert("Error saving to database");
        }
    };

    const handleFinalDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${deleteId}`);
            setDeleteId(null);
            fetchComplaints();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    // --- Helper Functions ---
    const handleOpenModal = (complaint = null) => {
        if (complaint) {
            setEditingId(complaint._id); // MongoDB uses _id
            setFormData({ 
                user: complaint.user, 
                issue: complaint.issue, 
                priority: complaint.priority,
                status: complaint.status 
            });
        } else {
            setEditingId(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const getStatusStyle = (status) => {
        const styles = {
            'Open': 'bg-rose-100 text-rose-700 border-rose-200',
            'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
            'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
        return styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Complaint Manager</h1>
                        <p className="text-xs text-slate-500 font-medium">Database: Connected to MongoDB</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
                    >
                        <Plus size={18} /> New Complaint
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                {/* Search & Filter */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Requester</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Issue</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-20">
                                        <div className="flex flex-col items-center text-slate-400">
                                            <Loader2 className="animate-spin mb-2" />
                                            <p>Syncing with database...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : complaints.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-slate-400">No records found.</td>
                                </tr>
                            ) : complaints
                                .filter(c => c.user.toLowerCase().includes(searchTerm.toLowerCase()) || c.issue.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{item.user}</td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{item.issue}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${item.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenModal(item)} className="p-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => setDeleteId(item._id)} className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Form Modal (Logic for Add/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md m-4 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingId ? "Update Record" : "New Record"}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">USER</label>
                                <input required className="w-full px-4 py-2 border rounded-lg outline-none focus:border-indigo-500" 
                                    value={formData.user} onChange={(e) => setFormData({...formData, user: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">ISSUE DESCRIPTION</label>
                                <textarea required rows="3" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-indigo-500" 
                                    value={formData.issue} onChange={(e) => setFormData({...formData, issue: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">PRIORITY</label>
                                    <select className="w-full px-3 py-2 border rounded-lg bg-white" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">STATUS</label>
                                    <select className="w-full px-3 py-2 border rounded-lg bg-white" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                        <option>Open</option>
                                        <option>In Progress</option>
                                        <option>Resolved</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                                {editingId ? "Save Changes" : "Submit Complaint"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Simple Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs w-full text-center">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Delete Record?</h3>
                        <p className="text-slate-500 text-sm mb-6">This action cannot be undone in the database.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border rounded-lg text-sm font-semibold">Cancel</button>
                            <button onClick={handleFinalDelete} className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintPage;