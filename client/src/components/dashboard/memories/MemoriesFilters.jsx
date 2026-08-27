import { ArrowDownWideNarrow, Check, Calendar } from "lucide-react";

// ==========================================
// MEMORIES FILTERS COMPONENT
// ==========================================
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900/90 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* Multi-Select Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
        {filterOptions.map((item) => {
          const isActive = selectedFilters.includes(item.value);
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => toggleFilter(item.value)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 text-white shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isActive && <Check size={13} className="text-blue-400 dark:text-sky-300" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Select Controls: Year & Sorting */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
        {/* Year Filter Dropdown */}
        {setYear && (
          <div className="relative w-full sm:w-auto">
            <Calendar
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none sm:w-[17px] sm:h-[17px]"
            />
            <select
              value={selectedYear}
              onChange={(e) => setYear(e.target.value)}
              className="w-full sm:min-w-[140px] appearance-none rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 py-2 sm:py-2.5 pl-10 pr-8 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-800 focus:border-slate-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-indigo-950/50 cursor-pointer"
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
        <div className="relative w-full sm:w-auto">
          <ArrowDownWideNarrow
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none sm:w-[18px] sm:h-[18px]"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:min-w-[180px] appearance-none rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 py-2 sm:py-2.5 pl-10 pr-8 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-800 focus:border-slate-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-indigo-950/50 cursor-pointer"
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