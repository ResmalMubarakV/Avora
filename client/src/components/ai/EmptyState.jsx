import {
  Map,
  Backpack,
  Camera,
  Wallet,
  UtensilsCrossed,
  Plane,
  ArrowRight,
} from "lucide-react";
import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// SUGGESTION PROMPTS DATA
// ==========================================
const suggestions = [
  {
    icon: <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-indigo-400" />,
    title: "Destination Ideas",
    desc: "Discover new spots tailored to your past journeys",
    prompt: "Suggest my next travel destination based on my previous trips.",
    badge: "Trending",
  },
  {
    icon: <Map className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-cyan-400" />,
    title: "Complete Itinerary",
    desc: "Day-by-day sightseeing, routes & time estimates",
    prompt: "Create a complete detailed itinerary for my next vacation.",
    badge: "Popular",
  },
  {
    icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />,
    title: "Budget Breakdown",
    desc: "Estimate costs for flights, stays & daily meals",
    prompt: "Estimate the estimated budget breakdown for my next trip.",
    badge: "Financial",
  },
  {
    icon: <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />,
    title: "Story Captions",
    desc: "Captivating captions and hashtags for photos",
    prompt: "Write creative and engaging Instagram captions for my travel photos.",
    badge: "Creative",
  },
  {
    icon: <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />,
    title: "Food & Dining Guide",
    desc: "Traditional local foods and top-rated eateries",
    prompt: "Recommend traditional local foods and restaurants I should try.",
    badge: "Cuisine",
  },
  {
    icon: <Backpack className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />,
    title: "Packing Checklist",
    desc: "Weather-ready essentials and gear recommendations",
    prompt: "Prepare a customized packing checklist for my upcoming journey.",
    badge: "Checklist",
  },
];

// ==========================================
// RESPONSIVE EMPTY STATE COMPONENT
// ==========================================
/**
 * Displayed when an AI conversation thread has no messages yet.
 * Scales dynamically across Mobile, Tablets, Desktop, and Ultra-Wide displays.
 */
const EmptyState = ({ onSelect }) => {
  return (
    <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl flex-col items-center justify-center px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 my-auto animate-in fade-in duration-300">
      
      {/* Avora AI Signature Hero Emblem */}
      <div className="relative mb-2 sm:mb-4 group">
        <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#0284C7] text-white shadow-xl shadow-blue-500/25 dark:shadow-indigo-900/50 border border-white/20 transition-transform duration-300 group-hover:scale-105">
          <AvoraAIIcon size={24} variant="glow" className="sm:w-8 sm:h-8 md:w-9 md:h-9" />
          
          {/* Orbital Halo Ring */}
          <span className="absolute -inset-1.5 sm:-inset-2 rounded-2xl sm:rounded-3xl border border-cyan-400/40 animate-pulse pointer-events-none" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-center text-base sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white px-2">
        Where should we explore next?
      </h1>

      {/* Subtitle */}
      <p className="mt-1 sm:mt-2 max-w-md md:max-w-lg text-center text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 px-4">
        Plan trips, uncover hidden gems, and get instant personalized travel guidance.
      </p>

      {/* Suggestion Prompts Grid */}
      {/* Mobile: 1 col on xs or 2 col on sm, Tablet: 2/3 col, Desktop: 3 col */}
      <div className="mt-3.5 sm:mt-6 md:mt-8 grid w-full grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4">
        {suggestions.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(item.prompt)}
            className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3 sm:p-4 md:p-4.5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3559D4] dark:hover:border-indigo-500/80 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-indigo-900/40 cursor-pointer active:scale-[0.98]"
          >
            <div>
              {/* Header inside Card: Icon + Badge */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-indigo-950/60 group-hover:text-blue-600 dark:group-hover:text-indigo-300 transition-colors">
                  {item.badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#3559D4] dark:group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h2>

              {/* Description */}
              <p className="mt-1 text-[11px] sm:text-xs md:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {item.desc}
              </p>
            </div>

            {/* Action Cue Link */}
            <div className="mt-2 sm:mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] sm:text-xs font-semibold text-[#3559D4] dark:text-indigo-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Ask Avora AI
                <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;