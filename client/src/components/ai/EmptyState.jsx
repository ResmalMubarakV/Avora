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
    icon: <Plane size={20} />,
    title: "Plan my next adventure",
    prompt: "Suggest my next travel destination based on my previous trips.",
  },
  {
    icon: <Map size={20} />,
    title: "Create a travel itinerary",
    prompt: "Create a complete detailed itinerary for my next vacation.",
  },
  {
    icon: <Wallet size={20} />,
    title: "Estimate travel budget",
    prompt: "Estimate the estimated budget breakdown for my next trip.",
  },
  {
    icon: <Camera size={20} />,
    title: "Write Instagram captions",
    prompt: "Write creative and engaging Instagram captions for my travel photos.",
  },
  {
    icon: <UtensilsCrossed size={20} />,
    title: "Recommend local food",
    prompt: "Recommend traditional local foods and restaurants I should try.",
  },
  {
    icon: <Backpack size={20} />,
    title: "Packing checklist",
    prompt: "Prepare a customized packing checklist for my upcoming journey.",
  },
];

// ==========================================
// EMPTY STATE COMPONENT
// ==========================================
/**
 * Displayed when an AI conversation thread has no messages yet.
 * Features an interactive grid of pre-built suggestion cards.
 */
const EmptyState = ({ onSelect }) => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 sm:py-20">
      {/* Sparkles Hero Icon */}
      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#3559D4] to-[#1E3A8A] text-white shadow-xl shadow-blue-500/25">
        <Sparkles size={32} className="sm:w-9 sm:h-9" />
      </div>

      {/* Heading */}
      <h1 className="mt-6 sm:mt-8 text-center text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
        How can Avora AI help you today?
      </h1>

      {/* Description */}
      <p className="mt-3 sm:mt-4 max-w-xl text-center text-sm sm:text-base leading-relaxed text-slate-500">
        Plan trips, discover destinations, estimate budgets, and get personalized recommendations from your travel archives.
      </p>

      {/* Suggestion Prompts Grid */}
      <div className="mt-10 sm:mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((item) => (
          <button
            key={item.title}
            onClick={() => onSelect(item.prompt)}
            className="group rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-5 sm:p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3559D4] hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer"
          >
            {/* Icon Box */}
            <div className="mb-4 sm:mb-5 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3559D4] transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500">
              Click to instantly ask Avora AI.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;