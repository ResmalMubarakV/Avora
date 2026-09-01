import { useNavigate } from "react-router-dom";
import { Users, Mail, ChevronRight, UserPlus } from "lucide-react";

// ==========================================
// RECENT USERS COMPONENT
// ==========================================
const RecentUsers = ({
    users = [],
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 shadow-xs flex flex-col h-full transition-colors">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 shrink-0">
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                            Recent Signups
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Newly registered platform accounts
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition cursor-pointer"
                >
                    <span>View All</span>
                    <ChevronRight size={14} />
                </button>
            </div>

            {/* Empty State */}
            {users.length === 0 ? (
                <div className="flex flex-1 min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 dark:border-slate-800 text-center px-4 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-2">
                        <Users size={20} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        No Users Found
                    </h4>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        No registered users found.
                    </p>
                </div>
            ) : (
                <div className="space-y-2.5 flex-1">
                    {users.map((user) => {
                        const status = user.status?.toLowerCase();
                        const badgeStyles =
                            status === "approved"
                                ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50"
                                : status === "pending"
                                ? "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50"
                                : "bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-800/50";

                        return (
                            <div
                                key={user._id}
                                onClick={() => navigate(`/admin/users?search=${encodeURIComponent(user.username)}`)}
                                title="Click to view in User Management"
                                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 p-3 transition-all hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xs cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
                                            className="h-10 w-10 shrink-0 rounded-xl object-cover border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                                            draggable={false}
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white font-bold text-xs shadow-2xs">
                                            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    )}
                                    
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate text-xs group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition">
                                                {user.name || user.username}
                                            </h4>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.2 text-[9px] font-semibold capitalize shrink-0 ${badgeStyles}`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {user.status || "Pending"}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-semibold text-[#3559D4] dark:text-indigo-400 truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                                      month: "short",
                                                      day: "numeric",
                                                  })
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentUsers;