import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// ==========================================
// AI CARD COMPONENT
// ==========================================
/**
 * Renders an AI assistant promotion card for the dashboard sidebar or widgets.
 * Features a gradient background, spark icon, assistant capabilities description, 
 * and a direct link to the Avora AI assistant page.
 */
const AICard = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white shadow-sm">
      {/* Sparkles Icon */}
      <Sparkles size={36} className="text-blue-100" />

      {/* Card Title */}
      <h2 className="mt-4 text-xl font-bold tracking-tight">
        Avora AI
      </h2>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-blue-100">
        Ask for itinerary ideas, travel tips, destination recommendations,
        or generate captions for your travel memories.
      </p>

      {/* Open Assistant Link */}
      <Link
        to="/dashboard/ai"
        className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow transition hover:bg-gray-100"
      >
        Open AI Assistant
      </Link>
    </div>
  );
};

export default AICard;