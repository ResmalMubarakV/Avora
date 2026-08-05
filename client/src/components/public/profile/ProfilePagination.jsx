// ==========================================
// PROFILE PAGINATION COMPONENT
// ==========================================
/**
 * Renders pagination controls for traveler profile memories list.
 */
const ProfilePagination = ({
    currentPage,
    totalPages,
    setCurrentPage,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-10 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
                Previous
            </button>

            <span className="rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm">
                {currentPage} / {totalPages}
            </span>

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
                Next
            </button>
        </div>
    );
};

export default ProfilePagination;