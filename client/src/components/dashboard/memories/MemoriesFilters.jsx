import { ArrowDownWideNarrow, Check, Calendar } from "lucide-react";

// ==========================================
// MEMORIES FILTERS COMPONENT (Fixed Responsive Layout)
// ==========================================
/**
 * Renders filter chips, year selector dropdown, and sorting dropdown
 * in a responsive fixed layout without horizontal scrolling on mobile viewports.
 */
const MemoriesFilters = ({
  selectedFilters,
  toggleFilter,
  sortBy,
  setSortBy,
  selectedYear = "all",
  setYear,
}) => {
  const filterOptions = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
    { label: "Liked", value: "liked" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { label: "All Years", value: "all" },
    { label: `${currentYear}`, value: `${currentYear}` },
    { label: `${currentYear - 1}`, value: `${currentYear - 1}` },
    { label: `${currentYear - 2}`, value: `${currentYear - 2}` },
    { label: `${currentYear - 3}`, value: `${currentYear - 3}` },
    { label: `${currentYear - 4}`, value: `${currentYear - 4}` },
    { label: "Older", value: "older" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 bg-white dark:bg-slate-900/90 p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      
      {/* Multi-Select Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-0.5 shrink-0">Filter:</span>
        {filterOptions.map((item) => {
          const isActive = selectedFilters.includes(item.value);
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => toggleFilter(item.value)}
              className={`inline-flex items-center gap-1 rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 text-white shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isActive && <Check size={12} className="text-blue-400 dark:text-sky-300" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Select Controls: Year & Sorting (Fixed Responsive Layout) */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        {/* Year Filter Dropdown */}
        {setYear && (
          <div className="relative flex-1 sm:flex-initial">
            <Calendar
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <select
              value={selectedYear}
              onChange={(e) => setYear(e.target.value)}
              className="w-full sm:min-w-[125px] appearance-none rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 py-1.5 sm:py-2 pl-7 pr-6 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-800 focus:border-slate-400 dark:focus:border-indigo-500 cursor-pointer"
            >
              {yearOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sorting Dropdown */}
        <div className="relative flex-1 sm:flex-initial">
          <ArrowDownWideNarrow
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:min-w-[150px] appearance-none rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 py-1.5 sm:py-2 pl-7 pr-6 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-800 focus:border-slate-400 dark:focus:border-indigo-500 cursor-pointer"
          >
            <option value="newest" className="dark:bg-slate-900 dark:text-white">Newest First</option>
            <option value="oldest" className="dark:bg-slate-900 dark:text-white">Oldest First</option>
            <option value="title" className="dark:bg-slate-900 dark:text-white">Title (A–Z)</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default MemoriesFilters;