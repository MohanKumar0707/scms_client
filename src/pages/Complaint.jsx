import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Download, 
  ChevronLeft, ChevronRight, Circle, CheckCircle2, 
  Clock, AlertCircle, FileText, ArrowUpRight 
} from 'lucide-react';

const EnterpriseDashboard = () => {
  // Mock Data
  const complaints = [
    { id: "TKT-8842", user: "Sarah Jenkins", tier: "Premium", subject: "API Integration Failure", status: "Critical", time: "2m ago" },
    { id: "TKT-8841", user: "TechFlow Inc.", tier: "Enterprise", subject: "Late delivery of hardware", status: "Pending", time: "1h ago" },
    { id: "TKT-8840", user: "Michael Ross", tier: "Free", subject: "Password reset loop", status: "Resolved", time: "5h ago" },
    { id: "TKT-8839", user: "Global Logistics", tier: "Enterprise", subject: "Invoice discrepancy", status: "In Progress", time: "Yesterday" },
  ];

  const stats = [
    { label: 'Total Complaints', value: '1,284', change: '+12%', icon: <FileText className="text-blue-600" /> },
    { label: 'Avg. Resolution', value: '4.2h', change: '-8%', icon: <Clock className="text-orange-600" /> },
    { label: 'Customer Satisfaction', value: '98%', change: '+2%', icon: <CheckCircle2 className="text-emerald-600" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Navigation / Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span>Dashboard</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">Complaints</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:row md:items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Complaint Management</h1>
            <p className="text-slate-500 mt-1">Monitor, investigate, and resolve customer issues in real-time.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              <Download size={16} /> Export CSV
            </button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-slate-800 transition-all">
              Create Ticket
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Table Header / Filters */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tickets, customers, or keywords..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Reference</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                          {item.user.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.user}</div>
                          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-tighter">{item.tier}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                        ${item.status === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                          item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          'bg-blue-50 text-blue-700 border-blue-100'}`}>
                        <Circle size={6} fill="currentColor" />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 group-hover:text-slate-900">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-6 flex items-center justify-between border-t border-slate-100">
            <p className="text-sm font-medium text-slate-500">Page 1 of 12</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold disabled:opacity-50">Previous</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold bg-slate-900 text-white">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;