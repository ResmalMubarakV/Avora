import {
  Sparkles,
  Map,
  Backpack,
  Camera,
  Wallet,
  UtensilsCrossed,
  Plane,
} from "lucide-react";

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
      {/* Sparkles Hero Icon */}
      <div className="relative flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-3xl bg-gradient-to-br from-[#3559D4] via-[#4166E0] to-[#1E3A8A] dark:from-indigo-600 dark:to-blue-700 text-white shadow-md shadow-blue-500/20 dark:shadow-indigo-900/40">
        <Sparkles size={16} className="sm:w-6 sm:h-6 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>

      {/* Heading */}
      <h1 className="mt-1.5 sm:mt-3 text-center text-sm sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
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