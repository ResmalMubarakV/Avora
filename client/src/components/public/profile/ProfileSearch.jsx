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
                className="w-full rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-100 shadow-sm outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#3559D4] dark:focus:border-indigo-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
            />

            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer text-xs"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default ProfileSearch;