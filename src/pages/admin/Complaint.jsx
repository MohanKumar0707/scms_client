import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, UserCheck, X, Check } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/complaints';
const STAFF_API = 'http://localhost:5000/api/admin/complaints/staff';

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(STAFF_API);
      setStaffList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignStaff = async (staff) => {
    try {
      // await axios.patch(`${API_URL}/${selectedComplaint._id}`, {
      //   assignedTo: staff._id,
      //   status: 'In Progress'
      // });

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === selectedComplaint._id
            ? { ...c, assignedTo: staff.name, status: 'In Progress' }
            : c
        )
      );

      setIsModalOpen(false);
      setSelectedComplaint(null);
    } catch (err) {
      alert('Assign panna mudiyala');
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 h-20 flex items-center px-6 shadow-sm sticky top-0 z-30">
        <h1 className="text-xl font-bold text-slate-800">Complaint Admin Portal</h1>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {complaints
                .filter((c) =>
                  c.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-[10px]">#{item._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-bold">{item.student?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-500">{item.title}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(item.status)}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedComplaint(item);
                          setIsModalOpen(true);
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          item.assignedTo
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        <UserCheck size={14} />
                        {item.assignedTo || 'Assign Staff'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800">Assign Staff</h3>
                <p className="text-[11px] text-slate-500">Ref: #{selectedComplaint?._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto">
              <p className="text-xs font-bold text-slate-400 mb-3 px-2 uppercase tracking-widest">Select Staff Member</p>
              <div className="space-y-1">
                {staffList.map((staff) => (
                  <button
                    key={staff._id}
                    onClick={() => handleAssignStaff(staff)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 text-left group transition-all border border-transparent hover:border-indigo-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">{staff.name}</p>
                        <p className="text-[11px] text-slate-500">{staff.department} Department</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 text-indigo-500">
                      <Check size={18} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaint;