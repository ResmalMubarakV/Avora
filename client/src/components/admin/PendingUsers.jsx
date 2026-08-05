import { UserCheck, UserX, Clock3, Mail, Sparkles } from "lucide-react";

// ==========================================
// PENDING USERS COMPONENT
// ==========================================
/**
 * Renders a list of pending user accounts awaiting administrator approval,
 * complete with empty states and action handlers for approval or suspension.
 */
const PendingUsers = ({
    users = [],
    onApprove = () => {},
    onSuspend = () => {},
}) => {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Pending Approvals
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Users waiting for administrator review and approval.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-amber-50 border border-amber-200/60 px-3.5 py-1 text-xs font-semibold text-amber-800">
                    <Sparkles size={13} className="text-amber-600" />
                    <span>{users.length} Pending Review</span>
                </div>
            </div>

            {/* Empty State */}
            {users.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-center px-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
                        <Clock3 size={28} strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                        No Pending Users
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                        Every registered user account has already been reviewed and processed.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
                        >
                            {/* User Details */}
                            <div className="flex items-center gap-4 min-w-0">
                                <img
                                    src={
                                        user.profileImage ||
                                        "https://placehold.co/80x80/e2e8f0/475569?text=User"
                                    }
                                    alt={user.name}
                                    className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl object-cover border border-slate-200 shadow-sm"
                                    draggable={false}
                                />

                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-slate-900 truncate">
                                        {user.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm font-semibold text-[#3559D4] truncate">
                                        @{user.username}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500 truncate flex items-center gap-1">
                                        <Mail size={12} className="shrink-0 text-slate-400" />
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2.5 self-end lg:self-auto">
                                <button
                                    type="button"
                                    onClick={() => onApprove(user._id)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 cursor-pointer"
                                >
                                    <UserCheck size={16} />
                                    <span>Approve</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onSuspend(user._id)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 hover:border-red-300 active:scale-95 cursor-pointer"
                                >
                                    <UserX size={16} />
                                    <span>Reject / Suspend</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingUsers;