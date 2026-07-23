import { useEffect, useRef, useState } from "react";
import SearchResults from "./SearchResults";
import api from "../../api/axios";

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
                console.log("API Response:", data);

            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
            }

        }, 300);

        return () => clearTimeout(timer);

    }, [query]);

    return (
        <div className="hidden flex-1 px-8 lg:flex">
            <div
                ref={wrapperRef}
                className="relative w-full max-w-3xl"
            >

                {/* Search Icon */}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    placeholder="Search memories, places, travelers..."
                    className="
                        h-12
                        w-full
                        rounded-full
                        border
                        border-slate-200
                        bg-slate-50
                        pl-14
                        pr-12
                        text-sm
                        text-slate-700
                        outline-none
                        transition-all
                        duration-200
                        placeholder:text-slate-400
                        focus:border-slate-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-slate-100
                    "
                />

                {/* Clear */}

                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            rounded-full
                            p-1
                            text-slate-400
                            transition
                            hover:bg-slate-200
                            hover:text-slate-700
                        "
                    >
                        ✕
                    </button>
                )}

                <SearchResults
                    open={focused}
                    query={query}
                    results={results}
                    loading={loading}
                />

            </div>
        </div>
    );
};

export default SearchBar;