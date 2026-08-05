import { useEffect, useMemo, useState } from "react";

import MemoriesCard from "../../../components/dashboard/memories/MemoriesCard";
import ProfileSearch from "./ProfileSearch";
import ProfileFilters from "./ProfileFilters";
import ProfilePagination from "./ProfilePagination";

const ITEMS_PER_PAGE = 12;

// ==========================================
// MEMORIES SECTION COMPONENT
// ==========================================
/**
 * Renders the traveler's memories collection section with live search filtering, 
 * visibility status filters, and responsive grid presentation.
 */
const MemoriesSection = ({
    memories,
    username,
    isOwner,
}) => {
    const [search, setSearch] = useState("");
    const [visibility, setVisibility] = useState(
        isOwner ? "all" : "public"
    );
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    // --- Filter & Sort Memories via UseMemo ---
    const filteredMemories = useMemo(() => {
        const keyword = search.toLowerCase();

        const filtered = memories.filter((memory) => {
            const matchesSearch =
                memory.title.toLowerCase().includes(keyword) ||
                memory.location.toLowerCase().includes(keyword);

            let matchesVisibility = true;

            if (isOwner) {
                if (visibility === "public") {
                    matchesVisibility = memory.isPublic;
                } else if (visibility === "private") {
                    matchesVisibility = !memory.isPublic;
                }
            } else {
                matchesVisibility = memory.isPublic;
            }

            return matchesSearch && matchesVisibility;
        });

        // --- Sorting Logic ---
        switch (sortBy) {
            case "oldest":
                filtered.sort(
                    (a, b) =>
                        new Date(a.startDate) - new Date(b.startDate)
                );
                break;
            case "title":
                filtered.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
                break;
            default:
                filtered.sort(
                    (a, b) =>
                        new Date(b.startDate) - new Date(a.startDate)
                );
        }

        return filtered;
    }, [memories, search, visibility, sortBy, isOwner]);

    // --- Reset to Page 1 on Filter Changes ---
    useEffect(() => {
        setCurrentPage(1);
    }, [search, visibility, sortBy]);

    // --- Pagination Calculations ---
    const totalPages = Math.max(
        1,
        Math.ceil(filteredMemories.length / ITEMS_PER_PAGE)
    );

    const paginatedMemories = filteredMemories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

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
            {/* Header & Controls Toolbar */}
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
                                mt-0.5
                                text-xs
                                sm:text-sm
                                font-medium
                                text-slate-500
                            "
                        >
                            {filteredMemories.length}{" "}
                            {filteredMemories.length === 1 ? "journey" : "journeys"} documented
                        </p>
                    )}
                </div>

                {/* Search Bar & Sort Dropdown Group */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial">
                        <ProfileSearch
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Quick Sort Dropdown (Visible for both owners and viewers uniformly next to search) */}
                    <div className="shrink-0">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
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

            {/* Filters Bar Component (Displayed only for profile owners, omitting duplicate sort) */}
            {isOwner && (
                <ProfileFilters
                    isOwner={isOwner}
                    visibility={visibility}
                    setVisibility={setVisibility}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    hideSort={true}
                />
            )}

            {/* Empty State or Grid Content */}
            {paginatedMemories.length === 0 ? (
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
                            : "This traveler hasn't shared any public memories yet."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Memory Cards Grid */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            xl:grid-cols-3
                            gap-4
                            sm:gap-6
                        "
                    >
                        {paginatedMemories.map((memory) => (
                            <MemoriesCard
                                key={memory._id}
                                memory={memory}
                                username={username}
                                isOwner={isOwner}
                                redirectTo={{
                                    from: `/${username}`,
                                    label: "Profile",
                                }}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls Component */}
                    <ProfilePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </>
            )}
        </section>
    );
};

export default MemoriesSection;