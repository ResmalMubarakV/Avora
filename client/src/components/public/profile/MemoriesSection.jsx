import { useEffect, useMemo, useState } from "react";

import MemoriesCard from "../../dashboard/memories/MemoriesCard";
import ProfileSearch from "./ProfileSearch";
import ProfileFilters from "./ProfileFilters";
import ProfilePagination from "./ProfilePagination";

const ITEMS_PER_PAGE = 12;

const MemoriesSection = ({
    memories,
    username,
    isOwner,
}) => {

    const [search, setSearch] = useState("");

    const [visibility, setVisibility] =
        useState(
            isOwner
                ? "all"
                : "public"
        );

    const [sortBy, setSortBy] =
        useState("newest");

    const [currentPage, setCurrentPage] =
        useState(1);

    const filteredMemories = useMemo(() => {

        const keyword =
            search.toLowerCase();

        const filtered =
            memories.filter((memory) => {

                const matchesSearch =

                    memory.title
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    memory.location
                        .toLowerCase()
                        .includes(keyword);

                let matchesVisibility = true;

                if (isOwner) {

                    if (
                        visibility === "public"
                    ) {

                        matchesVisibility =
                            memory.isPublic;

                    }

                    else if (
                        visibility === "private"
                    ) {

                        matchesVisibility =
                            !memory.isPublic;

                    }

                } else {

                    matchesVisibility =
                        memory.isPublic;

                }

                return (

                    matchesSearch &&

                    matchesVisibility

                );

            });

        switch (sortBy) {

            case "oldest":

                filtered.sort(

                    (a, b) =>

                        new Date(a.startDate)

                        -

                        new Date(b.startDate)

                );

                break;

            case "title":

                filtered.sort(

                    (a, b) =>

                        a.title.localeCompare(
                            b.title
                        )

                );

                break;

            default:

                filtered.sort(

                    (a, b) =>

                        new Date(b.startDate)

                        -

                        new Date(a.startDate)

                );

        }

        return filtered;

    }, [

        memories,

        search,

        visibility,

        sortBy,

        isOwner,

    ]);

    useEffect(() => {

        setCurrentPage(1);

    }, [

        search,

        visibility,

        sortBy,

    ]);

    const totalPages = Math.max(

        1,

        Math.ceil(

            filteredMemories.length /

            ITEMS_PER_PAGE

        )

    );

    const paginatedMemories =
        filteredMemories.slice(

            (currentPage - 1) *
                ITEMS_PER_PAGE,

            currentPage *
                ITEMS_PER_PAGE

        );

    useEffect(() => {

        if (

            currentPage >

            totalPages

        ) {

            setCurrentPage(
                totalPages
            );

        }

    }, [

        currentPage,

        totalPages,

    ]);

    return (

        <section
            className="
                mx-auto
                mt-16
                max-w-7xl
                px-6
                pb-20
            "
        >

            {/* Header */}

            <div
                className="
                    mb-8

                    flex
                    flex-col

                    gap-6

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <div>

                    <h2
                        className="
                            text-3xl
                            font-bold
                            text-slate-900
                        "
                    >

                        {isOwner

                            ? "Your Memories"

                            : "Travel Memories"}

                    </h2>

                    {isOwner && (

                        <p
                            className="
                                mt-2
                                text-slate-500
                            "
                        >

                            {filteredMemories.length}

                            {" "}

                            memory

                            {filteredMemories.length !== 1
                                ? "ies"
                                : ""}

                        </p>

                    )}

                </div>

                <ProfileSearch
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </div>
            <ProfileFilters
                isOwner={isOwner}
                visibility={visibility}
                setVisibility={setVisibility}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
                        {/* Empty State */}

            {paginatedMemories.length === 0 ? (

                <div
                    className="
                        mt-12

                        rounded-3xl

                        border
                        border-dashed
                        border-slate-300

                        bg-white

                        px-8
                        py-20

                        text-center
                    "
                >

                    <h3
                        className="
                            text-2xl
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
                            mt-3
                            text-slate-500
                        "
                    >

                        {isOwner
                            ? "Try changing your filters or create a new memory."
                            : "This traveler hasn't shared any public memories yet."}

                    </p>

                </div>

            ) : (

                <>

                    {/* Memory Grid */}

                    <div
                        className="
                            mt-10

                            grid

                            gap-6

                            sm:grid-cols-2

                            xl:grid-cols-3
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

                    {/* Pagination */}

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