import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Filter,
  Search,
  RefreshCw,
  ChevronDown,
  Calendar,
  User,
  Tag,
  AlertTriangle
} from "lucide-react";

function StaffAssignedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();
  
  // Get staff register number from session storage
  const staffRegisterNo = sessionStorage.getItem("registerNo");
  const staffName = sessionStorage.getItem("name");

  // Status color mapping
  const statusColors = {
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Assigned": "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
    "Resolved": "bg-green-100 text-green-800 border-green-200",
    "Closed": "bg-gray-100 text-gray-800 border-gray-200",
    "Rejected": "bg-red-100 text-red-800 border-red-200"
  };

  // Priority color mapping
  const priorityColors = {
    "Low": "bg-gray-100 text-gray-700",
    "Medium": "bg-blue-100 text-blue-700",
    "High": "bg-orange-100 text-orange-700",
    "Emergency": "bg-red-100 text-red-700 animate-pulse"
  };

  // Priority icons
  const PriorityIcon = ({ priority }) => {
    switch(priority) {
      case "Emergency":
        return <AlertTriangle size={14} className="text-red-600" />;
      case "High":
        return <AlertCircle size={14} className="text-orange-600" />;
      case "Medium":
        return <Clock size={14} className="text-blue-600" />;
      default:
        return <CheckCircle size={14} className="text-gray-600" />;
    }
  };

  // Fetch assigned complaints
  const fetchAssignedComplaints = async () => {
    try {
      setError(null);
      setRefreshing(true);
      
      const response = await fetch(
        `http://localhost:5000/api/staff/assigned?registerNo=${staffRegisterNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch complaints");
      }

      setComplaints(data.complaints || []);
      setFilteredComplaints(data.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.message || "Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!staffRegisterNo) {
      navigate("/");
      return;
    }
    fetchAssignedComplaints();
  }, [staffRegisterNo, navigate]);

  // Filter complaints based on search and filters
  useEffect(() => {
    let filtered = complaints;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.priority === priorityFilter
      );
    }

    setFilteredComplaints(filtered);
  }, [searchTerm, statusFilter, priorityFilter, complaints]);

  // Handle view complaint details
  const handleViewComplaint = (complaintId) => {
    navigate(`/staff/complaint/${complaintId}`);
  };

  // Handle status update
  const handleUpdateStatus = (complaintId, newStatus) => {
    navigate(`/staff/update/${complaintId}`, { state: { newStatus } });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading assigned complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Assigned Complaints
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {staffName || "Staff"} • {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} assigned
              </p>
            </div>
            
            <button
              onClick={fetchAssignedComplaints}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredComplaints.length}</span> of{" "}
                <span className="font-semibold">{complaints.length}</span> complaints
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <XCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchAssignedComplaints}
              className="ml-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters"
                : "No complaints have been assigned to you yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                {/* Priority Indicator */}
                <div className={`h-1 w-full ${
                  complaint.priority === "Emergency" ? "bg-red-500" :
                  complaint.priority === "High" ? "bg-orange-500" :
                  complaint.priority === "Medium" ? "bg-blue-500" :
                  "bg-gray-300"
                }`} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      statusColors[complaint.status] || "bg-gray-100 text-gray-800"
                    }`}>
                      {complaint.status}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      priorityColors[complaint.priority] || "bg-gray-100"
                    }`}>
                      <PriorityIcon priority={complaint.priority} />
                      {complaint.priority}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {complaint.title || "Untitled Complaint"}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {complaint.description || "No description provided"}
                  </p>

                  {/* Student Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <User size={14} className="text-gray-400" />
                    <span className="font-medium">{complaint.student?.name || "Unknown Student"}</span>
                    <span className="text-gray-400">•</span>
                    <span>{complaint.student?.registerNo || "N/A"}</span>
                  </div>

                  {/* Category */}
                  {complaint.category && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Tag size={14} className="text-gray-400" />
                      <span>{complaint.category.name}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Assigned: {formatDate(complaint.updatedAt || complaint.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewComplaint(complaint._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    
                    {complaint.status !== "Resolved" && complaint.status !== "Closed" && complaint.status !== "Rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(complaint._id, "In Progress")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <CheckCircle size={16} />
                        Update
                      </button>
                    )}
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

export default StaffAssignedComplaints;