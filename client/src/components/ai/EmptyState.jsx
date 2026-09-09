import {
  Map,
  Wallet,
  UtensilsCrossed,
  Plane,
  ArrowRight,
} from "lucide-react";
import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// CURATED HERO SUGGESTION PROMPTS
// ==========================================
const suggestions = [
  {
    icon: <Plane className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-indigo-400" />,
    title: "Destination Ideas",
    desc: "Personalized recommendations",
    prompt: "Suggest my next travel destination based on my previous trips.",
    badge: "Top Pick",
  },
  {
    icon: <Map className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-600 dark:text-cyan-400" />,
    title: "Detailed Itinerary",
    desc: "Day-by-day sightseeing & routes",
    prompt: "Create a complete detailed itinerary for my next vacation.",
    badge: "Popular",
  },
  {
    icon: <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 dark:text-emerald-400" />,
    title: "Budget Breakdown",
    desc: "Flights, stays & daily costs",
    prompt: "Estimate the estimated budget breakdown for my next trip.",
    badge: "Budget",
  },
  {
    icon: <UtensilsCrossed className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-amber-400" />,
    title: "Food & Dining",
    desc: "Local foods & hidden eateries",
    prompt: "Recommend traditional local foods and restaurants I should try.",
    badge: "Cuisine",
  },
];

// ==========================================
// HERO EMPTY STATE COMPONENT (NO SCROLL ON LANDING)
// ==========================================
/**
 * Displayed when an AI conversation thread is empty.
 * Fits 100% seamlessly inside viewport across Mobile (2x2 grid), Tablet, and Desktop (4-col hero deck)
 * with zero required scrolling and no horizontal overflow.
 */
const EmptyState = ({ onSelect }) => {
  return (
    <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl flex-col items-center justify-center px-2 sm:px-4 md:px-6 py-2 sm:py-4 animate-in fade-in duration-300">
      
      {/* Avora AI Signature Hero Emblem */}
      <div className="relative mb-2 sm:mb-3 group">
        <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#0284C7] text-white shadow-lg shadow-blue-500/25 dark:shadow-indigo-900/50 border border-white/20 transition-transform duration-300 group-hover:scale-105">
          <AvoraAIIcon size={20} variant="glow" className="sm:w-7 sm:h-7" />
          
          {/* Orbital Halo Ring */}
          <span className="absolute -inset-1 sm:-inset-1.5 rounded-2xl sm:rounded-3xl border border-cyan-400/40 animate-pulse pointer-events-none" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white px-2">
        Where should we explore next?
      </h1>

      {/* Subtitle */}
      <p className="mt-0.5 sm:mt-1 max-w-md text-center text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 px-3">
        Plan trips, uncover hidden gems, and get instant personalized travel advice.
      </p>

      {/* Hero Suggestion Cards Grid */}
      {/* Mobile: 2x2 Grid (fits on screen) | Tablet: 2x2 Grid | Desktop: 4-Column Row */}
      <div className="mt-3 sm:mt-4 md:mt-5 grid w-full grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-3.5">
        {suggestions.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(item.prompt)}
            className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2.5 sm:p-3.5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3559D4] dark:hover:border-indigo-500/80 hover:shadow-md hover:shadow-blue-500/10 dark:hover:shadow-indigo-900/40 cursor-pointer active:scale-[0.98]"
          >
            <div>
              {/* Header inside Card: Icon + Badge */}
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition-transform duration-200 group-hover:scale-105">
                  {item.icon}
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-indigo-950/60 group-hover:text-blue-600 dark:group-hover:text-indigo-300 transition-colors">
                  {item.badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#3559D4] dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {item.title}
              </h2>

              {/* Description */}
              <p className="mt-0.5 text-[10px] sm:text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                {item.desc}
              </p>
            </div>

            {/* Action Cue Link */}
            <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#3559D4] dark:text-indigo-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Ask Avora AI
                <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;