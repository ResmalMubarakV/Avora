import { useEffect, useMemo, useState } from "react";

import MemoriesCard from "../../../components/dashboard/memories/MemoriesCard";
import ProfileSearch from "./ProfileSearch";
import ProfileFilters from "./ProfileFilters";
import ProfilePagination from "./ProfilePagination";

const ITEMS_PER_PAGE_GRID = 12;
const ITEMS_PER_PAGE_INLINE = 6;

// ==========================================
// MEMORIES SECTION COMPONENT
// ==========================================
const MemoriesSection = ({
    memories,
    username,
    isOwner,
}) => {
    const [search, setSearch] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid");

    const itemsPerPage = viewMode === "inline" ? ITEMS_PER_PAGE_INLINE : ITEMS_PER_PAGE_GRID;

    const toggleFilter = (filterValue) => {
        setSelectedFilters((prev) =>
            prev.includes(filterValue)
                ? prev.filter((f) => f !== filterValue)
                : [...prev, filterValue]
        );
    };

    const filteredMemories = useMemo(() => {
        const keyword = search.toLowerCase();

        const filtered = memories.filter((memory) => {
            const matchesSearch =
                memory.title.toLowerCase().includes(keyword) ||
                memory.location.toLowerCase().includes(keyword);

            if (!matchesSearch) return false;

            if (!isOwner && !memory.isPublic) {
                return false;
            }

            if (selectedFilters.length === 0) return true;

            const matchesAll = selectedFilters.every((f) => {
                if (f === "public") return memory.isPublic;
                if (f === "private") return !memory.isPublic;
                if (f === "liked") return memory.isLiked;
                return true;
            });

            return matchesAll;
        });

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
    }, [memories, search, selectedFilters, sortBy, isOwner]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedFilters, sortBy, viewMode]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredMemories.length / itemsPerPage)
    );

    const paginatedMemories = filteredMemories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
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
                                mt-1.5
                                text-xs
                                sm:text-sm
                                font-medium
                                text-slate-500
                                tracking-wider
                                [word-spacing:0.25rem]
                            "
                        >
                            {filteredMemories.length}{" "}
                            {filteredMemories.length === 1 ? "journey" : "journeys"} documented
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial">
                        <ProfileSearch
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

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

            <ProfileFilters
                isOwner={isOwner}
                selectedFilters={selectedFilters}
                toggleFilter={toggleFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

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
                            : "This traveler hasn't shared any public memories matching your filters yet."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Responsive Grid: 2 per line on mobile (grid-cols-2), 2 per line on Tablet (sm:grid-cols-2), 4 per line on Desktop (xl:grid-cols-4) */}
                    <div
                        className={
                            viewMode === "inline"
                                ? "flex flex-col max-w-3xl mx-auto gap-6"
                                : "grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4"
                        }
                    >
                        {paginatedMemories.map((memory) => (
                            <div
                                key={memory._id}
                                className="w-full"
                            >
                                <MemoriesCard
                                    memory={memory}
                                    username={username}
                                    isOwner={isOwner}
                                    redirectTo={{
                                        from: `/u/${username}`,
                                        label: "Profile",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

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