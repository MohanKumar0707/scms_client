import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    RefreshCw, CheckCircle, XCircle, AlertCircle, Loader,
    Camera, DollarSign, Image as ImageIcon, ChevronLeft, ChevronRight
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
        photos: [],        // will hold File objects for upload
        charges: 0
    });
    const [updating, setUpdating] = useState(false);

    // Fetch assigned complaints on mount
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
                    body: formData, // no Content-Type header, browser sets it with boundary
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Update failed");
            }

            // Refresh list and history
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
        const statusStyles = {
            "Pending": "bg-yellow-100 text-yellow-800",
            "Assigned": "bg-blue-100 text-blue-800",
            "In Progress": "bg-purple-100 text-purple-800",
            "Resolved": "bg-green-100 text-green-800",
            "Closed": "bg-gray-100 text-gray-800",
            "Rejected": "bg-red-100 text-red-800"
        };
        return statusStyles[status] || "bg-gray-100 text-gray-800";
    };

    // Image gallery component for history
    const ImageGallery = ({ photos }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        if (!photos || photos.length === 0) return null;

        const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
        const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

        return (
            <div className="mt-2 relative">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
                    <img
                        src={`http://localhost:5000${photos[currentIndex]}`}
                        alt="Complaint"
                        className="max-h-40 rounded object-contain"
                    />
                </div>
                {photos.length > 1 && (
                    <div className="flex justify-center mt-2 gap-2">
                        <button
                            onClick={prev}
                            className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs text-gray-600">
                            {currentIndex + 1} / {photos.length}
                        </span>
                        <button
                            onClick={next}
                            className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (loading && complaints.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Update Complaints</h1>
                <button
                    onClick={fetchAssignedComplaints}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Complaints List */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b">
                        <h2 className="font-semibold text-gray-700">
                            Assigned Complaints <span className="ml-2 text-sm text-gray-500">({complaints.length})</span>
                        </h2>
                    </div>
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                        {complaints.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">No complaints assigned.</div>
                        ) : (
                            complaints.map(complaint => (
                                <div
                                    key={complaint._id}
                                    onClick={() => handleSelectComplaint(complaint)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedComplaint?._id === complaint._id
                                        ? 'bg-indigo-50 border-l-4 border-indigo-500'
                                        : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-gray-800">{complaint.title}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Update Form & History */}
                <div className="lg:col-span-2">
                    {selectedComplaint ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Update Complaint: {selectedComplaint.title}
                            </h2>

                            {/* History Timeline */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Update History</h3>
                                {loadingHistory ? (
                                    <div className="flex justify-center py-4">
                                        <Loader className="animate-spin text-indigo-600" size={24} />
                                    </div>
                                ) : history.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No history available.</p>
                                ) : (
                                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                                        {history.map((entry) => (
                                            <div key={entry._id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-300">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(entry.status)}`}>
                                                        {entry.status}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(entry.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {entry.description && (
                                                    <p className="text-sm text-gray-700 mb-2">{entry.description}</p>
                                                )}
                                                {entry.photos && entry.photos.length > 0 && (
                                                    <div className="mb-2">
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                            <ImageIcon size={14} /> Photos
                                                        </div>
                                                        <ImageGallery photos={entry.photos} />
                                                    </div>
                                                )}
                                                {entry.charges > 0 && (
                                                    <div className="text-sm font-medium text-gray-700">
                                                        Charges: ₹{entry.charges}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-2">
                                                    By: {entry.updatedBy?.name || 'Unknown'} ({entry.updatedBy?.registerNo || ''})
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmitUpdate} className="space-y-4">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={updateData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

                                {/* Description/Note */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Description</label>
                                    <textarea
                                        name="description"
                                        value={updateData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Add any remarks or notes..."
                                    ></textarea>
                                </div>

                                {/* Photos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Camera size={16} className="inline mr-1" /> Attach Photos
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {updateData.photos.length > 0 && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            Selected {updateData.photos.length} file(s)
                                        </div>
                                    )}
                                </div>

                                {/* Charges */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <DollarSign size={16} className="inline mr-1" /> Charges (if any)
                                    </label>
                                    <input
                                        type="number"
                                        name="charges"
                                        value={updateData.charges}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {updating ? <Loader className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                        {updating ? "Updating..." : "Update Complaint"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedComplaint(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
                            <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Select a complaint from the list to update</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UpdateComplaints;