import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts";
import {
    AlertCircle, CheckCircle, Clock, Users, FolderOpen, TrendingUp,
    Award, Bell, FileText, Activity, Home, Settings, LogOut,
    ChevronRight, Calendar, Filter, Download, MoreVertical,
    User, Phone, Mail, BookOpen, Shield, Star, Zap, Globe,
    BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon
} from "lucide-react";

// Color palette
const COLORS = {
    primary: "#4f46e5",
    secondary: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    purple: "#8b5cf6",
    pink: "#ec4899",
    indigo: "#6366f1",
    slate: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
    }
};

// Chart colors
const CHART_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

// Status badge styles
const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Assigned: "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-indigo-100 text-indigo-800 border-indigo-200",
    Resolved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Closed: "bg-gray-100 text-gray-800 border-gray-200",
};

// Priority badge styles
const priorityStyles = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Emergency: "bg-red-100 text-red-800",
};

function Dashboard() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("week"); // week, month

    // Get user info
    useEffect(() => {
        const role = sessionStorage.getItem("role");
        const name = sessionStorage.getItem("name");
        const registerNo = sessionStorage.getItem("registerNo");
        const phone = sessionStorage.getItem("phone");
        if (!role || !name) {
            navigate("/auth");
            return;
        }
        setUser({ role, name, registerNo, phone });
    }, [navigate]);

    // Fetch stats
    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `http://localhost:5000/api/dashboard/stats?role=${user.role}&registerNo=${user.registerNo}&range=${timeRange}`
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to load stats");
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, timeRange]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-center max-w-md border border-slate-200">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to load dashboard</h2>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const { role } = user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Top Navigation Bar */}
            <div className="bg-white/70 backdrop-blur-md border-b border-slate-200">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <Home className="text-white" size={20} />
                            </div>
                            <span className="font-semibold text-slate-700">Dashboard</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                            <span>Overview</span>
                            <ChevronRight size={16} />
                            <span className="text-indigo-600 font-medium capitalize">{role}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition relative">
                            <Bell size={20} className="text-slate-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                {user.name.charAt(0)}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 lg:p-8">
                {/* Welcome Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user.name}</span>
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {role === "admin" && "Here's what's happening across your institution today."}
                            {role === "staff" && "Manage your assigned complaints and track department metrics."}
                            {role === "student" && "Track your submitted complaints and stay updated."}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="week">Last 7 days</option>
                            <option value="month">Last 30 days</option>
                            <option value="year">This year</option>
                        </select>
                        <button className="bg-white border border-slate-200 p-2 rounded-xl hover:bg-slate-50 transition">
                            <Download size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Complaints"
                        value={stats.totalComplaints}
                        change="+12.5%"
                        icon={FileText}
                        color="indigo"
                        trend="up"
                    />
                    <MetricCard
                        title="Pending"
                        value={stats.pendingComplaints}
                        change="-5"
                        icon={Clock}
                        color="yellow"
                        trend="down"
                    />
                    <MetricCard
                        title="Resolved"
                        value={stats.resolvedComplaints}
                        change="+23"
                        icon={CheckCircle}
                        color="green"
                        trend="up"
                    />
                    <MetricCard
                        title="In Progress"
                        value={stats.inProgressComplaints}
                        change="+2"
                        icon={Activity}
                        color="purple"
                        trend="up"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Pie Chart - Category Distribution */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                <PieChartIcon size={20} className="text-indigo-500" />
                                By Category
                            </h2>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={stats.categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {stats.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: "white", borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart - Daily Trend */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                <BarChart3 size={20} className="text-indigo-500" />
                                Daily Complaints
                            </h2>
                            <div className="flex gap-2">
                                <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">Week</button>
                                <button className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">Month</button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.timeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ background: "white", borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Role‑specific sections */}
                {role === "admin" && <AdminSection stats={stats} />}
                {role === "staff" && <StaffSection stats={stats} />}
                {role === "student" && <StudentSection stats={stats} />}
            </div>
        </div>
    );
}

// Metric Card Component with glass effect
const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => {
    const colorClasses = {
        indigo: "from-indigo-500 to-indigo-600",
        yellow: "from-yellow-500 to-yellow-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-800">{value.toLocaleString()}</p>
                </div>
                <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </span>
                <span className="text-xs text-slate-400">vs last period</span>
            </div>
        </div>
    );
};

// Admin Section
const AdminSection = ({ stats }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints by Department */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Users size={20} className="text-indigo-500" />
                Complaints by Department
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.departmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                        contentStyle={{ background: "white", borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="complaints" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Bell size={20} className="text-indigo-500" />
                Recent Activity
            </h2>
            <div className="space-y-4">
                {stats.recentComplaints.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileText size={16} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-700">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {item.studentName} • {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Staff Section
const StaffSection = ({ stats }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <FolderOpen size={20} className="text-indigo-500" />
            Assigned to Me
        </h2>
        {stats.assignedComplaints?.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="pb-3">ID</th>
                            <th className="pb-3">Title</th>
                            <th className="pb-3">Student</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Priority</th>
                            <th className="pb-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.assignedComplaints.map((c, i) => (
                            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                <td className="py-3 text-sm font-mono">{c.complaintId}</td>
                                <td className="py-3 font-medium text-slate-700">{c.title}</td>
                                <td className="py-3 text-sm text-slate-600">{c.studentName}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusStyles[c.status]}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityStyles[c.priority]}`}>
                                        {c.priority}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No complaints assigned to you.</p>
            </div>
        )}
    </div>
);

// Student Section
const StudentSection = ({ stats }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-indigo-500" />
            My Recent Complaints
        </h2>
        {stats.myComplaints?.length > 0 ? (
            <div className="space-y-3">
                {stats.myComplaints.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                        <div>
                            <p className="font-medium text-slate-700">{c.title}</p>
                            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                <span className="font-mono">{c.complaintId}</span>
                                <span>•</span>
                                <Calendar size={14} className="text-slate-400" />
                                {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[c.status]}`}>
                                {c.status}
                            </span>
                            <ChevronRight size={18} className="text-slate-400" />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">You haven't submitted any complaints yet.</p>
                <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-md">
                    File a Complaint
                </button>
            </div>
        )}
    </div>
);

// Skeleton Loader
const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2"></div>
                <div className="h-4 w-96 bg-slate-200 rounded"></div>
            </div>
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/80 rounded-2xl p-6 border border-slate-200">
                        <div className="flex justify-between">
                            <div>
                                <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
                                <div className="h-8 w-16 bg-slate-200 rounded"></div>
                            </div>
                            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/80 rounded-2xl p-6 border border-slate-200 h-64"></div>
                <div className="bg-white/80 rounded-2xl p-6 border border-slate-200 h-64 col-span-2"></div>
            </div>
        </div>
    </div>
);

export default Dashboard;