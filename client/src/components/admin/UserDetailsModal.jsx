import { useState } from "react";
import {
    X,
    User,
    Mail,
    AtSign,
    Calendar,
    Clock,
    UserCheck,
    ShieldAlert,
    Copy,
    Check,
    Loader2,
    Shield,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// ==========================================
// USER SIGNUP DETAILS MODAL (FOR ADMIN REVIEW)
// ==========================================
const UserDetailsModal = ({
    user,
    open,
    onClose,
    onApprove,
    onSuspend,
}) => {
    const [actionLoading, setActionLoading] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    if (!open || !user) return null;

    const status = user.status?.toLowerCase() || "pending";
    const isPending = status === "pending";
    const isApproved = status === "approved";
    const isSuspended = status === "suspended";

    const handleCopy = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`Copied ${field} to clipboard`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleApproveClick = async () => {
        if (!onApprove) return;
        try {
            setActionLoading(true);
            await onApprove(user._id);
            toast.success(`Account for @${user.username} approved!`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to approve account.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSuspendClick = async () => {
        if (!onSuspend) return;
        try {
            setActionLoading(true);
            await onSuspend(user._id);
            toast.success(`Account for @${user.username} suspended.`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to suspend account.");
        } finally {
            setActionLoading(false);
        }
    };

    const formattedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "N/A";

    const formattedTime = user.createdAt
        ? new Date(user.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 dark:bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Accent Header Bar */}
                <div
                    className={`h-2 w-full ${
                        isPending
                            ? "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"
                            : isApproved
                            ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"
                            : "bg-gradient-to-r from-red-500 via-rose-500 to-red-600"
                    }`}
                />

                <div className="p-6 sm:p-7 space-y-6">
                    {/* Header with Title and Close Button */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                                    isPending
                                        ? "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400"
                                        : isApproved
                                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400"
                                        : "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
                                } shadow-inner`}
                            >
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                    Traveler Registration Details
                                </h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Credentials submitted during account signup
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={actionLoading}
                            aria-label="Close modal"
                            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* User Identity Highlight Card */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 flex items-center gap-4">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name || user.username}
                                className="h-16 w-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
                            />
                        ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white font-extrabold text-2xl shadow-md">
                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                                    {user.name || user.username}
                                </h4>
                                <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                        isPending
                                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50"
                                            : isApproved
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50"
                                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/50"
                                    }`}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {isPending ? "Pending Approval" : user.status}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-[#3559D4] dark:text-indigo-400">
                                @{user.username}
                            </p>
                        </div>
                    </div>

                    {/* Detailed Signup Fields Grid */}
                    <div className="space-y-3">
                        {/* Full Name */}
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/30">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#3559D4] dark:text-indigo-400 shrink-0">
                                    <User size={15} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Full Name
                                    </p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {user.name || "Not provided"}
                                    </p>
                                </div>
                            </div>
                            {user.name && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(user.name, "name")}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                    title="Copy Name"
                                >
                                    {copiedField === "name" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                </button>
                            )}
                        </div>

                        {/* Username */}
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/30">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
                                    <AtSign size={15} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Username
                                    </p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        @{user.username}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleCopy(user.username, "username")}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                title="Copy Username"
                            >
                                {copiedField === "username" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                            </button>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/30">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 shrink-0">
                                    <Mail size={15} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Email Address
                                    </p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleCopy(user.email, "email")}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                title="Copy Email"
                            >
                                {copiedField === "email" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                            </button>
                        </div>

                        {/* Joined Date & Time */}
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/30">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <Calendar size={15} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Registration Date & Time
                                    </p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {formattedDate} {formattedTime && `at ${formattedTime}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                <Clock size={13} />
                            </div>
                        </div>
                    </div>

                    {/* Pending Advice Callout */}
                    {isPending && (
                        <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/40 p-3.5 flex items-start gap-2.5">
                            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                                This traveler cannot log in or view memory journals until an administrator approves their profile. Review credentials and approve below.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={actionLoading}
                            className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                            Close
                        </button>

                        {!isSuspended && onSuspend && (
                            <button
                                type="button"
                                onClick={handleSuspendClick}
                                disabled={actionLoading}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/50 px-4 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                                <ShieldAlert size={14} />
                                <span>Suspend Account</span>
                            </button>
                        )}

                        {!isApproved && onApprove && (
                            <button
                                type="button"
                                onClick={handleApproveClick}
                                disabled={actionLoading}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Approving...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserCheck size={14} />
                                        <span>Approve Account</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
