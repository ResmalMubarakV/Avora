import { Check } from "lucide-react";

// ==========================================
// PROFILE FILTERS COMPONENT
// ==========================================
/**
 * Renders multi-select filter controls for a traveler's profile memories list,
 * featuring explicit click handlers and touch responsiveness.
 */
const ProfileFilters = ({
    isOwner,
    selectedFilters = [],
    toggleFilter,
}) => {
    const filterOptions = [
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
        { label: "Liked", value: "liked" },
    ];

    if (!isOwner) return null;

    return (
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
            
            <div className="flex items-center gap-1.5 flex-wrap">
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
            </div>

        </div>
    );
};

export default ProfileFilters;