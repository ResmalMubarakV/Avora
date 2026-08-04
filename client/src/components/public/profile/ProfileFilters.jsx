const ProfileFilters = ({
    isOwner,
    visibility,
    setVisibility,
    sortBy,
    setSortBy,
}) => {

    return (

        <div
            className="
                flex
                flex-col
                gap-4

                lg:flex-row
                lg:items-center
                lg:justify-between
            "
        >

            {/* Visibility */}

            {isOwner && (

    <div className="flex flex-wrap gap-3">

        <button
            type="button"
            onClick={() => setVisibility("all")}
            className={`
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-medium
                transition-all

                ${
                    visibility === "all"
                        ? "bg-[#3559D4] text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }
            `}
        >
            All
        </button>

        <button
            type="button"
            onClick={() => setVisibility("public")}
            className={`
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-medium
                transition-all

                ${
                    visibility === "public"
                        ? "bg-emerald-600 text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }
            `}
        >
            Public
        </button>

        <button
            type="button"
            onClick={() => setVisibility("private")}
            className={`
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-medium
                transition-all

                ${
                    visibility === "private"
                        ? "bg-slate-800 text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }
            `}
        >
            Private
        </button>

    </div>

)}

            {/* Sort */}

            <select
                value={sortBy}
                onChange={(e) =>
                    setSortBy(e.target.value)
                }
                className="
                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-4
                    py-2.5

                    text-sm
                    text-slate-700

                    shadow-sm

                    outline-none

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

    );

};

export default ProfileFilters;