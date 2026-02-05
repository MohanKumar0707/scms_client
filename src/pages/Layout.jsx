import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
	LayoutDashboard, FilePlus, Search, LogOut,
	UserCircle, GraduationCap, ChevronRight, Menu, Bell,
	Search as SearchIcon, X, Settings, Sparkles
} from 'lucide-react';

function Layout() {

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const handleScroll = (e) => {
			setIsScrolled(e.target.scrollTop > 10);
		};
		document.getElementById('main-viewport')?.addEventListener('scroll', handleScroll);
		return () => document.getElementById('main-viewport')?.removeEventListener('scroll', handleScroll);
	}, []); 

	const navItems = [
		{ name: 'Dashboard', path: '/layout/dashboard', icon: <LayoutDashboard size={20} /> },
		{ name: 'User Management', path: '/layout/userManagement', icon: <UserCircle size={20} /> },
		{ name: 'Complaint', path: '/layout/complaint', icon: <UserCircle size={20} /> },
		{ name: 'Tracking', path: '/layout/track', icon: <Search size={20} /> },
	];

	const getPageTitle = () => {
		const current = navItems.find(item => item.path === location.pathname);
		return current ? current.name : 'Overview';
	};

	return (
		<div className="flex h-screen bg-[#F1F5F9] text-slate-900 font-sans overflow-hidden">

			{/* Mobile Sidebar Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-indigo-950/60 backdrop-blur-md z-40 lg:hidden transition-all duration-500"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* SIDEBAR: Ultra-Modern Gradient & Glass */}
			<aside className={`
				fixed inset-y-0 left-0 z-50 w-78 bg-indigo-950 text-white flex flex-col transition-all duration-500 ease-in-out
				lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
			`}>
				{/* Decorative Background Glow for Sidebar */}
				<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />

				{/* Brand Header */}
				<div className="h-24 flex items-center px-8 relative z-10">
					<div className="flex items-center gap-3.5 group cursor-pointer">
						<div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-300">
							<GraduationCap size={24} className="text-white" />
						</div>
						<div>
							<span className="text-xl font-black tracking-tight block leading-none">UNISERVE</span>
							<span className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Student Portal</span>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto relative z-10">
					<p className="px-4 text-[11px] font-black text-indigo-500/70 uppercase tracking-[0.15em] mb-6 mt-4">Management</p>

					{navItems.map((item) => (
						<NavLink
							key={item.name}
							to={item.path}
							onClick={() => setIsMobileMenuOpen(false)}
							className={({ isActive }) => `
								group relative flex items-center gap-3.5 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300
								${isActive
													? 'bg-white/10 text-white border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md'
													: 'text-indigo-200/50 hover:text-white hover:bg-white/5'}
							`}
						>
							{location.pathname === item.path && (
								<div className="absolute left-0 w-1.5 h-6 bg-indigo-400 rounded-r-full shadow-[4px_0_12px_rgba(129,140,248,0.6)]" />
							)}
							<span className={`${location.pathname === item.path ? 'text-indigo-400' : 'text-indigo-500/60 group-hover:text-indigo-300'} transition-colors`}>
								{item.icon}
							</span>
							{item.name}
						</NavLink>
					))}
				</nav>

				{/* Sidebar Footer Card */}
				<div className="p-6 mt-auto">
					<div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6 backdrop-blur-sm">
						<div className="flex items-center gap-2 mb-2">
							<Sparkles size={14} className="text-indigo-400" />
							<span className="text-[11px] font-bold text-indigo-100">Quick Resolution</span>
						</div>
						<p className="text-[10px] text-indigo-200/60 leading-relaxed mb-3">
							Most complaints are resolved within 48 hours.
						</p>
						<button className="w-full py-2 bg-indigo-600/40 hover:bg-indigo-600 text-[11px] font-bold rounded-xl transition-all border border-indigo-400/20">
							View Stats
						</button>
					</div>

					<button
						onClick={() => navigate('/')}
						className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-indigo-300 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold group"
					>
						<LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
						<span>Terminate Session</span>
					</button>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0 relative">

				{/* CONTENT VIEWPORT: Smooth Scrolling & Dynamic Spacing */}
				<main id="main-viewport" className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
					<div className="max-w-[1400px] mx-auto">
						{/* Content Injection Area */}
						<div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default Layout;