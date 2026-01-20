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

	// Handle header shadow on scroll
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
		{ name: 'Tracking', path: '/tracking', icon: <Search size={20} /> },
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
						onClick={() => navigate('/login')}
						className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-indigo-300 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold group"
					>
						<LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
						<span>Terminate Session</span>
					</button>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0 relative">

				{/* TOP NAVBAR: Adaptive Design */}
				<header className={`
					h-20 flex items-center justify-between px-6 lg:px-10 z-30 transition-all duration-300
					${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm' : 'bg-transparent'}
				`}>
					<div className="flex items-center gap-5">
						<button
							className="lg:hidden p-3 text-slate-600 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
							onClick={() => setIsMobileMenuOpen(true)}
						>
							<Menu size={20} />
						</button>

						<div className="hidden sm:block">
							<h1 className="text-xl font-black text-slate-900 tracking-tight">{getPageTitle()}</h1>
							<div className="flex items-center gap-2 mt-0.5">
								<div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
								<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live System Portal</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4 md:gap-8">
						{/* Elegant Search Input */}
						<div className="hidden md:flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-2.5 w-80 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500 transition-all duration-300 shadow-sm shadow-slate-200/50">
							<SearchIcon size={16} className="text-slate-400" />
							<input type="text" placeholder="Search for tickets, help..." className="bg-transparent border-none focus:ring-0 text-sm w-full ml-3 text-slate-800 font-medium" />
						</div>

						<div className="flex items-center gap-2">
							<button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all relative border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
								<Bell size={20} />
								<span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white"></span>
							</button>
							<button className="hidden sm:block p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100">
								<Settings size={20} />
							</button>
						</div>

						<div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>

						{/* Profile Action Area */}
						<div className="flex items-center gap-3.5 pl-2 group cursor-pointer">
							<div className="hidden lg:block text-right">
								<p className="text-sm font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">Alex Rivera</p>
								<p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Computer Science Dept</p>
							</div>
							<div className="h-12 w-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-white border-2 border-white shadow-md group-hover:shadow-indigo-100 group-hover:border-indigo-500 transition-all flex items-center justify-center text-indigo-600 overflow-hidden">
								<UserCircle size={32} strokeWidth={1.5} />
							</div>
						</div>
					</div>
				</header>

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