import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../../../api/axios";

import MemoriesCard from "../../../components/dashboard/memories/MemoriesCard";
import ProfileSearch from "./ProfileSearch";
import ProfileFilters from "./ProfileFilters";
import ProfilePagination from "./ProfilePagination";

// ==========================================
// MEMORIES SECTION COMPONENT (Self-fetching & Isolated)
// ==========================================
const MemoriesSection = ({ username, isOwner }) => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page")) || 1;
    const sortBy = searchParams.get("sort") || "newest";
    const filterParam = searchParams.get("filter") || "";
    const search = searchParams.get("search") || "";

    const currentFilters = filterParam ? filterParam.split(",") : [];

    const [memories, setMemories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredCount, setFilteredCount] = useState(0); // Tracks count based on active filters/search
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");

    // Refreshes the memories section without refreshing the whole browser window
    useEffect(() => {
        if (!username) return;

        let isMounted = true;
        const fetchMemories = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/api/public/${username}`, {
                    params: {
                        page: currentPage,
                        sort: sortBy,
                        filter: filterParam,
                        search: search,
                    }
                });

                if (isMounted) {
                    setMemories(data.memories || []);
                    setTotalPages(data.totalPages || 1);
                    // Use backend's filtered total count if available, falling back to array length
                    setFilteredCount(data.totalMemories ?? data.count ?? (data.memories ? data.memories.length : 0));
                }
            } catch (error) {
                console.error("Failed to load profile memories:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMemories();

        return () => {
            isMounted = false;
        };
    }, [username, currentPage, sortBy, filterParam, search]);

    const toggleFilter = (filterValue) => {
        const updatedFilters = currentFilters.includes(filterValue)
            ? currentFilters.filter((f) => f !== filterValue)
            : [...currentFilters, filterValue];

        if (updatedFilters.length > 0) {
            searchParams.set("filter", updatedFilters.join(","));
        } else {
            searchParams.delete("filter");
        }
        searchParams.delete("page");
        setSearchParams(searchParams, { replace: true });
    };

    const handlePinUpdated = (id, newPinnedState) => {
        setMemories((prev) =>
            prev.map((m) => (m._id === id ? { ...m, isPinned: newPinnedState } : m))
        );
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (value) {
            searchParams.set("search", value);
        } else {
            searchParams.delete("search");
        }
        searchParams.delete("page");
        setSearchParams(searchParams, { replace: true });
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        searchParams.set("sort", newSort);
        searchParams.delete("page");
        setSearchParams(searchParams, { replace: true });
    };

    const handlePageChange = (newPage) => {
        if (newPage > 1) {
            searchParams.set("page", newPage.toString());
        } else {
            searchParams.delete("page");
        }
        setSearchParams(searchParams, { replace: true });

        // Smooth scroll only when changing pages
        setTimeout(() => {
            window.scrollTo({
                top: window.innerHeight * 0.4,
                behavior: "smooth",
            });
        }, 50);
    };

    return (
        <section
            className="
                mx-auto
                mt-8
                sm:mt-12
                max-w-7xl
                px-4
                sm:px-6
                pb-20
                space-y-6
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h2
                        className="
                            text-xl
                            sm:text-2xl
                            lg:text-3xl
                            font-bold
                            text-slate-900
                            tracking-tight
                        "
                    >
                        {isOwner ? "Your Memories" : "Travel Memories"}
                    </h2>

                    {isOwner && (
                        <p
                            className="
                                mt-1.5
                                text-xs
                                sm:text-sm
                                font-medium
                                text-slate-500
                                tracking-wider
                                [word-spacing:0.25rem]
                            "
                        >
                            {filteredCount}{" "}
                            {filteredCount === 1 ? "journey" : "journeys"} found
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial">
                        <ProfileSearch
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="shrink-0">
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            title="Sort memories dropdown"
                            aria-label="Sort memories dropdown"
                            className="
                                h-10
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-xs
                                sm:text-sm
                                font-medium
                                text-slate-700
                                shadow-sm
                                focus:border-blue-500
                                focus:outline-none
                                cursor-pointer
                            "
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Title (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            <ProfileFilters
                isOwner={isOwner}
                selectedFilters={currentFilters}
                toggleFilter={toggleFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-white py-24 text-center text-slate-400">
                    Loading memories...
                </div>
            ) : memories.length === 0 ? (
                <div
                    className="
                        rounded-2xl
                        sm:rounded-3xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        px-6
                        py-16
                        text-center
                        shadow-sm
                    "
                >
                    <h3
                        className="
                            text-lg
                            sm:text-xl
                            font-semibold
                            text-slate-900
                        "
                    >
                        {isOwner
                            ? "No memories found"
                            : "No public memories"}
                    </h3>

                    <p
                        className="
                            mt-2
                            text-xs
                            sm:text-sm
                            text-slate-500
                            max-w-md
                            mx-auto
                        "
                    >
                        {isOwner
                            ? "Try changing your filters or create a new memory."
                            : "This traveler hasn't shared any public memories matching your filters yet."}
                    </p>
                </div>
            ) : (
                <>
                    <div
                        className={
                            viewMode === "inline"
                                ? "flex flex-col max-w-3xl mx-auto gap-6"
                                : "grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4"
                        }
                    >
                        {memories.map((memory) => (
                            <div
                                key={memory._id}
                                className="w-full"
                            >
                                <MemoriesCard
                                    memory={memory}
                                    username={username}
                                    isOwner={isOwner}
                                    redirectTo={{
                                        from: location.pathname + location.search,
                                        label: "Profile",
                                    }}
                                    onPinUpdated={handlePinUpdated}
                                />
                            </div>
                        ))}
                    </div>

                    <ProfilePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={handlePageChange}
                    />
                </>
            )}
        </section>
    );
};

export default MemoriesSection;