import { useEffect, useRef, useState } from "react";
import SearchResults from "./SearchResults";
import api from "../../api/axios";

// ==========================================
// SEARCH BAR COMPONENT
// ==========================================
const SearchBar = () => {
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [results, setResults] = useState({
        users: [],
        memories: [],
        places: [],
    });
    const [loading, setLoading] = useState(false);

    // --- Click Outside to Close Search Results Popup ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    // --- Debounced API Search Effect ---
    useEffect(() => {
        if (!query.trim()) {
            setResults({
                users: [],
                memories: [],
                places: [],
            });
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);

                const { data } = await api.get(
                    `/api/search?q=${encodeURIComponent(query)}`
                );

                setResults(data);
            } catch (error) {
                console.error("Search query failed:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="w-full relative" ref={wrapperRef}>
            <div className="relative w-full">
                {/* Search Icon SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute left-4 sm:left-5 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                    />
                </svg>

                {/* Search Input Field */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    placeholder="Search memories, places, travelers..."
                    className="
                        h-11
                        sm:h-12
                        w-full
                        rounded-full
                        border
                        border-slate-200
                        dark:border-slate-800
                        bg-slate-50
                        dark:bg-slate-900/90
                        pl-12
                        pr-10
                        sm:pl-14
                        sm:pr-12
                        text-xs
                        sm:text-sm
                        text-slate-700
                        dark:text-slate-100
                        outline-none
                        transition-all
                        duration-200
                        placeholder:text-slate-400
                        dark:placeholder:text-slate-500
                        focus:border-slate-400
                        dark:focus:border-indigo-500
                        focus:bg-white
                        dark:focus:bg-slate-900
                        focus:ring-4
                        focus:ring-slate-100
                        dark:focus:ring-indigo-950/50
                    "
                />

                {/* Clear Query Button */}
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="
                            absolute
                            right-3
                            sm:right-4
                            top-1/2
                            -translate-y-1/2
                            rounded-full
                            cursor-pointer
                            p-1
                            text-slate-400
                            dark:text-slate-500
                            transition
                            hover:bg-slate-200
                            dark:hover:bg-slate-800
                            hover:text-slate-700
                            dark:hover:text-slate-200
                        "
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Search Results Dropdown Overlay - Positioned outside the navbar flow */}
            {focused && (query.trim() || loading || results.users.length > 0 || results.memories.length > 0 || results.places.length > 0) && (
                <div className="absolute left-0 right-0 top-full mt-3 z-[100] w-full shadow-2xl">
                    <SearchResults
                        open={focused}
                        query={query}
                        results={results}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;