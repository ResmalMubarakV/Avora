// ==========================================
// SUGGESTION CHIPS COMPONENT
// ==========================================
/**
 * Renders interactive follow-up suggestion chips underneath the latest AI assistant response.
 */
const SuggestionChips = ({
  onSelect,
  loading,
}) => {
  const suggestions = [
    "Detailed Itinerary",
    "Continue Planning",
    "Estimated Budget",
    "Packing Checklist",
    "Hotels Nearby",
    "Things To Do",
    "Local Food",
  ];

  return (
    <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2.5">
      {suggestions.map((item) => (
        <button
          key={item}
          type="button"
          disabled={loading}
          onClick={() => onSelect(item)}
          className="rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-all duration-200 hover:border-[#3559D4] dark:hover:border-indigo-500 hover:bg-blue-50/60 dark:hover:bg-slate-700 hover:text-[#3559D4] dark:hover:text-indigo-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;