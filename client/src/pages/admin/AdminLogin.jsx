import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldAlert, Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";
import PageTitle from "../../components/common/PageTitle";

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
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/api/auth/login", { email, password });
            const data = response.data;

            if (data.user?.role !== "admin") {
                setError("Access denied. Administrator privileges required.");
                setLoading(false);
                return;
            }

            // Save both token and user role to localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.user.role);

            navigate("/admin", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials or server error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <PageTitle title="Avora - Admin Login" />
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] text-white shadow-lg shadow-blue-500/20 mb-4">
                        <Lock size={28} />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Avora Admin
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                        Secure Administration Gateway
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                        <ShieldAlert size={18} className="shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                            Admin Email
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <span>Access Panel</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;