// ==========================================
// PROFILE SEARCH COMPONENT
// ==========================================
/**
 * Renders an input search bar for traveler profile memories with an interactive 
 * clear button.
 */
const ProfileSearch = ({
    value,
    onChange,
}) => {
    const handleClear = () => {
        onChange({ target: { value: "" } });
    };

    return (
        <div className="relative w-full sm:w-72 lg:w-80">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search memories..."
                className="w-full rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100"
            />

            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer text-xs"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default ProfileSearch;