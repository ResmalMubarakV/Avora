import { useNavigate } from "react-router-dom";
import MemoriesCard from "./memories/MemoriesCard";

// ==========================================
// RECENT MEMORIES COMPONENT
// ==========================================
/**
 * Renders a grid section showcasing the user's most recent travel memories on the dashboard 
 * with compact mobile sizing (2 columns) and uniform card heights.
 */
const RecentMemories = ({ memories }) => {
  const navigate = useNavigate();

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
          className="text-xs sm:text-sm font-semibold text-[#1E3A8A] transition hover:underline"
        >
          View All
        </button>
      </div>

      {/* Memories Grid - 2 columns on mobile, uniform card heights */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {memories.slice(0, 8).map((memory, index) => (
          <div
            key={memory._id}
            className={`
              ${
                index >= 4 && index < 6
                  ? "hidden md:block"
                  : ""
              }
              ${
                index >= 6
                  ? "hidden xl:block"
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
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentMemories;