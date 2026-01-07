import React, { useState } from "react";
import { Eye, EyeOff, GraduationCap, ArrowRight, ShieldCheck, HelpCircle, Lock } from "lucide-react";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate a brief delay
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            {/* Main Card */}
            <div className="w-full max-w-[900px] flex flex-col md:flex-row bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">

                {/* LEFT PANEL: Professional Branding */}
                <div className="w-full md:w-[45%] bg-indigo-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="150" cy="50" r="100" stroke="white" strokeWidth="2" />
                            <circle cx="150" cy="50" r="70" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2.5 mb-10">
                            <div className="bg-indigo-500 p-2 rounded-xl">
                                <GraduationCap size={22} className="text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">UniServe</span>
                        </div>

                        <h1 className="text-3xl font-extrabold leading-tight mb-4 tracking-tight">
                            Resolve <br />
                            <span className="text-indigo-400">with Ease.</span>
                        </h1>
                        <p className="text-indigo-200/70 text-sm leading-relaxed font-medium">
                            A centralized hub for students to voice concerns and track resolutions in real-time.
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <ShieldCheck size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-[11px] text-indigo-200 uppercase font-bold tracking-widest">
                            Secure Campus Access
                        </span>
                    </div>
                </div>

                {/* RIGHT PANEL: Refined Login */}
                <div className="w-full md:w-[55%] bg-white p-10 md:p-14 flex items-center">
                    <div className="w-full">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portal Login</h2>
                            <p className="text-slate-400 text-sm mt-1 font-medium">Please enter your student credentials.</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2 tracking-wider ml-1">
                                    Student ID / Registration
                                </label>
                                <div className="group relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="2024-EDU-0123"
                                        className="w-full mt-2 px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2 tracking-wider ml-1">
                                    Security Password
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full mt-2 px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-0 cursor-pointer" />
                                    <span className="text-xs text-slate-500 font-semibold group-hover:text-slate-700 transition-colors">Remember device</span>
                                </label>
                                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    Recovery Access
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full mt-8 ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-4`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Authorize & Enter
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-5 pt-8 border-t border-slate-50 flex items-center justify-center gap-8">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-[11px] font-bold uppercase tracking-widest">
                                <HelpCircle size={14} /> Support
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-[11px] font-bold uppercase tracking-widest">
                                <Lock size={14} /> Privacy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;