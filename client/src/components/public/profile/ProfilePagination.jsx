import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

// ==========================================
// PROFILE PAGINATION COMPONENT
// ==========================================
/**
 * Renders a compact, e-commerce style centered pagination bar synced with URL search params.
 */
const ProfilePagination = ({
    totalPages,
    currentPage: propCurrentPage,
    setCurrentPage: propSetCurrentPage,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Fallback gracefully if props are passed directly or via URL
    const currentPage = propCurrentPage || parseInt(searchParams.get("page")) || 1;

    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        // Update URL query parameters (e.g., ?page=2)
        setSearchParams({ page: newPage });

        // Update parent state if provided
        if (propSetCurrentPage) {
            propSetCurrentPage(newPage);
        }

        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }, 50);
    };

    return (
        <nav
            aria-label="Profile Memories Pagination"
            className="mt-10 sm:mt-12 flex items-center justify-center"
        >
            <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                    <ChevronLeft size={14} />
                    <span className="hidden xs:inline">Prev</span>
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                <div className="flex items-center gap-1">
                    {pages.map((page) => {
                        const isCurrent = page === currentPage;
                        return (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                aria-current={isCurrent ? "page" : undefined}
                                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition cursor-pointer ${
                                    isCurrent
                                        ? "bg-[#1E3A8A] text-white shadow-sm"
                                        : "text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight size={14} />
                </button>
            </div>
        </nav>
    );
};

export default ProfilePagination;