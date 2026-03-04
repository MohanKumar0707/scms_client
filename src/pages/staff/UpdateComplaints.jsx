import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    RefreshCw, CheckCircle, XCircle, AlertCircle, Loader,
    Camera, DollarSign, Image as ImageIcon, ChevronLeft, ChevronRight,
    Clock, User, FileText, Calendar, Plus, ArrowRight, Tag
} from "lucide-react";

function UpdateComplaints() {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [updateData, setUpdateData] = useState({
        status: "",
        description: "",
        photos: [],
        charges: 0
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchAssignedComplaints();
    }, []);

    const fetchAssignedComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            const registerNo = sessionStorage.getItem("registerNo");
            const response = await fetch(`http://localhost:5000/api/staff/update?registerNo=${registerNo}`);
            if (!response.ok) throw new Error("Failed to fetch complaints");
            const data = await response.json();
            setComplaints(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectComplaint = async (complaint) => {
        setSelectedComplaint(complaint);
        setUpdateData({
            status: complaint.status,
            description: "",
            photos: [],
            charges: 0
        });
        setHistory([]);
        setLoadingHistory(true);

        try {
            const registerNo = sessionStorage.getItem("registerNo");
            const response = await fetch(
                `http://localhost:5000/api/staff/update/${complaint._id}/history?registerNo=${registerNo}`
            );
            if (!response.ok) throw new Error("Failed to fetch history");
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setUpdateData(prev => ({ ...prev, photos: files }));
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        if (!selectedComplaint) return;

        setUpdating(true);
        try {
            const registerNo = sessionStorage.getItem("registerNo");
            const formData = new FormData();
            formData.append("status", updateData.status);
            formData.append("description", updateData.description);
            formData.append("charges", updateData.charges);
            formData.append("registerNo", registerNo);
            updateData.photos.forEach(file => {
                formData.append("photos", file);
            });

            const response = await fetch(
                `http://localhost:5000/api/staff/update/${selectedComplaint._id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Update failed");
            }

            await fetchAssignedComplaints();
            if (selectedComplaint) {
                await handleSelectComplaint(selectedComplaint);
            }
            alert("Complaint updated successfully!");
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            "Pending": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
            "Assigned": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: User },
            "In Progress": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: Loader },
            "Resolved": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle },
            "Closed": { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: CheckCircle },
            "Rejected": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle }
        };
        return statusConfig[status] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: AlertCircle };
    };

    const ImageGallery = ({ photos }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        if (!photos || photos.length === 0) return null;

        const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
        const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

        return (
            <div className="mt-3 relative group">
                <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-2">
                    <img
                        src={`http://localhost:5000${photos[currentIndex]}`}
                        alt="Complaint"
                        className="max-h-36 rounded object-contain"
                    />
                </div>
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                        >
                            <ChevronRight size={14} />
                        </button>
                        <div className="flex justify-center mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {currentIndex + 1} / {photos.length}
                            </span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    if (loading && complaints.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-4">
                    <Loader className="animate-spin text-indigo-600" size={40} />
                    <p className="text-gray-600 font-medium">Loading complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with subtle gradient */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Update Complaints</h1>
                        <p className="text-sm text-gray-500 mt-1">Track and manage updates for your assigned complaints</p>
                    </div>
                    <button
                        onClick={fetchAssignedComplaints}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Refresh List
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 shadow-sm">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Complaints List Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
                            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                                <h2 className="font-semibold text-gray-700 flex items-center">
                                    <FileText size={18} className="mr-2 text-indigo-600" />
                                    Assigned Complaints
                                    <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                                        {complaints.length}
                                    </span>
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {complaints.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <FileText size={24} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 text-sm">No complaints assigned</p>
                                    </div>
                                ) : (
                                    complaints.map(complaint => {
                                        const StatusIcon = getStatusBadge(complaint.status).icon;
                                        return (
                                            <div
                                                key={complaint._id}
                                                onClick={() => handleSelectComplaint(complaint)}
                                                className={`p-5 cursor-pointer transition-all hover:bg-gray-50 ${selectedComplaint?._id === complaint._id
                                                    ? 'bg-indigo-50 border-l-4 border-indigo-600 shadow-inner'
                                                    : 'border-l-4 border-transparent hover:border-l-4 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-gray-800 line-clamp-1 flex-1">{complaint.title}</h3>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(complaint.status).bg} ${getStatusBadge(complaint.status).text} ${getStatusBadge(complaint.status).border} ml-2`}>
                                                        <StatusIcon size={10} className="mr-1" />
                                                        {complaint.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{complaint.description}</p>
                                                <div className="flex items-center text-xs text-gray-400">
                                                    <Calendar size={12} className="mr-1" />
                                                    {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Panel */}
                    <div className="lg:col-span-2">
                        {selectedComplaint ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Complaint Header with quick info */}
                                <div className="px-6 py-5 border-b border-gray-200 bg-white">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                {selectedComplaint.title}
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedComplaint.status).bg} ${getStatusBadge(selectedComplaint.status).text} ${getStatusBadge(selectedComplaint.status).border}`}>
                                                    {selectedComplaint.status}
                                                </span>
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-2">{selectedComplaint.description}</p>
                                        </div>
                                        <div className="text-right text-xs text-gray-400 whitespace-nowrap">
                                            <div className="flex items-center justify-end mb-1">
                                                <Calendar size={12} className="mr-1" />
                                                Created: {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                                            </div>
                                            {selectedComplaint.updatedAt && (
                                                <div className="flex items-center justify-end">
                                                    <Clock size={12} className="mr-1" />
                                                    Updated: {new Date(selectedComplaint.updatedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* History Timeline */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                            <Clock size={18} className="mr-2 text-indigo-600" />
                                            Update History
                                        </h3>
                                        {loadingHistory ? (
                                            <div className="flex justify-center py-8">
                                                <Loader className="animate-spin text-indigo-600" size={28} />
                                            </div>
                                        ) : history.length === 0 ? (
                                            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                                                <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                                    <Clock size={20} className="text-gray-500" />
                                                </div>
                                                <p className="text-gray-500 text-sm">No updates yet. Add the first update below.</p>
                                            </div>
                                        ) : (
                                            <div className="relative pl-6 space-y-6">
                                                {/* Vertical timeline line */}
                                                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                                {history.map((entry, index) => {
                                                    const StatusIcon = getStatusBadge(entry.status).icon;
                                                    return (
                                                        <div key={entry._id} className="relative">
                                                            {/* Timeline dot */}
                                                            <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white ${getStatusBadge(entry.status).bg} flex items-center justify-center shadow-sm`}>
                                                                <StatusIcon size={10} className={getStatusBadge(entry.status).text} />
                                                            </div>
                                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(entry.status).bg} ${getStatusBadge(entry.status).text} ${getStatusBadge(entry.status).border}`}>
                                                                        {entry.status}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        {new Date(entry.createdAt).toLocaleString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                {entry.description && (
                                                                    <p className="text-sm text-gray-700 mb-3">{entry.description}</p>
                                                                )}
                                                                {entry.photos && entry.photos.length > 0 && (
                                                                    <div className="mb-3">
                                                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                                            <ImageIcon size={14} /> Attached Photos
                                                                        </div>
                                                                        <ImageGallery photos={entry.photos} />
                                                                    </div>
                                                                )}
                                                                {entry.charges > 0 && (
                                                                    <div className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
                                                                        <DollarSign size={12} className="mr-1" />
                                                                        ₹{entry.charges}
                                                                    </div>
                                                                )}
                                                                <div className="text-xs text-gray-400 flex items-center mt-2 pt-2 border-t border-gray-200">
                                                                    <User size={12} className="mr-1" />
                                                                    {entry.updatedBy?.name || 'Unknown'} ({entry.updatedBy?.registerNo || ''})
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* New Update Form */}
                                    <form onSubmit={handleSubmitUpdate}>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                            <Plus size={18} className="mr-2 text-indigo-600" />
                                            Add New Update
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Status */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                                                    <Tag size={14} className="mr-1.5" /> Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={updateData.status}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 mt-2 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                                                    required
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Assigned">Assigned</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Closed">Closed</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                                                    <FileText size={14} className="mr-1.5" /> Description
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={updateData.description}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    className="w-full px-4 py-2.5 border border-gray-300 mt-2 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                                                    placeholder="Add any remarks or notes..."
                                                ></textarea>
                                            </div>

                                            {/* Photos */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                                                    <Camera size={14} className="mr-1.5" /> Photos
                                                </label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                    className="w-full text-sm mt-2 text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-xl shadow-sm cursor-pointer transition"
                                                />
                                                {updateData.photos.length > 0 && (
                                                    <p className="mt-2 text-xs text-gray-500 flex items-center">
                                                        <ImageIcon size={14} className="mr-1" />
                                                        {updateData.photos.length} file(s) selected
                                                    </p>
                                                )}
                                            </div>

                                            {/* Charges */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                                                    <DollarSign size={14} className="mr-1.5" /> Charges (if any)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="charges"
                                                    value={updateData.charges}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-4 py-2.5 border border-gray-300 mt-2 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={updating}
                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-sm hover:shadow"
                                                >
                                                    {updating ? <Loader className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                                    {updating ? "Updating..." : "Submit Update"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedComplaint(null)}
                                                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                                <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                    <ArrowRight size={32} className="text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No complaint selected</h3>
                                <p className="text-gray-400 text-sm max-w-md mx-auto">
                                    Choose a complaint from the list on the left to view its details and add updates.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateComplaints;