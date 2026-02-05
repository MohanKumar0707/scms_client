import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit3, X, Mail, Shield, User, Phone, BookOpen } from "lucide-react";

const UltraProTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Matches your Mongoose Schema exactly
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    password: "", // Required for new users
    role: "student", 
    department: "",
    semester: "" 
  });

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({ 
        name: user.name, 
        email: user.email, 
        phone: user.phone || "",
        role: user.role, 
        department: user.department,
        semester: user.semester || "",
        password: "" // Keep empty on edit unless you implement password change logic
      });
    } else {
      setCurrentUser(null);
      setFormData({ name: "", email: "", phone: "", password: "", role: "student", department: "", semester: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentUser ? "PUT" : "POST";
    const url = currentUser 
      ? `http://localhost:5000/api/users/${currentUser._id}` 
      : "http://localhost:5000/api/users";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err) { console.error("Submit error:", err); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">User Directory</h1>
            <p className="text-slate-500 text-sm">Manage students, staff, and administrators.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={18} strokeWidth={3} /> Add User
          </button>
        </div>

        {/* Search & Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or dept..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">User</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Department</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Role</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <UserRow 
                    key={user._id} 
                    user={user} 
                    onEdit={() => handleOpenModal(user)} 
                    onDelete={() => handleDelete(user._id)} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{currentUser ? "Edit User" : "Register New User"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Full Name</label>
                  <input
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Phone</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!currentUser && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
                  <input
                    required
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Role</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Dept</label>
                  <input
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    placeholder="e.g. CS"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Semester</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    placeholder="e.g. 4th"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  {currentUser ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const UserRow = ({ user, onEdit, onDelete }) => (
  <tr className="hover:bg-slate-50/50 transition-all group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
          {user.name?.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
             <span className="flex items-center gap-1"><Mail size={10}/>{user.email}</span>
             {user.phone && <span className="flex items-center gap-1"><Phone size={10}/>{user.phone}</span>}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-700 uppercase tracking-tight">{user.department}</span>
        {user.semester && <span className="text-[10px] text-slate-400">Semester: {user.semester}</span>}
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
        user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 
        user.role === 'staff' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
        'bg-emerald-50 text-emerald-600 border border-emerald-100'
      }`}>
        {user.role}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
          <Edit3 size={16} />
        </button>
        <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default UltraProTable;