import { Users, UserCheck, Clock, Images, ArrowUpRight } from "lucide-react";

// ==========================================
// DASHBOARD STATS COMPONENT
// ==========================================
const DashboardStats = ({
    totalUsers = 0,
    pendingUsers = 0,
    approvedUsers = 0,
    totalMemories = 0,
    onCardClick = () => {},
}) => {
    const stats = [
        {
            key: "all-users",
            label: "Total Registered Users",
            value: totalUsers,
            badge: "All Accounts",
            icon: Users,
            color: "blue",
            iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-100 dark:border-blue-800/40",
            hoverBorder: "hover:border-blue-500/40 dark:hover:border-blue-500/30",
            hoverGlow: "group-hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]",
        },
        {
            key: "pending",
            label: "Pending Approvals",
            value: pendingUsers,
            badge: pendingUsers > 0 ? "Action Required" : "Up to Date",
            icon: Clock,
            color: "amber",
            isUrgent: pendingUsers > 0,
            iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-800/40",
            hoverBorder: "hover:border-amber-500/40 dark:hover:border-amber-500/30",
            hoverGlow: "group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]",
        },
        {
            key: "approved",
            label: "Active Platform Users",
            value: approvedUsers,
            badge: "Verified",
            icon: UserCheck,
            color: "emerald",
            iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40",
            hoverBorder: "hover:border-emerald-500/40 dark:hover:border-emerald-500/30",
            hoverGlow: "group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]",
        },
        {
            key: "memories",
            label: "Travel Memories",
            value: totalMemories,
            badge: "Published",
            icon: Images,
            color: "indigo",
            iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/40",
            hoverBorder: "hover:border-indigo-500/40 dark:hover:border-indigo-500/30",
            hoverGlow: "group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.key}
                        onClick={() => onCardClick(stat.key)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && onCardClick(stat.key)}
                        className={`
                            group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 
                            bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 ease-out 
                            hover:-translate-y-0.5 cursor-pointer shadow-xs ${stat.hoverBorder} ${stat.hoverGlow}
                        `}
                    >
                        {/* Top Row: Icon & Status Badge */}
                        <div className="flex items-center justify-between mb-4">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${stat.iconBg} shadow-2xs`}>
                                <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                            </div>

                            <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    stat.isUrgent
                                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50"
                                        : "bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/60"
                                }`}>
                                    {stat.isUrgent && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                    {stat.badge}
                                </span>
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                                    <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </div>

                        {/* Bottom Row: Number & Label */}
                        <div className="space-y-1">
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                {stat.value.toLocaleString()}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardStats;