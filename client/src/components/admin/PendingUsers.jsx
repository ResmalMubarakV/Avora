import { Check, ShieldAlert, UserCheck, ExternalLink, Clock } from "lucide-react";

// ==========================================
// PENDING USERS COMPONENT
// ==========================================
const PendingUsers = ({ users = [], onApprove, onSuspend }) => {
    return (
        <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 shadow-xs transition-colors">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                Pending Approvals Queue
                            </h3>
                            {users.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    {users.length} New
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Verify new traveler accounts requesting platform access
                        </p>
                    </div>
                </div>
            </div>

            {/* List or Compact Polished Empty State */}
            {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200/80 dark:border-slate-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 mb-2">
                        <Check size={20} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        All Caught Up!
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        No pending user accounts waiting for review.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
                    <table className="w-full text-left border-collapse min-w-[550px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                <th className="pb-2.5 font-bold">User</th>
                                <th className="pb-2.5 font-bold">Email</th>
                                <th className="pb-2.5 font-bold">Joined</th>
                                <th className="pb-2.5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                            {users.map((user) => (
                                <tr key={user._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-2.5 min-w-[150px]">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white font-bold text-xs shrink-0 shadow-2xs">
                                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 dark:text-white leading-tight truncate">
                                                    {user.name || user.username}
                                                </p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[180px]">
                                        {user.email}
                                    </td>
                                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="py-3 text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => window.open(`/${user.username}`, "_blank", "noopener,noreferrer")}
                                                title="View Profile"
                                                className="inline-flex items-center gap-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95"
                                            >
                                                <ExternalLink size={12} />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onApprove(user._id)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer active:scale-95"
                                            >
                                                <UserCheck size={12} />
                                                <span>Approve</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onSuspend(user._id)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 px-2.5 py-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer active:scale-95"
                                            >
                                                <ShieldAlert size={12} />
                                                <span>Suspend</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PendingUsers;