import { ArrowDownWideNarrow } from "lucide-react";

const MemoriesFilters = ({
    visibility,
    setVisibility,
    sortBy,
    setSortBy,
}) => {

    const filters = [
        { label: "All", value: "all" },
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
    ];

    return (

        <div
            className="
                flex
                flex-col
                gap-4

                xl:flex-row
                xl:items-center
                xl:justify-between
            "
        >

            {/* Visibility */}

            <div
                className="
                    inline-flex
                    w-fit
                    flex-wrap
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-1
                    shadow-sm
                "
            >

                {filters.map((item) => (

                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setVisibility(item.value)}
                        className={`
                            rounded-xl
                            px-5
                            py-2.5

                            text-sm
                            font-medium

                            transition-all
                            duration-300

                            ${
                                visibility === item.value
                                    ? "bg-[#3559D4] text-white shadow-md"
                                    : "text-slate-600 hover:bg-slate-100"
                            }
                        `}
                    >
                        {item.label}
                    </button>

                ))}

            </div>

            {/* Sort */}

            <div className="relative">

                <ArrowDownWideNarrow
                    size={18}
                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        pointer-events-none
                    "
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="
                        w-full
                        min-w-[240px]

                        appearance-none

                        rounded-2xl
                        border
                        border-slate-200

                        bg-white

                        py-3
                        pl-11
                        pr-10

                        text-sm
                        font-medium
                        text-slate-700

                        shadow-sm

                        outline-none

                        transition-all
                        duration-300

                        focus:border-[#3559D4]
                        focus:ring-4
                        focus:ring-blue-100
                    "
                >

                    <option value="newest">
                        Newest First
                    </option>

                    <option value="oldest">
                        Oldest First
                    </option>

                    <option value="title">
                        Title (A–Z)
                    </option>

                </select>

            </div>

        </div>

    );

};

export default MemoriesFilters;