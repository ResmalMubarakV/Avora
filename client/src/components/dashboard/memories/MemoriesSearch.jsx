import { Search, X } from "lucide-react";

// ==========================================
// MEMORIES SEARCH COMPONENT
// ==========================================
/**
 * Renders a searchable input bar with a search icon and a clear button 
 * that appears when text is entered to reset the query.
 */
const MemoriesSearch = ({
  value,
  onChange,
}) => {
  // Clear search input handler
  const handleClear = () => {
    // Create a synthetic event object to clear the input via onChange callback
    const event = {
      target: { value: "" },
    };
    onChange(event);
  };

  return (
    <div className="relative w-full lg:w-[520px] xl:w-[680px]">
      {/* Search Icon */}
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      {/* Search Input Field */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by title or destination..."
        className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-base text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition-all duration-300 focus:border-[#3559D4] focus:ring-4 focus:ring-blue-100"
      />

      {/* Clear (X) Button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default MemoriesSearch;