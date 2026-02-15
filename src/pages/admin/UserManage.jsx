import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit3, X, Mail, Phone, BookOpen, Lock, Hash } from "lucide-react";

const UserManage = () => {

	const [users, setUsers] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteId, setDeleteId] = useState(null);

	const initialFormState = {
		registerNo: "",
		name: "",
		email: "",
		phone: "",
		password: "",
		role: "student",
		department: "",
		semester: ""
	};

	const [formData, setFormData] = useState(initialFormState);

	const fetchData = async () => {
		try {
			const res = await fetch("http://localhost:5000/api/userManage/fetchUsers");
			const data = await res.json();
			setUsers(data);
		} catch (err) { console.error("Fetch error:", err); }
	};

	useEffect(() => { fetchData(); }, []);

	const handleOpenModal = (user = null) => {
		if (user) {
			setCurrentUser(user);
			setFormData({
				registerNo: user.registerNo || "",
				name: user.name || "",
				email: user.email || "",
				phone: user.phone || "",
				role: user.role || "student",
				department: user.department || "",
				semester: user.semester || "",
				password: "" 
			});
		} else {
			setCurrentUser(null);
			setFormData(initialFormState);
		}
		setIsModalOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const url = currentUser
			? `http://localhost:5000/api/userManage/updateUser/${currentUser._id}`
			: "http://localhost:5000/api/userManage/createUser";
		const method = currentUser ? "PUT" : "POST";

		try {
			const res = await fetch(url, {
				method: method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData)
			});
			if (res.ok) {
				setIsModalOpen(false);
				fetchData();
			}
		} catch (err) { console.error("Submit error:", err); }
	};

	const confirmDelete = (id) => {
		setDeleteId(id);
	};

	const handleFinalDelete = async () => {
		try {
			await fetch(`http://localhost:5000/api/userManage/deleteUser/${deleteId}`, { method: "DELETE" });
			setDeleteId(null); 
			fetchData(); 
		} catch (err) {
			console.error("Delete error:", err);
		}
	};
	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			<header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
				<div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
					<div>
						<h1 className="text-xl font-bold text-slate-800 tracking-tight">System Directory</h1>
						<p className="text-xs text-slate-500 font-medium">Manage Records & Credentials</p>
					</div>
					<button
						onClick={() => handleOpenModal()}
						className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all"
					>
						<Plus size={18} strokeWidth={2.5} /> Add New Entry
					</button>
				</div>
			</header>

			<main className="max-w-[1600px] mx-auto p-6">
				<div className="mb-6 flex items-center gap-4">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
						<input
							type="text"
							placeholder="Search by ID, name, or department..."
							className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left table-auto">
							<thead>
								<tr className="bg-slate-50 border-b border-slate-200">
									<th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Identification</th>
									<th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Contact Info</th>
									<th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Department & Term</th>
									<th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest">Role</th>
									<th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest text-center">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{users
									.filter(u =>
										u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
										u.registerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
										u.department.toLowerCase().includes(searchTerm.toLowerCase())
									)
									.map((user) => (
										<UserRow
											key={user._id}
											user={user}
											onEdit={() => handleOpenModal(user)}
											onDelete={() => confirmDelete(user._id)}
										/>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</main>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200">
						<div className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
							<h3 className="text-xl font-bold text-slate-900">{currentUser ? "Edit User Details" : "Register New Account"}</h3>
							<button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded">
								<X size={24} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-8 space-y-8">

							{/* Row 1: Reg No & Name */}
							<div className="grid grid-cols-2 gap-6">
								{/* Increased space-y-3 for a clear vertical gap */}
								<div className="flex flex-col space-y-2">
									<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registration Number</label>
									<div className="relative">
										<Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
										<input
											required
											className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
											value={formData.registerNo}
											onChange={(e) => setFormData({ ...formData, registerNo: e.target.value })}
										/>
									</div>
								</div>
								<div className="flex flex-col space-y-2">
									<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
									<input
										required
										className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									/>
								</div>
							</div>

							{/* Row 2: Email & Phone */}
							<div className="grid grid-cols-2 gap-6">
								<div className="flex flex-col space-y-2">
									<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
									<input
										required
										type="email"
										className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									/>
								</div>
								<div className="flex flex-col space-y-2">
									<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
									<input
										className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									/>
								</div>
							</div>

							{/* Row 3: Dept, Semester, Role */}
							<div className="grid grid-cols-3 gap-6">
								<div className="flex flex-col space-y-2">
									<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
									<input
										required
										className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
										placeholder="e.g. IT"
										value={formData.department}
										onChange={(e) => setFormData({ ...formData, department: e.target.value })}
									/>
								</div>
								<div className="flex flex-col space-y-2">
									<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</label>
									<input
										className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
										placeholder="e.g. 6th"
										value={formData.semester}
										onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
									/>
								</div>
								<div className="flex flex-col space-y-2">
									<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
									<select
										className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
										value={formData.role}
										onChange={(e) => setFormData({ ...formData, role: e.target.value })}
									>
										<option value="student">Student</option>
										<option value="staff">Staff</option>
										<option value="admin">Admin</option>
									</select>
								</div>
							</div>

							{/* Row 4: Password */}
							<div className="flex flex-col space-y-2">
								<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
									Password {currentUser && <span className="text-indigo-500 lowercase font-medium ml-1">(Leave blank to keep current)</span>}
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
									<input
										required={!currentUser}
										type="password"
										className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
										value={formData.password}
										onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									/>
								</div>
							</div>

							{/* Footer Actions */}
							<div className="flex gap-4">
								<button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all">
									Cancel
								</button>
								<button type="submit" className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md">
									{currentUser ? "Update Record" : "Create Account"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Custom Delete Confirmation Modal */}
			{deleteId && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 p-6">
						<div className="flex items-center gap-4 mb-4 text-rose-600">
							<div className="p-3 bg-rose-50 rounded-full">
								<Trash2 size={24} />
							</div>
							<h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
						</div>

						<p className="text-sm text-slate-500 mb-8">
							Are you sure you want to delete this record? This action is permanent and cannot be undone.
						</p>

						<div className="flex gap-3">
							<button
								onClick={() => setDeleteId(null)}
								className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all"
							>
								No, Cancel
							</button>
							<button
								onClick={handleFinalDelete}
								className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all shadow-sm"
							>
								Yes, Delete User
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const UserRow = ({ user, onEdit, onDelete }) => (
	<tr className="hover:bg-slate-50/80 transition-all">
		<td className="px-6 py-5">
			<div className="flex items-center gap-3">
				<div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
					{user.name?.charAt(0)}
				</div>
				<div>
					<div className="font-bold text-slate-900 text-sm leading-none">{user.name}</div>
					<div className="mt-1.5 flex items-center gap-1.5">
						<span className="text-[10px] font-black bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-tight">
							ID : {user.registerNo}
						</span>
					</div>
				</div>
			</div>
		</td>
		<td className="px-6 py-5">
			<div className="space-y-1">
				<div className="flex items-center gap-2 text-slate-600">
					<Mail size={12} /> <span className="text-xs font-medium">{user.email}</span>
				</div>
				{user.phone && (
					<div className="flex items-center gap-2 text-slate-600">
						<Phone size={12} /> <span className="text-xs font-medium">{user.phone}</span>
					</div>
				)}
			</div>
		</td>
		<td className="px-6 py-5">
			<div className="flex flex-col">
				<span className="text-xs font-bold text-slate-800 uppercase">{user.department}</span>
				<span className="text-[11px] text-slate-400 mt-0.15 flex items-center gap-1">
					<BookOpen className="mt-0.5" size={10} /> Sem {user.semester || 'N/A'}
				</span>
			</div>
		</td>
		<td className="px-6 py-5">
			<span className={`inline-flex px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-rose-50 text-rose-700 border-rose-100' :
				user.role === 'staff' ? 'bg-blue-50 text-blue-700 border-blue-100' :
					'bg-emerald-50 text-emerald-700 border-emerald-100'
				}`}>
				{user.role}
			</span>
		</td>
		<td className="px-6 py-5 text-center">
			<div className="flex items-center justify-center gap-2">
				<button onClick={onEdit} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-100 transition-all">
					<Edit3 size={16} />
				</button>
				<button onClick={onDelete} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-all">
					<Trash2 size={16} />
				</button>
			</div>
		</td>
	</tr>
);

export default UserManage;