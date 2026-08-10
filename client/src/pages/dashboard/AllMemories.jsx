import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";

import { getMemories } from "../../api/memoryApi";
import MemoriesHeader from "../../components/dashboard/memories/MemoriesHeader";
import MemoriesSearch from "../../components/dashboard/memories/MemoriesSearch";
import MemoriesFilters from "../../components/dashboard/memories/MemoriesFilters";
import MemoriesPagination from "../../components/dashboard/memories/MemoriesPagination";
import MemoriesCard from "../../components/dashboard/memories/MemoriesCard";
import PageTitle from "../../components/common/PageTitle";

const ITEMS_PER_PAGE = 12;

const AllMemories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter");

  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  
  // Multi-select filters state (supports combining e.g. ["public", "liked"])
  const [selectedFilters, setSelectedFilters] = useState(
    initialFilter && initialFilter !== "all" ? [initialFilter] : []
  );
  
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Automatically scroll to top on initial page load or redirect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  // Sync filter if URL parameter changes dynamically
  useEffect(() => {
    const urlFilter = searchParams.get("filter");
    if (urlFilter && urlFilter !== "all") {
      setSelectedFilters([urlFilter]);
    }
  }, [searchParams]);

  // Toggle filter helper for multi-selection
  const toggleFilter = (filterValue) => {
    setSelectedFilters((prev) =>
      prev.includes(filterValue)
        ? prev.filter((f) => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  // --- Fetch All Memories on Mount ---
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

  // --- Multi-Condition Filter and Sort Memo (Standard sorting, ignores pinning here) ---
  const filteredMemories = useMemo(() => {
    const filtered = memories.filter((memory) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        memory.title.toLowerCase().includes(keyword) ||
        memory.location.toLowerCase().includes(keyword);

      if (!matchesSearch) return false;

      // If no filters selected, match everything
      if (selectedFilters.length === 0) return true;

      // Intersection logic: Memory must satisfy ALL selected filters (e.g. Public AND Liked)
      const matchesAll = selectedFilters.every((f) => {
        if (f === "public") return memory.isPublic;
        if (f === "private") return !memory.isPublic;
        if (f === "liked") return memory.isLiked;
        return true;
      });

      return matchesAll;
    });

    // Apply standard sorting criteria only
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
    }

    return filtered;
  }, [memories, search, selectedFilters, sortBy]);

  // Reset to page 1 whenever filters, search, or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedFilters, sortBy]);

  // --- Pagination Calculations ---
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMemories.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMemories = filteredMemories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      <PageTitle title="My Memories" />

      {/* Top Bar: Back Button & New Memory Action aligned in one line */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
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

      {/* Header and Total Count */}
      <MemoriesHeader total={filteredMemories.length} />

      {/* Search and Multi-Select Filter Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <MemoriesSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MemoriesFilters
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
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

      {/* Content States: Loading | Empty | Grid */}
      {loading ? (
        <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 text-slate-500">
          Loading your memories...
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No memories found</h2>
          <p className="mt-3 text-slate-500">
            Try adjusting your multi-select filters or search criteria.
          </p>
        </div>
      ) : (
        <>
          {/* Responsive Grid: 1 per line on mobile, 2 per line on tablet, 4 per line on desktop */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {paginatedMemories.map((memory) => (
              <MemoriesCard
                key={memory._id}
                memory={{ ...memory, isPinned: false }}
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

export default AllMemories;