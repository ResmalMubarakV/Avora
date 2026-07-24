import { PlusCircle, Images } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold mb-5">
        Quick Actions
      </h2>

      <div className="space-y-3">
        <Link
          to="/dashboard/create-memory"
          className="flex items-center gap-3 p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          Create Memory
        </Link>

        <Link
          to="/dashboard/memories"
          className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
        >
          <Images size={20} />
          View My Memories
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;