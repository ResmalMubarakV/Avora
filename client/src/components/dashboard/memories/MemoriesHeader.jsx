import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// MEMORIES HEADER COMPONENT
// ==========================================
/**
 * Renders the top header section for the user's memories dashboard.
 * Displays the title, total memory count badge, dynamic summary text, 
 * and a primary call-to-action button to create a new memory.
 */
const MemoriesHeader = ({ total = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Count Info */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Memories
          </h1>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-[#3559D4]">
            {total}
          </span>
        </div>

        <p className="mt-2 text-slate-500">
          {total === 0
            ? "Start documenting your adventures."
            : `${total} ${total === 1 ? "journey" : "journeys"} documented.`}
        </p>
      </div>

      {/* Create Memory Action Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/create-memory")}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <Plus size={18} />
        Create Memory
      </button>
    </div>
  );
};

export default MemoriesHeader;