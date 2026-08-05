import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ==========================================
// MEMORIES PAGINATION COMPONENT
// ==========================================
/**
 * Renders pagination controls for navigating across paginated memory lists.
 * Includes Previous/Next buttons and numbered page selection buttons with active styling.
 */
const MemoriesPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  // Hide pagination if there is 1 or fewer pages
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={`h-11 w-11 rounded-xl text-sm font-semibold transition-all duration-300 ${
            currentPage === page
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] text-white shadow-md"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default MemoriesPagination;