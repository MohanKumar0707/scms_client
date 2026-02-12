import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FilePlus, Search, LogOut,
    UserCircle, GraduationCap, ChevronRight, Menu, Bell,
    Settings, Sparkles, MessageSquare, ClipboardList, 
    CheckCircle2, Building2, ShieldCheck, BarChart3, ListChecks
} from 'lucide-react';

function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve the role from sessionStorage
    const userRole = sessionStorage.getItem("role") || "student"; 

    useEffect(() => {
        const handleScroll = (e) => {
            // Optional scroll logic
        };
        document.getElementById('main-viewport')?.addEventListener('scroll', handleScroll);
        return () => document.getElementById('main-viewport')?.removeEventListener('scroll', handleScroll);
    }, []);

    // Define all possible menu items organized by role
    const roleMenus = {
        student: [
            {
                group: "Student Services",
                items: [
                    { name: 'Dashboard', path: '/layout/dashboard', icon: <LayoutDashboard size={20} /> },
                    { name: 'Raise Complaint', path: '/layout/raise-complaint', icon: <FilePlus size={20} /> },
                    { name: 'My Complaints', path: '/layout/my-complaints', icon: <ListChecks size={20} /> },
                    { name: 'Notifications', path: '/layout/notifications', icon: <Bell size={20} /> },
                    { name: 'Feedback', path: '/layout/feedback', icon: <MessageSquare size={20} /> },
                ]
            }
        ],
        staff: [
            {
                group: "Staff Operations",
                items: [
                    { name: 'Dashboard', path: '/layout/dashboard', icon: <LayoutDashboard size={20} /> },
                    { name: 'Assigned Complaints', path: '/layout/assigned', icon: <UserCircle size={20} /> },
                    { name: 'Update Status', path: '/layout/update-status', icon: <Settings size={20} /> },
                    { name: 'Completed Complaints', path: '/layout/completed', icon: <CheckCircle2 size={20} /> },
                ]
            }
        ],
        admin: [
            {
                group: "System Administration",
                items: [
                    { name: 'Dashboard', path: '/layout/dashboard', icon: <LayoutDashboard size={20} /> },
                    { name: 'Users', path: '/layout/userManagement', icon: <UserCircle size={20} /> },
                    { name: 'Departments', path: '/layout/departments', icon: <Building2 size={20} /> },
                    { name: 'Complaints', path: '/layout/complaints-list', icon: <ClipboardList size={20} /> },
                    { name: 'Assign Complaints', path: '/layout/assign-complaints', icon: <ChevronRight size={20} /> },
                    { name: 'Reports', path: '/layout/reports', icon: <BarChart3 size={20} /> },
                    { name: 'Audit Logs', path: '/layout/audit-logs', icon: <ShieldCheck size={20} /> },
                ]
            }
        ]
    };

    // Select the menu based on the current user's role
    const menuSections = roleMenus[userRole] || roleMenus['student'];

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
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

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-78 bg-indigo-950 text-white flex flex-col transition-all duration-500 ease-in-out
                lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />

                {/* Brand Header */}
                <div className="h-24 flex items-center px-8 relative z-10">
                    <div className="flex items-center gap-3.5 group cursor-pointer">
                        <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight block leading-none">UNISERVE</span>
                            <span className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">{userRole} Portal</span>
                        </div>
                    </div>
                </div>

                {/* Navigation - Filtered by Role */}
                <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto relative z-10 custom-scrollbar">
                    {menuSections.map((section) => (
                        <div key={section.group}>
                            <p className="px-4 text-[11px] font-black text-indigo-500/70 uppercase tracking-[0.15em] mb-4">
                                {section.group}
                            </p>
                            <div className="space-y-1.5">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `
                                            group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300
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
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-indigo-300 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                <main id="main-viewport" className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    <div className="max-w-[1400px] mx-auto">
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