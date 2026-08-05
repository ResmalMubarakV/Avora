import { Check, ShieldAlert, UserCheck } from "lucide-react";

// ==========================================
// PENDING USERS COMPONENT
// ==========================================
/**
 * Renders the queue of pending user verifications with polished empty states 
 * and action triggers.
 */
const PendingUsers = ({ users = [], onApprove, onSuspend }) => {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        Pending Approvals Queue
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                        Review and verify new user accounts requesting platform access
                    </p>
                </div>
                {users.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-xs">
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
                        Everyone is approved. There are currently no pending user accounts waiting for verification in the queue.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
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
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold shrink-0">
                                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">
                                                    {user.name || user.username}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-slate-600 text-xs font-medium">
                                        {user.email}
                                    </td>
                                    <td className="py-4 pr-4 text-slate-500 text-xs font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onApprove(user._id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer active:scale-95 shadow-xs"
                                            >
                                                <UserCheck size={14} />
                                                <span>Approve</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onSuspend(user._id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer active:scale-95 shadow-xs"
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