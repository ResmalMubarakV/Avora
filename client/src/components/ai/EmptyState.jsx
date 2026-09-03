import {
  Map,
  Backpack,
  Camera,
  Wallet,
  UtensilsCrossed,
  Plane,
} from "lucide-react";
import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// SUGGESTION PROMPTS DATA
// ==========================================
const suggestions = [
  {
    icon: <Plane size={14} />,
    title: "Destination Ideas",
    desc: "Suggest destinations from past trips",
    prompt: "Suggest my next travel destination based on my previous trips.",
  },
  {
    icon: <Map size={14} />,
    title: "Trip Itinerary",
    desc: "Create a detailed day-by-day plan",
    prompt: "Create a complete detailed itinerary for my next vacation.",
  },
  {
    icon: <Wallet size={14} />,
    title: "Budget Estimate",
    desc: "Estimate costs & expenses",
    prompt: "Estimate the estimated budget breakdown for my next trip.",
  },
  {
    icon: <Camera size={14} />,
    title: "Photo Captions",
    desc: "Generate creative travel captions",
    prompt: "Write creative and engaging Instagram captions for my travel photos.",
  },
  {
    icon: <UtensilsCrossed size={14} />,
    title: "Local Food Guide",
    desc: "Recommend traditional food & spots",
    prompt: "Recommend traditional local foods and restaurants I should try.",
  },
  {
    icon: <Backpack size={14} />,
    title: "Packing List",
    desc: "Prepare a travel packing checklist",
    prompt: "Prepare a customized packing checklist for my upcoming journey.",
  },
];

// ==========================================
// COMPACT 100% FIT EMPTY STATE COMPONENT
// ==========================================
/**
 * Displayed when an AI conversation thread has no messages yet.
 * Features a compact, responsive grid of suggestion cards visible immediately on landing without scrolling.
 */
const EmptyState = ({ onSelect }) => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-2.5 sm:px-6 py-2 sm:py-4 my-auto animate-in fade-in duration-300 overflow-hidden">
      {/* Avora AI Signature Hero Icon */}
      <div className="relative flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#0284C7] text-white shadow-xl shadow-blue-500/25 dark:shadow-indigo-900/50 border border-white/20">
        <AvoraAIIcon size={22} variant="glow" className="sm:w-[36px] sm:h-[36px]" />
        
        {/* Orbital Halo Ring */}
        <span className="absolute -inset-2 rounded-2xl sm:rounded-3xl border border-cyan-400/30 animate-pulse pointer-events-none" />
      </div>

      {/* Heading */}
      <h1 className="mt-2 sm:mt-3 text-center text-sm sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
        How can Avora AI help you today?
      </h1>

      {/* Description */}
      <p className="mt-0.5 max-w-md text-center text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
        Plan trips, discover destinations, and get personalized recommendations.
      </p>

      {/* Suggestion Prompts Grid - Compact 2-col on mobile, 3-col on desktop */}
      <div className="mt-2.5 sm:mt-4 grid w-full grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-3">
        {suggestions.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(item.prompt)}
            className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2 sm:p-3 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3559D4] dark:hover:border-indigo-500 hover:shadow-md hover:shadow-blue-500/5 dark:hover:shadow-indigo-900/30 cursor-pointer active:scale-[0.98]"
          >
            <div>
              {/* Icon Box */}
              <div className="mb-1 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-indigo-950/60 text-[#3559D4] dark:text-indigo-400 border border-blue-100/60 dark:border-indigo-900/50 transition-transform duration-200 group-hover:scale-105">
                {item.icon}
              </div>

              <h3 className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#3559D4] dark:group-hover:text-indigo-400 transition-colors truncate">
                {item.title}
              </h3>
              <p className="mt-0.5 text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-tight">
                {item.desc}
              </p>
            </div>

            <span className="mt-1 text-[8px] sm:text-[9px] font-bold text-[#3559D4] dark:text-indigo-400 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              Ask AI →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;