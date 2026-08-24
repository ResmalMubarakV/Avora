import { Users, UserCheck, Clock, Images, ArrowUpRight, TrendingUp } from "lucide-react";

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
            label: "Total Users",
            value: totalUsers,
            trend: "+12%",
            icon: <Users size={18} className="text-blue-600" />,
            bgGradient: "from-blue-600/10 to-transparent",
            borderColor: "border-slate-200/80 hover:border-blue-500/30",
            iconBg: "bg-blue-50 border-blue-100",
            textColor: "text-blue-600",
        },
        {
            key: "pending",
            label: "Pending",
            value: pendingUsers,
            trend: "Action",
            icon: <Clock size={18} className="text-amber-600" />,
            bgGradient: "from-amber-500/10 to-transparent",
            borderColor: "border-slate-200/80 hover:border-amber-500/30",
            iconBg: "bg-amber-50 border-amber-100",
            textColor: "text-amber-600",
        },
        {
            key: "approved",
            label: "Active",
            value: approvedUsers,
            trend: "+8%",
            icon: <UserCheck size={18} className="text-emerald-600" />,
            bgGradient: "from-emerald-500/10 to-transparent",
            borderColor: "border-slate-200/80 hover:border-emerald-500/30",
            iconBg: "bg-emerald-50 border-emerald-100",
            textColor: "text-emerald-600",
        },
        {
            key: "memories",
            label: "Memories",
            value: totalMemories,
            trend: "Total",
            icon: <Images size={18} className="text-indigo-600" />,
            bgGradient: "from-indigo-500/10 to-transparent",
            borderColor: "border-slate-200/80 hover:border-indigo-500/30",
            iconBg: "bg-indigo-50 border-indigo-100",
            textColor: "text-indigo-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 2xl:gap-8 w-full">
            {stats.map((stat) => (
                <div
                    key={stat.key}
                    onClick={() => onCardClick(stat.key)}
                    className={`
                        group relative overflow-hidden rounded-2xl border ${stat.borderColor} 
                        bg-white p-4 sm:p-6 2xl:p-7 transition-all duration-300 ease-out 
                        hover:-translate-y-1 cursor-pointer shadow-xs
                    `}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-30 transition-opacity group-hover:opacity-100`} />
                    
                    <div className="relative z-10 flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl border ${stat.iconBg} shadow-xs`}>
                            {stat.icon}
                        </div>
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                            <ArrowUpRight size={14} className={stat.textColor} />
                        </span>
                    </div>

                    <div className="relative z-10 space-y-0.5 sm:space-y-1">
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                            {stat.label}
                        </p>
                        <div className="flex items-baseline justify-between gap-1">
                            <h3 className="text-xl sm:text-3xl 2xl:text-4xl font-black tracking-tight text-slate-900">
                                {stat.value.toLocaleString()}
                            </h3>
                            <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                <TrendingUp size={10} />
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;