import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit3, X, Briefcase, Hash, AlignLeft } from "lucide-react";

const API_URL = 'http://localhost:5000/api/departments';

const Department = () => {

    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const initialFormState = { name: '', code: '', description: '' };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${API_URL}/fetchDepartments`);
            setDepartments(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditingId(dept._id);
            setFormData({ name: dept.name, code: dept.code, description: dept.description });
        } else {
            setEditingId(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/updateDepartments/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/createDepartments`, formData);
            }
            setIsModalOpen(false);
            fetchDepartments();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const handleFinalDelete = async () => {
        try {
            await axios.delete(`${API_URL}/deleteDepartments/${deleteId}`);
            setDeleteId(null);
            fetchDepartments();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Department Directory</h1>
                        <p className="text-xs text-slate-500 font-medium">Manage Academic Units & Codes</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all"
                    >
                        <Plus size={18} strokeWidth={2.5} /> Add Department
                    </button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6">
                {/* Search Bar */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center table-auto">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Code</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Department Name</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-400 text-sm">Loading records...</td></tr>
                                ) : departments
                                    .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((dept) => (
                                        <tr key={dept._id} className="hover:bg-slate-50/80 transition-all">
                                            <td className="px-6 py-5">
                                                <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 uppercase">
                                                    {dept.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-slate-900 text-sm">{dept.name}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-xs text-slate-500 truncate font-medium">
                                                    {dept.description || "No description provided."}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleOpenModal(dept)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-100 transition-all">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => setDeleteId(dept._id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Entry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200">
                        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Department" : "Add New Department"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department Code</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            placeholder="e.g. CS101"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Computer Science"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3 top-3 text-slate-400" size={14} />
                                        <textarea
                                            rows="3"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Brief overview..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md">
                                    {editingId ? "Update Department" : "Save Department"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-4 mb-4 text-rose-600">
                            <div className="p-3 bg-rose-50 rounded-full">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-8">
                            Are you sure you want to delete this department? This action cannot be undone and may affect associated records.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all">
                                No, Cancel
                            </button>
                            <button onClick={handleFinalDelete} className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all shadow-sm">
                                Yes, Delete Dept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Department;