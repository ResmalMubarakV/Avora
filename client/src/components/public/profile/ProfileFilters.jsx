import { Check, LayoutGrid, Rows3, Calendar } from "lucide-react";

// ==========================================
// PROFILE FILTERS COMPONENT (Clean Fixed Layout)
// ==========================================
/**
 * Renders compact multi-select filter controls, year filter dropdown, and mobile layout toggles
 * in a clean fixed layout without horizontal scrolling on mobile viewports.
 */
const ProfileFilters = ({
    isOwner,
    selectedFilters = [],
    toggleFilter,
    selectedYear = "all",
    setYear,
    viewMode,
    setViewMode,
}) => {
    const filterOptions = isOwner
        ? [
              { label: "Public", value: "public" },
              { label: "Private", value: "private" },
              { label: "Liked", value: "liked" },
          ]
        : [
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
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900/90 p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
            
            {/* Filter Buttons & Year Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                {/* Filter Chips */}
                {filterOptions.map((item) => {
                    const isActive = selectedFilters.includes(item.value);
                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (toggleFilter) toggleFilter(item.value);
                            }}
                            className={`pointer-events-auto inline-flex items-center gap-1 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                                isActive
                                    ? "bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 text-white shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                    : "bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            {isActive && <Check size={12} className="text-blue-400 dark:text-sky-300" />}
                            <span>{item.label}</span>
                        </button>
                    );
                })}

                {/* Year Filter Dropdown */}
                {setYear && (
                    <div className="relative inline-block">
                        <Calendar
                            size={14}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                        />
                        <select
                            value={selectedYear}
                            onChange={(e) => setYear(e.target.value)}
                            className="appearance-none rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 py-1 sm:py-1.5 pl-7 pr-6 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-700 focus:border-slate-400 dark:focus:border-indigo-500 cursor-pointer"
                        >
                            {yearOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Layout Toggles - Visible ONLY on Mobile screens (sm:hidden) */}
            <div className="flex sm:hidden items-center gap-1 ml-auto">
                <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    title="Grid View (2 in a line)"
                    className={`inline-flex items-center justify-center rounded-lg p-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === "grid"
                            ? "bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 text-white shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                >
                    <LayoutGrid size={14} />
                </button>

                <button
                    type="button"
                    onClick={() => setViewMode("inline")}
                    title="Inline View (1 in a line)"
                    className={`inline-flex items-center justify-center rounded-lg p-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === "inline"
                            ? "bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 text-white shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                >
                    <Rows3 size={14} />
                </button>
            </div>

        </div>
    );
};

export default ProfileFilters;