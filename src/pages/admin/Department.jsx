import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/departments';

function Department() {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', code: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(API_URL);
            setDepartments(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing
                await axios.put(`${API_URL}/${editingId}`, formData);
                setEditingId(null);
            } else {
                // Create new
                await axios.post(API_URL, formData);
            }
            setFormData({ name: '', code: '', description: '' });
            fetchDepartments();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (dept) => {
        setEditingId(dept._id);
        setFormData({ name: dept.name, code: dept.code, description: dept.description });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchDepartments();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Department Management</h2>

                {/* Form Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        {editingId ? 'Edit Department' : 'Add New Department'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                            type="text" name="name" placeholder="Dept Name"
                            value={formData.name} onChange={handleChange} required
                        />
                        <input
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                            type="text" name="code" placeholder="Dept Code"
                            value={formData.code} onChange={handleChange} required
                        />
                        <input
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                            type="text" name="description" placeholder="Description"
                            value={formData.description} onChange={handleChange}
                        />
                        <button 
                            type="submit" 
                            className={`md:col-span-3 py-2 px-4 rounded text-white font-bold transition ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {editingId ? 'Update Department' : 'Add Department'}
                        </button>
                    </form>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-4">Code</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Description</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-10 text-center text-gray-500">Loading data...</td></tr>
                            ) : departments.map((dept) => (
                                <tr key={dept._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono text-sm text-blue-600">{dept.code}</td>
                                    <td className="p-4 font-medium text-gray-800">{dept.name}</td>
                                    <td className="p-4 text-gray-600">{dept.description}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center space-x-2">
                                            <button 
                                                onClick={() => handleEdit(dept)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(dept._id)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Department;