import { Globe2, Images, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// STATS CARDS COMPONENT
// ==========================================
/**
 * Renders summary statistic cards on the dashboard (Total, Public, Private memories).
 * Optimized with high-density mobile layout, scaled typography, and smooth interactive states.
 */
const StatsCards = ({
  totalMemories = 0,
  publicMemories = 0,
  privateMemories = 0,
}) => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total",
      value: totalMemories,
      description: "Every journey you've captured.",
      icon: Images,
      iconBg: "bg-[#1E3A8A]",
      iconColor: "text-white",
      path: "/dashboard/memories?filter=all",
    },
    {
      title: "Public",
      value: publicMemories,
      description: "Shared with everyone.",
      icon: Globe2,
      iconBg: "bg-[#1E3A8A]/15",
      iconColor: "text-[#1E3A8A]",
      path: "/dashboard/memories?filter=public",
    },
    {
      title: "Private",
      value: privateMemories,
      description: "Visible only to you.",
      icon: Lock,
      iconBg: "bg-[#1E3A8A]/15",
      iconColor: "text-[#1E3A8A]",
      path: "/dashboard/memories?filter=private",
    },
  ];

  return (
    <section className="mb-6 lg:mb-10">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => navigate(stat.path)}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-blue-50/40 to-[#1E3A8A]/5 p-3.5 sm:p-5 md:p-6 text-left transition-all duration-300 hover:border-[#1E3A8A]/30 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              {/* Dark Navy Background Glow Accent */}
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#1E3A8A]/10 blur-2xl transition-all duration-500 group-hover:bg-[#1E3A8A]/20 group-hover:scale-110" />

              {/* Card Content */}
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between">
                  <div
                    className={`${stat.iconBg} flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105`}
                  >
                    <Icon
                      size={15}
                      className={`sm:w-5 sm:h-5 ${stat.iconColor}`}
                    />
                  </div>
                </div>

                <h2 className="mt-3 sm:mt-4 text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </h2>

                <p className="mt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1.5 hidden text-xs leading-relaxed text-slate-500 md:block">
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