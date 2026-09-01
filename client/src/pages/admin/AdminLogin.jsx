import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldAlert, Eye, EyeOff, ShieldCheck } from "lucide-react";
import api from "../../api/axios";
import PageTitle from "../../components/common/PageTitle";
import Logo from "../../components/common/Logo";

// ==========================================
// ADMIN LOGIN PAGE COMPONENT
// ==========================================
const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter your administrator email and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/api/auth/login", { email, password });
            const data = response.data;

            if (data.user?.role !== "admin") {
                setError("Access denied. Administrator privileges are required to access this portal.");
                setLoading(false);
                return;
            }

            // Save token and user role
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.user.role);

            navigate("/admin", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials or unauthorized access.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 relative overflow-hidden transition-colors duration-300">
            <PageTitle title="Admin Portal Login" />
            
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(30,58,138,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Header with Logo */}
                <div className="text-center mb-7">
                    <div className="inline-flex justify-center mb-4">
                        <Logo to="/" size="lg" />
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-800/50 text-[#3559D4] dark:text-blue-400 text-xs font-bold mb-2">
                        <ShieldCheck size={14} />
                        <span>Enterprise Control Portal</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sign in with your master credentials to manage the platform
                    </p>
                </div>

                {error && (
                    <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/60 p-3.5 text-xs font-semibold text-red-700 dark:text-red-300">
                        <ShieldAlert size={16} className="shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Admin Email */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                            Administrator Email
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-3 pl-9 pr-4 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                            Master Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-3 pl-9 pr-11 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] dark:from-indigo-600 dark:to-blue-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#1E3A8A]/20 transition hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <span>Access Control Panel</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;