import { useState, useMemo } from "react";
import { KeyRound, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff, ShieldAlert, Check, X } from "lucide-react";
import { updateAdminPassword } from "../../api/adminApi";
import PageTitle from "../../components/common/PageTitle";

const AdminSettings = () => {
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
            setSuccess(data.message || "Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password. Please check your current password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* w-full and space-y ensure full fluid layout alignment across all display resolutions */
        <div className="space-y-6 sm:space-y-8 pb-16 w-full pt-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <PageTitle title="Admin Security Settings" />
            <div>
                <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-slate-900">
                    Admin Security Settings
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Manage your administrator credentials and account security.
                </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 2xl:p-10 shadow-sm w-full">
                <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-slate-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-[#3559D4] shrink-0">
                        <KeyRound size={24} />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">Change Password</h2>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">
                            Ensure your account uses an enterprise-grade secure password.
                        </p>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-xs sm:text-sm font-semibold text-emerald-700">
                        <CheckCircle2 size={18} className="shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-xs sm:text-sm font-semibold text-red-600">
                        <ShieldAlert size={18} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                aria-label={showCurrent ? "Hide current password" : "Show current password"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="Enter secure new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                aria-label={showNew ? "Hide new password" : "Show new password"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            >
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading || !isPasswordStrong}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#1E3A8A] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#3559D4] active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={16} />
                                    <span>Update Password</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;