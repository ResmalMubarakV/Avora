// ==========================================
// PROFILE FILTERS COMPONENT
// ==========================================
/**
 * Renders filter controls for a traveler's profile memories list, including 
 * visibility toggles (All, Public, Private) for the profile owner.
 */
const ProfileFilters = ({
    isOwner,
    visibility,
    setVisibility,
}) => {
    const filters = [
        { label: "All", value: "all" },
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
    ];

    if (!isOwner) return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
            
            {/* Visibility Status Filter Buttons (Owner Only) */}
            <div className="inline-flex w-full sm:w-auto rounded-xl sm:rounded-2xl border border-slate-200/80 bg-slate-50/60 p-1">
                {filters.map((item) => {
                    const isActive = visibility === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setVisibility(item.value)}
                            className={`flex-1 sm:flex-initial rounded-lg sm:rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

        </div>
    );
};

export default ProfileFilters;