import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit3, X, Mail, Shield, User } from "lucide-react";

const UserManage = () => {
	const [users, setUsers] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [formData, setFormData] = useState({ name: "", email: "", role: "Member", status: "active" });
	const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });

	const fetchData = async () => {
		try {
			const res = await fetch("http://localhost:5000/api/users");
			const data = await res.json();
			setUsers(data);
			setStats({
				total: data.length,
				active: data.filter(u => u.status === 'active').length,
				pending: data.filter(u => u.status === 'pending').length
			});
		} catch (err) { console.error("Fetch error:", err); }
	};

	useEffect(() => { fetchData(); }, []);

	const handleOpenModal = (user = null) => {
		if (user) {
			setCurrentUser(user);
			setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
		} else {
			setCurrentUser(null);
			setFormData({ name: "", email: "", role: "Member", status: "active" });
		}
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Permanent action: Delete this member?")) return;
		try {
			await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
			setUsers(users.filter((u) => u._id !== id));
		} catch (err) { console.error(err); }
	};

	const filteredUsers = users.filter(u =>
		u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		u.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 font-sans antialiased text-slate-900">
			<div className="max-w-7xl mx-auto">

				{/* Header Section */}
				<div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Members</h1>
						<p className="text-slate-500 mt-2 text-sm md:text-base">Manage your team's access levels and workspace permissions.</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => handleOpenModal()}
							className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm shadow-indigo-200"
						>
							<Plus size={16} strokeWidth={3} /> Invite Member
						</button>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
					<StatCard label="Total Users" value={stats.total} trend="+12%" />
					<StatCard label="Active Licenses" value={stats.active} trend="Stable" />
					<StatCard label="Pending Invites" value={stats.pending} trend="-2%" />
				</div>

				{/* Table Container */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center gap-4">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								type="text"
								placeholder="Search by name or email..."
								className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-slate-50/50 border-b border-slate-100">
									<th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Member Details</th>
									<th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
									<th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Access Role</th>
									<th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Settings</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{filteredUsers.map((user) => (
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

			{/* Modern Slide-up/Fade Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
					<div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
						<div className="p-6 flex justify-between items-center border-b border-slate-100">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
									<User size={20} />
								</div>
								<h3 className="text-lg font-bold text-slate-800">{currentUser ? "Update Member" : "New Member Invite"}</h3>
							</div>
							<button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-all">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={(e) => { e.preventDefault(); /* logic here */ }} className="p-6 space-y-5">
							<div className="space-y-1">
								<label className="text-[13px] font-semibold text-slate-700">Display Name</label>
								<input
									className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
									placeholder="e.g. John Doe"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								/>
							</div>

							<div className="space-y-1">
								<label className="text-[13px] font-semibold text-slate-700">Email Address</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
									<input
										type="email"
										className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
										placeholder="john@company.com"
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<label className="text-[13px] font-semibold text-slate-700">Role</label>
									<select
										className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white transition-all text-sm"
										value={formData.role}
										onChange={(e) => setFormData({ ...formData, role: e.target.value })}
									>
										<option>Admin</option>
										<option>Member</option>
										<option>Editor</option>
									</select>
								</div>
								<div className="space-y-1">
									<label className="text-[13px] font-semibold text-slate-700">Account Status</label>
									<select
										className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white transition-all text-sm"
										value={formData.status}
										onChange={(e) => setFormData({ ...formData, status: e.target.value })}
									>
										<option value="active">Active</option>
										<option value="pending">Pending</option>
										<option value="inactive">Disabled</option>
									</select>
								</div>
							</div>

							<div className="pt-4 flex gap-3">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
								>
									{currentUser ? "Save Changes" : "Send Invite"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

// --- Sub-components with Professional Polish ---

const StatCard = ({ label, value, trend }) => (
	<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
		<div className="flex justify-between items-start">
			<div>
				<p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
				<p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
			</div>
			<span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
				{trend}
			</span>
		</div>
		<div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 transition-all duration-500 group-hover:w-full" />
	</div>
);

const UserRow = ({ user, onEdit, onDelete }) => (
	<tr className="hover:bg-slate-50/50 transition-all">
		<td className="px-6 py-4">
			<div className="flex items-center gap-3">
				<div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
					{user.name?.charAt(0)}
				</div>
				<div>
					<p className="font-semibold text-slate-900 text-sm leading-tight">{user.name}</p>
					<p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
				</div>
			</div>
		</td>
		<td className="px-6 py-4">
			<span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold border ${user.status === 'active'
					? 'bg-emerald-50 text-emerald-700 border-emerald-100'
					: 'bg-slate-50 text-slate-500 border-slate-200'
				}`}>
				<span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
				{user.status.toUpperCase()}
			</span>
		</td>
		<td className="px-6 py-4">
			<div className="flex items-center gap-1.5 text-slate-600">
				<Shield size={14} className="text-slate-400" />
				<span className="text-sm font-medium">{user.role}</span>
			</div>
		</td>
		<td className="px-6 py-4 text-right">
			<div className="flex justify-end items-center gap-1">
				<button onClick={onEdit} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
					<Edit3 size={16} />
				</button>
				<button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
					<Trash2 size={16} />
				</button>
			</div>
		</td>
	</tr>
);

export default UserManage;