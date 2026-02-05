import React, { useState } from "react";
import { Eye, EyeOff, GraduationCap, ArrowRight, ShieldCheck, HelpCircle, Lock } from "lucide-react";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">

                {/* LEFT PANEL - Now occupies exactly 50% width and 100% height */}
                <div className="bg-indigo-950 p-10 md:p-16 text-white flex flex-col justify-between relative">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                        <svg width="300" height="300" viewBox="0 0 200 200" fill="none">
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
                        
                        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 mt-44">
                            Resolve
                            <span className="text-indigo-400"> with Ease.</span>
                        </h1>
                        <p className="text-indigo-200/60 text-lg max-w-md font-medium leading-relaxed">
                            The official centralized hub for students to voice concerns and track resolution progress in real-time.
                        </p>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-4">
                        <div className="bg-white/5 p-2 rounded-lg">
                            <ShieldCheck size={20} className="text-indigo-400" />
                        </div>
                        <span className="text-xs uppercase font-bold tracking-[0.2em] text-indigo-300">
                            Secure Student Authentication
                        </span>
                    </div>
                </div>

                {/* RIGHT PANEL - Flattened Form (50% Width / 100% Height) */}
                <form 
                    onSubmit={handleLogin}
                    className="p-10 md:p-20 flex flex-col justify-center bg-white h-full"
                >
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Portal Login</h2>
                            <p className="text-slate-400 font-medium">Please enter your institutional credentials.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                                    Student ID / Registration
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="2024-EDU-0123"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-sm font-semibold"
                                />
                            </div>

                            <div className="group">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                                    Security Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-sm font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-3 text-sm text-slate-500 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
                                    <span className="group-hover:text-slate-700 transition-colors">Remember this session</span>
                                </label>
                                <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-70 shadow-xl shadow-indigo-100"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Authorize & Access
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100 flex justify-center gap-10">
                            <button type="button" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
                                <HelpCircle size={16} /> Help Desk
                            </button>
                            <button type="button" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
                                <Lock size={16} /> Privacy Policy
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Login;