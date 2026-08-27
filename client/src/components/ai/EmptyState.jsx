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
    icon: <Plane size={15} />,
    title: "Destination Ideas",
    desc: "Suggest destinations from past trips",
    prompt: "Suggest my next travel destination based on my previous trips.",
  },
  {
    icon: <Map size={15} />,
    title: "Trip Itinerary",
    desc: "Create a detailed day-by-day plan",
    prompt: "Create a complete detailed itinerary for my next vacation.",
  },
  {
    icon: <Wallet size={15} />,
    title: "Budget Estimate",
    desc: "Estimate costs & expenses",
    prompt: "Estimate the estimated budget breakdown for my next trip.",
  },
  {
    icon: <Camera size={15} />,
    title: "Photo Captions",
    desc: "Generate creative travel captions",
    prompt: "Write creative and engaging Instagram captions for my travel photos.",
  },
  {
    icon: <UtensilsCrossed size={15} />,
    title: "Local Food Guide",
    desc: "Recommend traditional food & spots",
    prompt: "Recommend traditional local foods and restaurants I should try.",
  },
  {
    icon: <Backpack size={15} />,
    title: "Packing List",
    desc: "Prepare a travel packing checklist",
    prompt: "Prepare a customized packing checklist for my upcoming journey.",
  },
];

// ==========================================
// COMPACT & RESPONSIVE EMPTY STATE COMPONENT
// ==========================================
/**
 * Displayed when an AI conversation thread has no messages yet.
 * Features a compact, responsive grid of suggestion cards visible immediately on landing.
 */
const EmptyState = ({ onSelect }) => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-2.5 sm:px-6 py-3 sm:py-6 lg:py-8 animate-in fade-in duration-300">
      {/* Sparkles Hero Icon */}
      <div className="relative flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#3559D4] via-[#4166E0] to-[#1E3A8A] dark:from-indigo-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-indigo-900/40">
        <Sparkles size={20} className="sm:w-7 sm:h-7 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>

      {/* Heading */}
      <h1 className="mt-2.5 sm:mt-4 text-center text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        How can Avora AI help you today?
      </h1>

      {/* Description */}
      <p className="mt-0.5 sm:mt-1.5 max-w-md text-center text-[11px] sm:text-sm text-slate-500 dark:text-slate-400">
        Plan trips, discover destinations, and get personalized recommendations.
      </p>

      {/* Suggestion Prompts Grid - Compact 2-col on mobile, 3-col on desktop */}
      <div className="mt-4 sm:mt-6 grid w-full grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5">
        {suggestions.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(item.prompt)}
            className="group relative flex flex-col justify-between rounded-xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2.5 sm:p-4 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3559D4] dark:hover:border-indigo-500 hover:shadow-md hover:shadow-blue-500/5 dark:hover:shadow-indigo-900/30 cursor-pointer active:scale-[0.98]"
          >
            <div>
              {/* Icon Box */}
              <div className="mb-1.5 sm:mb-3 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 dark:bg-indigo-950/60 text-[#3559D4] dark:text-indigo-400 border border-blue-100/60 dark:border-indigo-900/50 transition-transform duration-200 group-hover:scale-105">
                {item.icon}
              </div>

              <h3 className="text-[11px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#3559D4] dark:group-hover:text-indigo-400 transition-colors truncate">
                {item.title}
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                {item.desc}
              </p>
            </div>

            <span className="mt-1.5 text-[9px] sm:text-[10px] font-bold text-[#3559D4] dark:text-indigo-400 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              Ask AI →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;