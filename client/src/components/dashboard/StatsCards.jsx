import React from "react";
import { Globe2, Images, Lock, Heart, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// STATS CARDS COMPONENT (COMPACT REDESIGN)
// ==========================================
/**
 * Renders summary statistic cards on the dashboard.
 * - Mobile: Ultra-compact single-line stats pill bar.
 * - Tablet & iPad Pro (sm up to lg): Neatly compact 2x2 grid.
 * - Desktop (lg+): Sleek, highly compact 4-column micro-grid layout.
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
      description: "Shared with global network.",
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
      description: "Secured with encryption.",
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
      description: "Curated favorite moments.",
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
    <section className="mb-5 lg:mb-6">
      {/* 1. MOBILE VIEW: Compact Single-Line Stats Pill Bar (Unchanged) */}
      <div className="block sm:hidden bg-white border border-slate-200/80 px-3 py-2.5 rounded-2xl flex items-center justify-between text-[11px] font-medium text-slate-600 shadow-[0_2px_10px_rgb(0,0,0,0.02)] mb-2">
        <button 
          type="button" 
          onClick={() => navigate(stats[0].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>📊</span> <b>{totalMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-400">Archives</span>
        </button>
        <span className="text-slate-200 font-light">|</span>
        <button 
          type="button" 
          onClick={() => navigate(stats[1].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>🌍</span> <b>{publicMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-400">Public</span>
        </button>
        <span className="text-slate-200 font-light">|</span>
        <button 
          type="button" 
          onClick={() => navigate(stats[2].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>🔒</span> <b>{privateMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-400">Private</span>
        </button>
        <span className="text-slate-200 font-light">|</span>
        <button 
          type="button" 
          onClick={() => navigate(stats[3].path)} 
          className="flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          <span>❤️</span> <b>{likedMemories}</b> <span className="text-[9px] uppercase tracking-wider text-slate-400">Likes</span>
        </button>
      </div>

      {/* 2. TABLET & IPAD PRO VIEW: More compact 2x2 grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => navigate(stat.path)}
              className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 text-left shadow-2xs transition-all hover:border-blue-200 hover:shadow-sm cursor-pointer"
            >
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 transition-colors group-hover:text-[#1E3A8A]">
                  {stat.value}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium line-clamp-1">{stat.description}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${stat.iconBorder} ${stat.iconBg} shadow-2xs transition-transform group-hover:scale-105 shrink-0`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. DESKTOP VIEW: Sleeker & More Compact 4-Column Micro-Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => navigate(stat.path)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/70 bg-white p-3.5 text-left shadow-[0_2px_12px_rgb(0,0,0,0.02)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200/80 hover:shadow-[0_12px_30px_-10px_rgba(30,58,138,0.08)] cursor-pointer"
            >
              {/* Premium Micro-Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a04_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a04_1px,transparent_1px)] bg-[size:0.85rem_0.85rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

              {/* Ambient Radial Glow */}
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125 ${stat.glowColor} pointer-events-none`} />

              {/* Top Row: Icon & Status Indicator */}
              <div className="relative z-10 flex items-start justify-between w-full mb-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${stat.iconBorder} ${stat.iconBg} shadow-2xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}
                >
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
                
                {/* Tech Status Node */}
                <div className="flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50/80 px-2 py-0.5 shadow-2xs backdrop-blur-md">
                  <span className={`h-1.5 w-1.5 rounded-full ${stat.dotColor} animate-pulse`} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Live</span>
                </div>
              </div>

              {/* Bottom Row: Data & Details */}
              <div className="relative z-10 w-full">
                <div className="flex items-end justify-between">
                  <div>
                    {/* Compact Scaled Text for Desktop */}
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#1E3A8A]">
                      {stat.value}
                    </h2>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors duration-300 group-hover:text-[#3559D4]">
                      {stat.title}
                    </p>
                  </div>

                  {/* Hover Action Arrow */}
                  <div className="mb-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 transition-all duration-300 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-[#1E3A8A]">
                    <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Subtle Description */}
                <p className="mt-2 hidden text-[10px] lg:block font-medium text-slate-500/80 truncate border-t border-slate-100 pt-2 transition-colors group-hover:border-blue-100">
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