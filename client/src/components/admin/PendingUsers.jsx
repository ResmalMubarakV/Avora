import { Check, ShieldAlert, UserCheck, ExternalLink } from "lucide-react";

// ==========================================
// PENDING USERS COMPONENT
// ==========================================
const PendingUsers = ({ users = [], onApprove, onSuspend }) => {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        Pending Approvals Queue
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                        Review and verify new user accounts requesting platform access
                    </p>
                </div>
                {users.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-xs self-start sm:self-auto">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        {users.length} Pending Review{users.length === 1 ? "" : "s"}
                    </span>
                )}
            </div>

            {/* List or Polished Empty State */}
            {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-3 shadow-inner">
                        <Check size={26} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                        All Caught Up!
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                        Everyone is approved. There are currently no pending user accounts waiting for verification.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <th className="pb-3 font-bold">User Details</th>
                                <th className="pb-3 font-bold">Email</th>
                                <th className="pb-3 font-bold">Joined Date</th>
                                <th className="pb-3 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {users.map((user) => (
                                <tr key={user._id} className="group hover:bg-slate-50/50 transition">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3 min-w-[180px]">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold shrink-0">
                                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 leading-tight truncate">
                                                    {user.name || user.username}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-slate-600 text-xs font-medium truncate max-w-[200px]">
                                        {user.email}
                                    </td>
                                    <td className="py-4 pr-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2">
                                            {/* Profile Link Button */}
                                            <button
                                                type="button"
                                                onClick={() => window.open(`/${user.username}`, "_blank")}
                                                title="View Profile"
                                                className="inline-flex items-center gap-1 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer active:scale-95 shadow-xs"
                                            >
                                                <ExternalLink size={14} />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onApprove(user._id)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer active:scale-95 shadow-xs"
                                            >
                                                <UserCheck size={14} />
                                                <span>Approve</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onSuspend(user._id)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer active:scale-95 shadow-xs"
                                            >
                                                <ShieldAlert size={14} />
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