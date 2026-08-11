import { ArrowDownWideNarrow, Check } from "lucide-react";

// ==========================================
// MEMORIES FILTERS COMPONENT
// ==========================================
const MemoriesFilters = ({
  selectedFilters,
  toggleFilter,
  sortBy,
  setSortBy,
}) => {
  const filterOptions = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
    { label: "Liked", value: "liked" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
      
      {/* Multi-Select Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
        {filterOptions.map((item) => {
          const isActive = selectedFilters.includes(item.value);
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => toggleFilter(item.value)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {isActive && <Check size={13} className="text-blue-400" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sorting Dropdown */}
      <div className="relative w-full sm:w-auto">
        <ArrowDownWideNarrow
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none sm:w-[18px] sm:h-[18px]"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:min-w-[220px] appearance-none rounded-xl sm:rounded-2xl border border-slate-200/80 bg-slate-50/60 py-2 sm:py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-all hover:bg-slate-100 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title (A–Z)</option>
        </select>
      </div>

    </div>
  );
};

export default MemoriesFilters;