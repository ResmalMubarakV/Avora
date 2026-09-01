import { useState, useMemo } from "react";
import { KeyRound, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff, ShieldAlert, Check, X, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateAdminPassword } from "../../api/adminApi";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// ADMIN SECURITY SETTINGS PAGE
// ==========================================
const AdminSettings = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validations = useMemo(() => {
        return {
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            special: /[^A-Za-z0-9]/.test(newPassword),
        };
    }, [newPassword]);

    const isPasswordStrong = Object.values(validations).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!isPasswordStrong) {
            setError("Please fulfill all high-security password requirements below.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const data = await updateAdminPassword({ currentPassword, newPassword });
            setSuccess(data.message || "Admin master password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password. Please verify your current password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-16 w-full animate-in fade-in duration-300">
            <PageTitle title="Admin Security Settings" />
            
            {/* Top Navigation Header */}
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition w-fit cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    <span>Back to Dashboard</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Security Settings
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Manage your administrator master credentials and account protection.
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Settings Layout (Overview on left, Form on right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                {/* Left Column: Security Overview Card (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/40 text-[#3559D4] dark:text-indigo-400 shrink-0">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Master Protection
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                As an administrator, your account has full root privileges to moderate users, approve travel stories, and manage database records.
                            </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span>End-to-end bcrypt salted hashing</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span>JWT authenticated session tokens</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                <span>Role-based access guard (RBAC)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Change Password Card (8 cols) */}
                <div className="lg:col-span-8">
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 shadow-xs w-full">
                        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                                <KeyRound size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Change Master Password</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Update your password with a strong combination of characters.
                                </p>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 size={16} className="shrink-0" />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/60 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
                                <ShieldAlert size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-3 pl-4 pr-11 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        aria-label={showCurrent ? "Hide current password" : "Show current password"}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                    >
                                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        placeholder="Enter new strong password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-3 pl-4 pr-11 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        aria-label={showNew ? "Hide new password" : "Show new password"}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                    >
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Dynamic Password Strength Checklist */}
                                {newPassword.length > 0 && (
                                    <div className="mt-2.5 flex flex-wrap gap-1.5 animate-in fade-in duration-200">
                                        {[
                                            { label: "8+ chars", valid: validations.length },
                                            { label: "Uppercase", valid: validations.uppercase },
                                            { label: "Lowercase", valid: validations.lowercase },
                                            { label: "Number", valid: validations.number },
                                            { label: "Special char", valid: validations.special },
                                        ].map((rule) => (
                                            <span
                                                key={rule.label}
                                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                                                    rule.valid
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50"
                                                        : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700"
                                                }`}
                                            >
                                                {rule.valid ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                                                {rule.label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-3 pl-4 pr-11 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-3">
                                <button
                                    type="submit"
                                    disabled={loading || !isPasswordStrong || !currentPassword || !confirmPassword}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#3559D4] dark:hover:from-indigo-500 dark:hover:to-blue-500 active:scale-95 cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            <span>Updating Password...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={15} />
                                            <span>Update Password</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;