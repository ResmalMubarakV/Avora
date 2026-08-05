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
    "Continue Planning",
    "Estimated Budget",
    "Packing Checklist",
    "Hotels Nearby",
    "Things To Do",
    "Local Food",
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-2 sm:gap-2.5">
      {suggestions.map((item) => (
        <button
          key={item}
          type="button"
          disabled={loading}
          onClick={() => onSelect(item)}
          className="rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-[#3559D4] hover:bg-blue-50/60 hover:text-[#3559D4] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;