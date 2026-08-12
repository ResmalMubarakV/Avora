import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";

import useMemories from "../../hooks/useMemories";
import MemoriesHeader from "../../components/dashboard/memories/MemoriesHeader";
import MemoriesSearch from "../../components/dashboard/memories/MemoriesSearch";
import MemoriesFilters from "../../components/dashboard/memories/MemoriesFilters";
import MemoriesPagination from "../../components/dashboard/memories/MemoriesPagination";
import MemoriesCard from "../../components/dashboard/memories/MemoriesCard";
import PageTitle from "../../components/common/PageTitle";

const AllMemories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { memories: apiResponse, loading, error } = useMemories();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort") || "newest";
  const filterParam = searchParams.get("filter") || "";
  const selectedFilters = filterParam ? filterParam.split(",") : [];

  const memories = Array.isArray(apiResponse) ? apiResponse : (apiResponse?.memories || []);
  const totalPages = apiResponse?.totalPages || 1;
  const totalCount = apiResponse?.totalMemories || memories.length;

  // Scroll to top on page/filter change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname, currentPage, sortBy, filterParam]);

  // Handle multi-select filter toggle
  const toggleFilter = (filterValue) => {
    const updatedFilters = selectedFilters.includes(filterValue)
      ? selectedFilters.filter((f) => f !== filterValue)
      : [...selectedFilters, filterValue];

    if (updatedFilters.length > 0) {
      searchParams.set("filter", updatedFilters.join(","));
    } else {
      searchParams.delete("filter");
    }
    searchParams.delete("page");
    setSearchParams(searchParams, { replace: true });
  };

  // Handle Search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      searchParams.set("search", value);
    } else {
      searchParams.delete("search");
    }
    searchParams.delete("page");
    setSearchParams(searchParams, { replace: true });
  };

  // Handle Sort change
  const handleSortChange = (newSort) => {
    searchParams.set("sort", newSort);
    searchParams.delete("page");
    setSearchParams(searchParams, { replace: true });
  };

  // Handle Page change
  const handlePageChange = (newPage) => {
    if (newPage > 1) {
      searchParams.set("page", newPage.toString());
    } else {
      searchParams.delete("page");
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      <PageTitle title="My Memories" />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Updated Back Button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard/create-memory")}
          className="group inline-flex cursor-pointer items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-slate-900 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]"
        >
          <Plus
            size={16}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span className="hidden sm:inline">New Memory</span>
          <span className="inline sm:hidden">New</span>
        </button>
      </div>

      <MemoriesHeader total={totalCount} />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <MemoriesSearch
          value={search}
          onChange={handleSearchChange}
        />
        <MemoriesFilters
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
          sortBy={sortBy}
          setSortBy={handleSortChange}
        />
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
        <span>
          Showing items
          <span className="mx-1 font-semibold text-slate-900">
            ({totalCount} total found)
          </span>
        </span>
      </div>

      {/* Content States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[#3559D4]" />
          <p className="text-sm font-medium text-slate-500">Loading your memories...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 py-16 text-center text-red-500">
          {error}
        </div>
      ) : memories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No memories found</h2>
          <p className="mt-3 text-slate-500">
            Try adjusting your multi-select filters or search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {memories.map((memory) => (
              <MemoriesCard
                key={memory._id}
                memory={memory}
                isOwner={true}
                redirectTo={{
                  from: location.pathname + location.search,
                  label: "My Memories",
                }}
              />
            ))}
          </div>

          <MemoriesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default AllMemories;