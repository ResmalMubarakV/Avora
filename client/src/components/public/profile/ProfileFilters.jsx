import { Check, LayoutGrid, Rows3 } from "lucide-react";

// ==========================================
// PROFILE FILTERS COMPONENT
// ==========================================
/**
 * Renders compact multi-select filter controls and mobile-only layout toggle buttons
 * guaranteed to stay in a single line on smaller mobile viewports.
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
        <div className="relative z-10 flex items-center justify-between gap-2 bg-white p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-x-hidden">
            
            {/* Filter Buttons & Mobile-Only Layout Toggles Forced in Same Line */}
            <div className="flex items-center gap-1 sm:gap-1.5 w-full justify-between sm:justify-start">
                
                <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mr-0.5">Filter:</span>
                    
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
                                className={`pointer-events-auto inline-flex items-center gap-1 rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none shrink-0 ${
                                    isActive
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                {isActive && <Check size={12} className="text-blue-400" />}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Layout Toggles - Visible ONLY on Mobile screens (sm:hidden) */}
                <div className="flex sm:hidden items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        title="Grid View (2 in a line)"
                        className={`inline-flex items-center justify-center rounded-lg p-1.5 text-xs font-semibold transition-all cursor-pointer ${
                            viewMode === "grid"
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <LayoutGrid size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("inline")}
                        title="Inline View (1 in a line)"
                        className={`inline-flex items-center justify-center rounded-lg p-1.5 text-xs font-semibold transition-all cursor-pointer ${
                            viewMode === "inline"
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <Rows3 size={15} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProfileFilters;