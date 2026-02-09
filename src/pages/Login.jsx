import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, ArrowRight, ShieldCheck, HelpCircle, Lock, UserPlus, ArrowLeft, Mail, Phone, BookOpen, User } from "lucide-react";

function AuthPortal() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);

        const payload = {
            registerNo: formData.get("registerNo"),
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            department: formData.get("department"),
            password: formData.get("password"),
            role: "student"
        };

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
            } else {
                alert("Registration successful!");
                setIsLogin(true);
            }
        } catch (err) {
            alert("Server error");
        } finally {
            setIsLoading(false);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);

        const payload = {
            registerNo: formData.get("registerNo"),
            password: formData.get("password")
        };

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
            } else {
                // STORE IN SESSION STORAGE
                sessionStorage.setItem("name", data.user.name);
                sessionStorage.setItem("phone", data.user.phone);
                sessionStorage.setItem("role", data.user.role);

                alert("Login successful");

                // example redirect
                navigate("/layout/dashboard");
            }
        } catch (err) {
            alert("Server error");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-white">
            <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">

                {/* LEFT PANEL */}
                <div className="bg-indigo-950 p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                        <svg width="400" height="400" viewBox="0 0 200 200" fill="none">
                            <circle cx="150" cy="50" r="100" stroke="white" strokeWidth="2" />
                            <circle cx="150" cy="50" r="70" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="bg-indigo-500 p-2.5 rounded-2xl">
                                <GraduationCap size={28} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">UniServe</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 mt-20 md:mt-32 transition-all duration-500">
                            {isLogin ? "Resolve" : "Join the"}
                            <span className="text-indigo-400"> {isLogin ? "with Ease." : "Community."}</span>
                        </h1>
                        <p className="text-indigo-200/60 text-lg max-w-md font-medium leading-relaxed">
                            {isLogin
                                ? "The official centralized hub for students to voice concerns and track resolution progress in real-time."
                                : "Create your account to start submitting requests, tracking progress, and improving campus life."}
                        </p>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-4">
                        <div className="bg-white/5 p-2 rounded-lg">
                            <ShieldCheck size={20} className="text-indigo-400" />
                        </div>
                        <span className="text-xs uppercase font-bold tracking-[0.2em] text-indigo-300">
                            Verified Institutional Access
                        </span>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="p-10 md:p-16 flex flex-col justify-center bg-white h-full relative">
                    <div className="max-w-lg mx-auto w-full">

                        {isLogin ? (
                            /* LOGIN FORM */
                            <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Portal Login</h2>
                                    <p className="text-slate-400 font-medium">Please enter your institutional credentials.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="group">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Student ID</label>
                                        <input type="text" name="registerNo" required placeholder="2024-EDU-0123" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-sm font-semibold" />
                                    </div>

                                    <div className="group">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Security Password</label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-sm font-semibold" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] shadow-xl shadow-indigo-100 mt-4">
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Authorize & Access <ArrowRight size={20} /></>}
                                    </button>

                                    <div className="relative flex items-center py-4">
                                        <div className="flex-grow border-t border-slate-100"></div>
                                        <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest">New Student?</span>
                                        <div className="flex-grow border-t border-slate-100"></div>
                                    </div>

                                    <button type="button" onClick={() => setIsLogin(false)} className="w-full bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
                                        <UserPlus size={18} className="text-indigo-500" />
                                        Create New Account
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* UPDATED REGISTRATION FORM */
                            <form onSubmit={handleRegister} className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <button type="button" onClick={() => setIsLogin(true)} className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-6 hover:translate-x-[-4px] transition-transform">
                                    <ArrowLeft size={18} /> Back to Login
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
                                    <p className="text-slate-400 font-medium text-sm">Fill in your details to get started.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Full Name Field */}
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Register number</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input type="text" name="registerNo" required placeholder="2024-EDU-0123" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none text-sm font-semibold" />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input type="text" name="name" required placeholder="John Doe" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none text-sm font-semibold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Email Field */}
                                        <div className="group">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input type="email" name="email" required placeholder="john@uni.edu" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none text-sm font-semibold" />
                                            </div>
                                        </div>
                                        {/* Phone Field */}
                                        <div className="group">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input type="tel" name="phone" required placeholder="+1 (555) 000-0000" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none text-sm font-semibold" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Department Dropdown */}
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Department</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <select name="department" required className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none text-sm font-semibold appearance-none cursor-pointer">
                                                <option value="">Select Department</option>
                                                <option value="cs">Computer Science & Engineering</option>
                                                <option value="ee">Electrical Engineering</option>
                                                <option value="me">Mechanical Engineering</option>
                                                <option value="ba">Business Administration</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Create Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input type="password" name="password"
                                                required placeholder="••••••••" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none text-sm font-semibold" />
                                        </div>
                                    </div>

                                    <button disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] shadow-xl shadow-indigo-100 mt-2">
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Register Account <ArrowRight size={20} /></>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* FOOTER */}
                        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center gap-10">
                            <button type="button" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
                                <HelpCircle size={16} /> Help Desk
                            </button>
                            <button type="button" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
                                <Lock size={16} /> Privacy Policy
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AuthPortal;