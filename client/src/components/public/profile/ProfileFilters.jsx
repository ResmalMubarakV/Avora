import { Check, LayoutGrid, Rows3 } from "lucide-react";

// ==========================================
// PROFILE FILTERS COMPONENT
// ==========================================
/**
 * Renders multi-select filter controls and mobile-only layout toggle buttons.
 */
const ProfileFilters = ({
    isOwner,
    selectedFilters = [],
    toggleFilter,
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

    return (
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
            
            {/* Filter Buttons & Mobile-Only Layout Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
                
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
                            className={`pointer-events-auto inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
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

                {/* Layout Toggles - Visible ONLY on Mobile screens (sm:hidden) */}
                <div className="flex sm:hidden items-center gap-1.5 ml-auto">
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        title="Grid View (2 in a line)"
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                            viewMode === "grid"
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <LayoutGrid size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("inline")}
                        title="Inline View (1 in a line)"
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                            viewMode === "inline"
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <Rows3 size={14} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProfileFilters;