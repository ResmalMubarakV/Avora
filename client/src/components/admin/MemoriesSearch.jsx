import { Search, Loader2, X } from "lucide-react";

// ==========================================
// ADMIN SEARCH COMPONENT WITH LIVE SPINNER
// ==========================================
const MemoriesSearch = ({ searchTerm, setSearchTerm, isSearching = false, placeholder = "Search..." }) => {
    return (
        <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-9 pr-20 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
            />

            {/* Right-side status: Live Spinner or Clear Button */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
                {isSearching ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-800/50 animate-pulse">
                        <Loader2 size={12} className="animate-spin" />
                        <span>Searching</span>
                    </div>
                ) : searchTerm ? (
                    <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        aria-label="Clear Search"
                        className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition"
                    >
                        <X size={15} />
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default MemoriesSearch;