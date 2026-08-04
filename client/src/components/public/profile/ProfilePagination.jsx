const ProfilePagination = ({
    currentPage,
    totalPages,
    setCurrentPage,
}) => {

    if (totalPages <= 1) return null;

    return (

        <div
            className="
                mt-12

                flex
                items-center
                justify-center

                gap-3
            "
        >

            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                    setCurrentPage(currentPage - 1)
                }
                className="
                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-5
                    py-2.5

                    text-sm
                    font-medium
                    text-slate-700

                    shadow-sm

                    transition

                    hover:bg-slate-50

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >

                Previous

            </button>

            <span
                className="
                    rounded-xl

                    bg-[#3559D4]

                    px-5
                    py-2.5

                    text-sm
                    font-semibold
                    text-white

                    shadow-md
                "
            >

                {currentPage} / {totalPages}

            </span>

            <button
                type="button"
                disabled={
                    currentPage === totalPages
                }
                onClick={() =>
                    setCurrentPage(currentPage + 1)
                }
                className="
                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-5
                    py-2.5

                    text-sm
                    font-medium
                    text-slate-700

                    shadow-sm

                    transition

                    hover:bg-slate-50

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >

                Next

            </button>

        </div>

    );

};

export default ProfilePagination;