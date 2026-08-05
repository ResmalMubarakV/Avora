import { Users, UserCheck, Clock, Images, ArrowUpRight } from "lucide-react";

// ==========================================
// DASHBOARD STATS COMPONENT
// ==========================================
/**
 * Renders an elite SaaS metrics grid with interactive hover elevations, 
 * subtle background gradients, and sleek typography.
 */
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
            icon: <Users size={22} className="text-blue-600" />,
            bgGradient: "from-blue-600/10 via-indigo-500/5 to-transparent",
            borderColor: "border-slate-200/80 hover:border-blue-500/30",
            iconBg: "bg-blue-50/80 border-blue-100",
            textColor: "text-blue-600",
            glowColor: "group-hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)]",
        },
        {
            key: "pending",
            label: "Pending Approvals",
            value: pendingUsers,
            icon: <Clock size={22} className="text-amber-600" />,
            bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
            borderColor: "border-slate-200/80 hover:border-amber-500/30",
            iconBg: "bg-amber-50/80 border-amber-100",
            textColor: "text-amber-600",
            glowColor: "group-hover:shadow-[0_10px_30px_rgba(217,119,6,0.08)]",
        },
        {
            key: "approved",
            label: "Active Users",
            value: approvedUsers,
            icon: <UserCheck size={22} className="text-emerald-600" />,
            bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
            borderColor: "border-slate-200/80 hover:border-emerald-500/30",
            iconBg: "bg-emerald-50/80 border-emerald-100",
            textColor: "text-emerald-600",
            glowColor: "group-hover:shadow-[0_10px_30px_rgba(5,150,105,0.08)]",
        },
        {
            key: "memories",
            label: "Total Memories",
            value: totalMemories,
            icon: <Images size={22} className="text-indigo-600" />,
            bgGradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
            borderColor: "border-slate-200/80 hover:border-indigo-500/30",
            iconBg: "bg-indigo-50/80 border-indigo-100",
            textColor: "text-indigo-600",
            glowColor: "group-hover:shadow-[0_10px_30px_rgba(99,102,241,0.08)]",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div
                    key={stat.key}
                    onClick={() => onCardClick(stat.key)}
                    className={`
                        group relative overflow-hidden rounded-3xl border ${stat.borderColor} 
                        bg-white p-6 transition-all duration-300 ease-out 
                        hover:-translate-y-1.5 ${stat.glowColor} cursor-pointer
                    `}
                >
                    {/* Ambient Hover Gradient Layer */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-40 transition-opacity duration-300 group-hover:opacity-100`} />
                    
                    {/* Top Row: Icon & Action Indicator */}
                    <div className="relative z-10 flex items-center justify-between mb-5">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                            {stat.icon}
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 group-hover:bg-white group-hover:shadow-md">
                            <ArrowUpRight size={16} className={stat.textColor} />
                        </span>
                    </div>

                    {/* Bottom Row: Label & Value */}
                    <div className="relative z-10 space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {stat.label}
                        </p>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900">
                            {stat.value.toLocaleString()}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;