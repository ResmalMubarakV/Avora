import { Search, Loader2, X } from "lucide-react";

// ==========================================
// ADMIN SEARCH COMPONENT WITH LIVE SPINNER
// ==========================================
/**
 * Renders an elite SaaS search bar with real-time typing animation, 
 * loading spinner feedback, and quick clear controls.
 */
const MemoriesSearch = ({ searchTerm, setSearchTerm, isSearching = false }) => {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <Search size={18} />
            </div>
            
            <input
                type="text"
                placeholder="Search memories by title, location, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-24 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#3559D4] focus:ring-4 focus:ring-blue-100 shadow-sm"
            />

            {/* Right-side status: Live Spinner or Clear Button */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 gap-2">
                {isSearching ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 animate-pulse">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Searching...</span>
                    </div>
                ) : searchTerm ? (
                    <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        aria-label="Clear Search"
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition"
                    >
                        <X size={16} />
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default MemoriesSearch;