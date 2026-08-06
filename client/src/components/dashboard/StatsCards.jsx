import { Globe2, Images, Lock, Heart, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// STATS CARDS COMPONENT (ELITE LIGHT NAVY)
// ==========================================
/**
 * Renders summary statistic cards on the dashboard.
 * Features a high-end, unified light navy bluish UI with refined glassmorphism, 
 * subtle micro-grids, and elite corporate SaaS aesthetics.
 */
const StatsCards = ({
  totalMemories = 0,
  publicMemories = 0,
  privateMemories = 0,
  likedMemories = 0,
}) => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Archives",
      value: totalMemories,
      description: "Total journeys preserved.",
      icon: Images,
      iconBg: "bg-slate-50",
      iconBorder: "border-slate-200/60",
      iconColor: "text-slate-700",
      dotColor: "bg-slate-400",
      glowColor: "group-hover:bg-slate-200/40",
      path: "/dashboard/memories?filter=all",
    },
    {
      title: "Public Feed",
      value: publicMemories,
      description: "Shared with the global network.",
      icon: Globe2,
      iconBg: "bg-sky-50/60",
      iconBorder: "border-sky-100/80",
      iconColor: "text-sky-600",
      dotColor: "bg-sky-500",
      glowColor: "group-hover:bg-sky-200/30",
      path: "/dashboard/memories?filter=public",
    },
    {
      title: "Private Vault",
      value: privateMemories,
      description: "Secured with end-to-end encryption.",
      icon: Lock,
      iconBg: "bg-[#1E3A8A]/5",
      iconBorder: "border-[#1E3A8A]/10",
      iconColor: "text-[#1E3A8A]",
      dotColor: "bg-[#1E3A8A]",
      glowColor: "group-hover:bg-[#1E3A8A]/10",
      path: "/dashboard/memories?filter=private",
    },
    {
      title: "Liked Entries",
      value: likedMemories,
      description: "Your curated favorite moments.",
      icon: Heart,
      iconBg: "bg-blue-50/80",
      iconBorder: "border-blue-100/80",
      iconColor: "text-[#3559D4]",
      dotColor: "bg-[#3559D4]",
      glowColor: "group-hover:bg-blue-200/40",
      path: "/dashboard/memories?filter=liked",
    },
  ];

  return (
    <section className="mb-6 lg:mb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => navigate(stat.path)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white p-4 sm:p-5 md:p-6 text-left shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-[0_20px_40px_-15px_rgba(30,58,138,0.12)] cursor-pointer"
            >
              {/* Premium Micro-Grid Pattern (Reveals on Hover) */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a06_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a06_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />

              {/* Ambient Radial Glow (Top Right) - Unified Light Navy Tones */}
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150 ${stat.glowColor} pointer-events-none`} />

              {/* Top Row: Icon & Status Indicator */}
              <div className="relative z-10 flex items-start justify-between w-full mb-5 sm:mb-6">
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[1rem] border ${stat.iconBorder} ${stat.iconBg} shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </div>
                
                {/* Tech Status Node */}
                <div className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50/80 px-2 py-1 shadow-sm backdrop-blur-md">
                  <span className={`h-1.5 w-1.5 rounded-full ${stat.dotColor} animate-pulse`} />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Live</span>
                </div>
              </div>

              {/* Bottom Row: Data & Details */}
              <div className="relative z-10 w-full">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#1E3A8A]">
                      {stat.value}
                    </h2>
                    <p className="mt-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors duration-300 group-hover:text-[#3559D4]">
                      {stat.title}
                    </p>
                  </div>

                  {/* Hover Action Arrow */}
                  <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 transition-all duration-300 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-[#1E3A8A]">
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Subtle Description (Desktop Only) */}
                <p className="mt-4 hidden text-[11px] font-medium text-slate-500/80 md:block truncate border-t border-slate-100 pt-3.5 transition-colors group-hover:border-blue-100">
                  {stat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default StatsCards;