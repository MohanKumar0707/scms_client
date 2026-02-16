import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit3, X, Tag, Layers, AlertCircle, List } from "lucide-react";

const API_URL = 'http://localhost:5000/api/categories';
const DEPT_API_URL = 'http://localhost:5000/api/categories';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const initialFormState = { name: '', department: '', priority: 'Medium' };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, deptRes] = await Promise.all([
                axios.get(`${API_URL}/fetchcategories`),
                axios.get(`${DEPT_API_URL}/fetchDepartments/categories`)
            ]);
            setCategories(catRes.data);
            setDepartments(deptRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingId(cat._id);
            setFormData({ 
                name: cat.name, 
                department: cat.department?._id || cat.department, 
                priority: cat.priority 
            });
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
                await axios.put(`${ API_URL}/updatecategories/${editingId}`, formData);
            } else {
                await axios.post(`${ API_URL}/createcategories`, formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const handleFinalDelete = async () => {
        try {
            await axios.delete(`${API_URL}/deletecategories/${deleteId}`);
            setDeleteId(null);
            fetchData();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Emergency': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Category Manager</h1>
                        <p className="text-xs text-slate-500 font-medium">Classify & Prioritize Department Tasks</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all"
                    >
                        <Plus size={18} strokeWidth={2.5} /> Add Category
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
                            placeholder="Search categories..."
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
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Category Name</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Assigned Department</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Priority Level</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-400 text-sm">Loading records...</td></tr>
                                ) : categories
                                    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((cat) => (
                                        <tr key={cat._id} className="hover:bg-slate-50/80 transition-all">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-slate-900 text-sm">{cat.name}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                        {cat.department?.name || "Unassigned"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getPriorityColor(cat.priority)} uppercase tracking-wider`}>
                                                    {cat.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleOpenModal(cat)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-100 transition-all">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => setDeleteId(cat._id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-all">
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
                            <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Category" : "Create New Category"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Category Name */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category Name</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Hardware Maintenance"
                                        />
                                    </div>
                                </div>

                                {/* Department Selection */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <select
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Priority Selection */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Level</label>
                                    <div className="relative">
                                        <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <select
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Emergency">Emergency</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md">
                                    {editingId ? "Update Category" : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
                            Are you sure you want to delete this category? This might affect workflows associated with it.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all">
                                No, Cancel
                            </button>
                            <button onClick={handleFinalDelete} className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all shadow-sm">
                                Yes, Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;