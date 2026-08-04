import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getMemories } from "../../api/memoryApi";

import MemoriesHeader from "../../components/dashboard/memories/MemoriesHeader";
import MemoriesSearch from "../../components/dashboard/memories/MemoriesSearch";
import MemoriesFilters from "../../components/dashboard/memories/MemoriesFilters";
import MemoriesPagination from "../../components/dashboard/memories/MemoriesPagination";
import MemoriesCard from "../../components/dashboard/memories/MemoriesCard";

const ITEMS_PER_PAGE = 12;

const Memories = () => {

    const [loading, setLoading] = useState(true);

    const [memories, setMemories] = useState([]);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("all");

    const [sortBy, setSortBy] = useState("newest");

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {

        const fetchMemories = async () => {

            try {

                setLoading(true);

                const data = await getMemories();

                setMemories(data);

            } catch (error) {

                console.error(error);

                toast.error("Unable to load memories.");

            } finally {

                setLoading(false);

            }

        };

        fetchMemories();

    }, []);

    const filteredMemories = useMemo(() => {

        const filtered = memories.filter((memory) => {

            const keyword = search.toLowerCase();

            const matchesSearch =
                memory.title.toLowerCase().includes(keyword) ||
                memory.location.toLowerCase().includes(keyword);

            const matchesVisibility =
                filter === "all"
                    ? true
                    : filter === "public"
                    ? memory.isPublic
                    : !memory.isPublic;

            return matchesSearch && matchesVisibility;

        });

        switch (sortBy) {

            case "oldest":

                filtered.sort(
                    (a, b) =>
                        new Date(a.startDate) -
                        new Date(b.startDate)
                );

                break;

            case "title":

                filtered.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );

                break;

            case "newest":
            default:

                filtered.sort(
                    (a, b) =>
                        new Date(b.startDate) -
                        new Date(a.startDate)
                );

        }

        return filtered;

    }, [
        memories,
        search,
        filter,
        sortBy,
    ]);

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        filter,
        sortBy,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredMemories.length / ITEMS_PER_PAGE)
    );

    useEffect(() => {

        if (currentPage > totalPages) {

            setCurrentPage(totalPages);

        }

    }, [
        currentPage,
        totalPages,
    ]);

    const paginatedMemories = filteredMemories.slice(

        (currentPage - 1) * ITEMS_PER_PAGE,

        currentPage * ITEMS_PER_PAGE

    );

    return (

        <div className="space-y-8">

            <MemoriesHeader
                total={filteredMemories.length}
            />

            <div
                className="
                    flex
                    flex-col
                    gap-5

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <MemoriesSearch
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <MemoriesFilters
                    visibility={filter}
                    setVisibility={setFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

            </div>

            <div
                className="
                    flex
                    items-center
                    justify-between

                    text-sm
                    text-slate-500
                "
            >

                <span>

                    Showing

                    <span className="mx-1 font-semibold text-slate-900">

                        {filteredMemories.length}

                    </span>

                    of

                    <span className="mx-1 font-semibold text-slate-900">

                        {memories.length}

                    </span>

                    memories

                </span>

            </div>

            {loading ? (

                <div
                    className="
                        flex
                        items-center
                        justify-center

                        rounded-3xl
                        border
                        border-slate-200

                        bg-white

                        py-24

                        text-slate-500
                    "
                >

                    Loading your memories...

                </div>

            ) : filteredMemories.length === 0 ? (

                <div
                    className="
                        rounded-3xl
                        border
                        border-dashed
                        border-slate-300

                        bg-white

                        py-24

                        text-center
                    "
                >

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        No memories found
                    </h2>

                    <p
                        className="
                            mt-3
                            text-slate-500
                        "
                    >
                        Try another search, change the
                        filters, or create your next
                        journey.
                    </p>

                </div>

            ) : (

                <>

                    <div
                        className="
                            grid
                            gap-8

                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {paginatedMemories.map((memory) => (

                            <MemoriesCard
                                key={memory._id}
                                memory={memory}
                                isOwner={true}
                                redirectTo={{
                                    from: "/dashboard/memories",
                                    label: "My Memories",
                                }}
                            />

                        ))}

                    </div>

                    <MemoriesPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />

                </>

            )}

        </div>

    );

};

export default Memories;