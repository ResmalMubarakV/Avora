import { Globe2, Images, Lock, Heart, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// STATS CARDS COMPONENT (MILD GRADIENT LIGHT & DARK THEMES)
// ==========================================
/**
 * Renders summary statistic cards on the dashboard.
 * - Light Mode: Elegant, mild luxury color gradients with soft borders and vivid brand accents.
 * - Dark Mode: Premium dark slate cards with rich glowing borders, glowing badges & neon indicators.
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
      cardGradient: "from-slate-50/90 via-white to-blue-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950",
      cardBorder: "border-blue-100/90 dark:border-slate-800",
      iconBg: "bg-blue-50/80 dark:bg-slate-800/90",
      iconBorder: "border-blue-200/60 dark:border-slate-700/80",
      iconColor: "text-blue-600 dark:text-indigo-400",
      accentBorder: "hover:border-blue-400/60 dark:hover:border-indigo-500/60",
      dotColor: "bg-blue-600 dark:bg-indigo-400",
      glowColor: "group-hover:bg-blue-200/40 dark:group-hover:bg-indigo-950/30",
      path: "/dashboard/memories?filter=all",
    },
    {
      title: "Public Feed",
      value: publicMemories,
      description: "Shared with global network.",
      icon: Globe2,
      cardGradient: "from-slate-50/90 via-white to-emerald-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950",
      cardBorder: "border-emerald-100/80 dark:border-slate-800",
      iconBg: "bg-emerald-50/80 dark:bg-slate-800/90",
      iconBorder: "border-emerald-200/60 dark:border-slate-700/80",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      accentBorder: "hover:border-emerald-400/60 dark:hover:border-emerald-500/60",
      dotColor: "bg-emerald-500 dark:bg-emerald-400",
      glowColor: "group-hover:bg-emerald-200/40 dark:group-hover:bg-emerald-950/30",
      path: "/dashboard/memories?filter=public",
    },
    {
      title: "Private Vault",
      value: privateMemories,
      description: "Secured with encryption.",
      icon: Lock,
      cardGradient: "from-slate-50/90 via-white to-violet-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950",
      cardBorder: "border-violet-100/80 dark:border-slate-800",
      iconBg: "bg-violet-50/80 dark:bg-slate-800/90",
      iconBorder: "border-violet-200/60 dark:border-slate-700/80",
      iconColor: "text-violet-600 dark:text-violet-400",
      accentBorder: "hover:border-violet-400/60 dark:hover:border-violet-500/60",
      dotColor: "bg-violet-500 dark:bg-violet-400",
      glowColor: "group-hover:bg-violet-200/40 dark:group-hover:bg-violet-950/30",
      path: "/dashboard/memories?filter=private",
    },
    {
      title: "Liked Entries",
      value: likedMemories,
      description: "Curated favorite moments.",
      icon: Heart,
      cardGradient: "from-slate-50/90 via-white to-rose-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950",
      cardBorder: "border-rose-100/80 dark:border-slate-800",
      iconBg: "bg-rose-50/80 dark:bg-slate-800/90",
      iconBorder: "border-rose-200/60 dark:border-slate-700/80",
      iconColor: "text-rose-600 dark:text-rose-400",
      accentBorder: "hover:border-rose-400/60 dark:hover:border-rose-500/60",
      dotColor: "bg-rose-500 dark:bg-rose-400",
      glowColor: "group-hover:bg-rose-200/40 dark:group-hover:bg-rose-950/30",
      path: "/dashboard/memories?filter=liked",
    },
  ];

  return (
    <section className="mb-5 lg:mb-6">
      {/* 1. MOBILE VIEW: Compact Mild Gradient Single-Line Stats Pill Bar */}
      <div className="block sm:hidden bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/70 dark:bg-none dark:bg-slate-900 border border-blue-100/90 dark:border-slate-800 px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 shadow-[0_2px_12px_rgba(30,58,138,0.04)] dark:shadow-none mb-2 transition-all">
        <button 
          type="button" 
          onClick={() => navigate(stats[0].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>📊</span> <b className="text-slate-900 dark:text-white font-extrabold">{totalMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Archives</span>
        </button>
        <span className="text-slate-300 dark:text-slate-800 font-light">|</span>
        <button 
          type="button" 
          onClick={() => navigate(stats[1].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>🌍</span> <b className="text-slate-900 dark:text-white font-extrabold">{publicMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Public</span>
        </button>
        <span className="text-slate-300 dark:text-slate-800 font-light">|</span>
        <button 
          type="button" 
          onClick={() => navigate(stats[2].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>🔒</span> <b className="text-slate-900 dark:text-white font-extrabold">{privateMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Private</span>
        </button>
        <span className="text-slate-300 dark:text-slate-800 font-light">|</span>
        <button 
          type="button" 
          onClick={() => navigate(stats[3].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>❤️</span> <b className="text-slate-900 dark:text-white font-extrabold">{likedMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Likes</span>
        </button>
      </div>

      {/* 2. TABLET & IPAD PRO VIEW: Mild Gradient 2x2 Grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => navigate(stat.path)}
              className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border ${stat.cardBorder} bg-gradient-to-br ${stat.cardGradient} px-4 py-3.5 text-left shadow-[0_2px_12px_rgba(30,58,138,0.03)] dark:shadow-none transition-all duration-300 ${stat.accentBorder} hover:shadow-md cursor-pointer`}
            >
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 transition-colors group-hover:text-[#1E3A8A] dark:group-hover:text-indigo-300">
                  {stat.value}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium line-clamp-1">{stat.description}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.iconBorder} ${stat.iconBg} shadow-2xs transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                <Icon className={`h-4.5 w-4.5 ${stat.iconColor}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. DESKTOP VIEW: Mild Luxury Gradient 4-Column Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => navigate(stat.path)}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${stat.cardBorder} bg-gradient-to-br ${stat.cardGradient} p-4 text-left shadow-[0_4px_16px_rgba(30,58,138,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 ${stat.accentBorder} hover:shadow-[0_12px_28px_-6px_rgba(30,58,138,0.09)] dark:hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.15)] cursor-pointer`}
            >
              {/* Micro-Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a05_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a05_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#6366f108_1px,transparent_1px),linear-gradient(to_bottom,#6366f108_1px,transparent_1px)] bg-[size:0.85rem_0.85rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

              {/* Ambient Radial Glow */}
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125 ${stat.glowColor} pointer-events-none`} />

              {/* Top Row: Icon & Status Indicator */}
              <div className="relative z-10 flex items-start justify-between w-full mb-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.iconBorder} ${stat.iconBg} shadow-2xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                
                {/* Tech Status Node */}
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 px-2.5 py-0.5 shadow-2xs backdrop-blur-md">
                  <span className={`h-1.5 w-1.5 rounded-full ${stat.dotColor} animate-pulse`} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Live</span>
                </div>
              </div>

              {/* Bottom Row: Data & Details */}
              <div className="relative z-10 w-full">
                <div className="flex items-end justify-between">
                  <div>
                    {/* Numerical Value */}
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-[#1E3A8A] dark:group-hover:text-indigo-300">
                      {stat.value}
                    </h2>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 transition-colors duration-300 group-hover:text-[#3559D4] dark:group-hover:text-indigo-400">
                      {stat.title}
                    </p>
                  </div>

                  {/* Hover Action Arrow */}
                  <div className="mb-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-2xs transition-all duration-300 group-hover:bg-[#1E3A8A] dark:group-hover:bg-indigo-950/80 group-hover:border-transparent group-hover:text-white dark:group-hover:text-indigo-300">
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Subtle Description */}
                <p className="mt-2.5 hidden text-[10px] lg:block font-medium text-slate-600/90 dark:text-slate-400/80 truncate border-t border-slate-200/60 dark:border-slate-800 pt-2 transition-colors group-hover:border-indigo-200/60 dark:group-hover:border-indigo-900/50">
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