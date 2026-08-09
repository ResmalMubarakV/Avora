import { useNavigate } from "react-router-dom";
import { Users, Mail, Sparkles, ChevronRight } from "lucide-react";

// ==========================================
// RECENT USERS COMPONENT
// ==========================================
const RecentUsers = ({
    users = [],
}) => {
    const navigate = useNavigate();

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col h-full">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Recent Users
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Newly registered users across the platform.
                    </p>
                </div>
                <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Sparkles size={16} />
                </div>
            </div>

            {/* Empty State */}
            {users.length === 0 ? (
                <div className="flex flex-1 h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-center px-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
                        <Users size={28} strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                        No Users Found
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                        There are no user accounts registered in the system yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 flex-1">
                    {users.map((user) => {
                        const status = user.status?.toLowerCase();
                        const badgeStyles =
                            status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                : status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                : "bg-red-50 text-red-700 border-red-200/60";

                        return (
                            <div
                                key={user._id}
                                onClick={() => navigate(`/admin/users?search=${encodeURIComponent(user.username)}`)}
                                title="Click to view user in User Management"
                                className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-300 hover:shadow-md cursor-pointer"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <img
                                        src={
                                            user.profileImage ||
                                            "https://placehold.co/80x80/e2e8f0/475569?text=User"
                                        }
                                        alt={user.name}
                                        className="h-11 w-11 shrink-0 rounded-full object-cover border border-slate-200 shadow-sm"
                                        draggable={false}
                                    />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 truncate text-sm group-hover:text-blue-600 transition">
                                                {user.name}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${badgeStyles}`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {user.status || "Unknown"}
                                            </span>
                                        </div>
                                        <p className="text-xs font-semibold text-[#3559D4] truncate">
                                            @{user.username}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                            <Mail size={11} className="shrink-0 text-slate-400" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Joined</p>
                                        <p className="text-xs font-semibold text-slate-700">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                                      month: "short",
                                                      day: "numeric",
                                                      year: "numeric",
                                                  })
                                                : "N/A"}
                                        </p>
                                    </div>

                                    {/* Action button leading to admin users page */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/admin/users?search=${encodeURIComponent(user.username)}`);
                                        }}
                                        title="Manage User in Admin Panel"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95"
                                    >
                                        <span className="hidden sm:inline">Manage</span>
                                        <ChevronRight size={14} className="text-slate-400" />
                                    </button>
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