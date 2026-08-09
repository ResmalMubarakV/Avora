import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemoriesCard from "./memories/MemoriesCard";

// ==========================================
// RECENT MEMORIES COMPONENT
// ==========================================
const RecentMemories = ({ memories: initialMemories }) => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState(initialMemories);

  // Handle local pin state changes
  const handlePinUpdated = (id, newPinnedState) => {
    setMemories((prev) => {
      const updated = prev.map((m) => (m._id === id ? { ...m, isPinned: newPinnedState } : m));
      // Sort pinned to top if no search filters are active
      return updated.sort((a, b) => {
        if (a.isPinned === b.isPinned) return new Date(b.startDate) - new Date(a.startDate);
        return a.isPinned ? -1 : 1;
      });
    });
  };

  return (
    <section>
      {/* Section Header & View All Action */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Memories</h2>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
            Your latest travel stories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/memories")}
          className="text-xs sm:text-sm font-semibold text-[#1E3A8A] transition hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {memories.slice(0, 8).map((memory, index) => (
          <div
            key={memory._id}
            className={`
              ${
                index >= 6
                  ? "hidden sm:block"
                  : ""
              }
            `}
          >
            <MemoriesCard
              memory={memory}
              isOwner={true}
              redirectTo={{
                from: "/dashboard",
                label: "Dashboard",
              }}
              onPinUpdated={handlePinUpdated}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentMemories;