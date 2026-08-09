import { useNavigate } from "react-router-dom";

// ==========================================
// MEMORIES HEADER COMPONENT
// ==========================================
/**
 * Renders the top header section for the user's memories dashboard.
 * Displays the title, total memory count badge, and dynamic summary text.
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
    </div>
  );
};

export default MemoriesHeader;