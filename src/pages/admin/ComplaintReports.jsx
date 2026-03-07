import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    FiDownload,
    FiFilter,
    FiX,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiTrendingUp,
    FiPieChart
} from 'react-icons/fi';

function ComplaintReports() {

    const [complaints, setComplaints] = useState([]);
    const [summary, setSummary] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 });
    const [filterOptions, setFilterOptions] = useState({ departments: [], categories: [] });
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        department: '',
        category: '',
        fromDate: '',
        toDate: ''
    });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(false);

    // Fetch filter options on mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/complaintReports/filter-options', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setFilterOptions(data);
            } catch (error) {
                console.error('Failed to fetch filter options', error);
            }
        };
        fetchOptions();
    }, []);

    // Fetch complaints when filters or page change
    useEffect(() => {
        fetchComplaints();
    }, [filters, pagination.page]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                ...filters,
                page: pagination.page,
                limit: 20
            }).toString();

            const res = await fetch(`http://localhost:5000/api/complaintReports/complaints?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setComplaints(data.complaints);
            setSummary(data.summary);
            setPagination({
                page: data.page,
                pages: data.pages,
                total: data.total
            });
        } catch (error) {
            console.error('Failed to fetch complaints', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const resetFilters = () => {
        setFilters({
            status: '',
            priority: '',
            department: '',
            category: '',
            fromDate: '',
            toDate: ''
        });
        setPagination({ page: 1, pages: 1, total: 0 });
    };

    const exportCSV = () => {
        const data = complaints.map(c => ({
            'Complaint ID': c.complaintId,
            'Student Name': c.student?.name,
            'Register No': c.student?.registerNo,
            'Title': c.title,
            'Category': c.category?.name,
            'Department': c.department?.name,
            'Status': c.status,
            'Priority': c.priority,
            'Assigned To': c.assignedTo?.name || 'Unassigned',
            'Created At': new Date(c.createdAt).toLocaleString(),
            'Resolved At': c.resolvedAt ? new Date(c.resolvedAt).toLocaleString() : ''
        }));
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'complaint_report.csv';
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(18);
        doc.text('Complaint Report', 14, 16);
        const tableColumn = [
            'ID',
            'Student',
            'Title',
            'Category',
            'Dept',
            'Status',
            'Priority',
            'Assigned',
            'Created'
        ];
        const tableRows = complaints.map(c => [
            c.complaintId,
            `${c.student?.name || ''} (${c.student?.registerNo || ''})`,
            c.title,
            c.category?.name || '',
            c.department?.name || '',
            c.status,
            c.priority,
            c.assignedTo?.name || 'Unassigned',
            new Date(c.createdAt).toLocaleDateString()
        ]);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8, textColor: [44, 62, 80] },
            headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] }
        });
        doc.save('complaint_report.pdf');
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                {/* Header with gradient */}
                <div className="bg-indigo-900 rounded-xl shadow-lg p-6 mb-8 text-white">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FiPieChart className="text-2xl" />
                        Complaint Reports
                    </h1>
                    <p className="text-blue-100 mt-1">Track and manage complaints efficiently</p>
                </div>

                {/* Filters with card style */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <FiFilter className="text-blue-500" />
                        <h3 className="text-lg font-semibold">Filter Complaints</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md bg-gray-50"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <select
                            name="priority"
                            value={filters.priority}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md bg-gray-50"
                        >
                            <option value="">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Emergency">Emergency</option>
                        </select>

                        <select
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md bg-gray-50"
                        >
                            <option value="">All Departments</option>
                            {filterOptions.departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>

                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md bg-gray-50"
                        >
                            <option value="">All Categories</option>
                            {filterOptions.categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name} ({cat.department?.name})</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md bg-gray-50"
                        />
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md bg-gray-50"
                        />

                        <button
                            onClick={resetFilters}
                            className="inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FiX />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Export Buttons with icons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiDownload />
                        Export CSV
                    </button>
                    <button
                        onClick={exportPDF}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiDownload />
                        Export PDF
                    </button>
                </div>

                {/* Complaints Table */}
                {loading ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-2 text-gray-500">Loading complaints...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto overflow-y-auto max-h-[600px] bg-white rounded-xl shadow-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-indigo-900 text-white">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Student</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Assigned To</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Resolved</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {complaints.map(c => (
                                        <tr key={c._id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.complaintId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {c.student?.name}<br />
                                                <span className="text-xs text-gray-400">{c.student?.registerNo}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{c.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.category?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.department?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={c.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <PriorityBadge priority={c.priority} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.assignedTo?.name || '—'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination with colorful design */}
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing page <span className="font-medium text-blue-600">{pagination.page}</span> of{' '}
                                        <span className="font-medium text-blue-600">{pagination.pages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-blue-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-blue-50 text-blue-600">
                                            {pagination.page}
                                        </span>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.pages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-blue-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Helper Components
const SummaryCard = ({ title, value, icon, gradient }) => (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl shadow-lg p-5 text-white transform transition hover:scale-105`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm opacity-90">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className="text-3xl opacity-80">
                {icon}
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        Assigned: 'bg-blue-100 text-blue-800 border-blue-300',
        'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-300',
        Resolved: 'bg-green-100 text-green-800 border-green-300',
        Rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    const colorClass = colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
            {status}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const colors = {
        Low: 'bg-gray-100 text-gray-800 border-gray-300',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        High: 'bg-orange-100 text-orange-800 border-orange-300',
        Emergency: 'bg-red-100 text-red-800 border-red-300'
    };
    const colorClass = colors[priority] || 'bg-gray-100 text-gray-800 border-gray-300';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
            {priority}
        </span>
    );
};

export default ComplaintReports;