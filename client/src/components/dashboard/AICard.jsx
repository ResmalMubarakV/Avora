import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AICard = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
      <Sparkles size={36} />

      <h2 className="text-xl font-bold mt-4">
        Avora AI
      </h2>

      <p className="text-blue-100 mt-3">
        Ask for itinerary ideas, travel tips, destination recommendations,
        or generate captions for your travel memories.
      </p>

      <Link
        to="/dashboard/ai"
        className="inline-block mt-6 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
      >
        Open AI Assistant
      </Link>
    </div>
  );
};

export default AICard;