import AvoraAIIcon from "../common/AvoraAIIcon";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ==========================================
// AI CARD COMPONENT
// ==========================================
/**
 * Renders an AI assistant promotion card for the dashboard sidebar or widgets.
 * Features a signature Avora AI guiding star icon, luminous gradient background,
 * assistant capabilities description, and a direct link to the Avora AI assistant page.
 */
const AICard = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#4338CA] p-6 text-white shadow-xl">
      {/* Decorative Celestial Glow Behind Icon */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
      
      {/* Bespoke Avora AI Icon Badge */}
      <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
        <AvoraAIIcon size={32} variant="glow" />
      </div>

      {/* Card Title */}
      <div className="mt-4 flex items-center gap-2">
        <h2 className="text-xl font-black tracking-tight">Avora AI Copilot</h2>
        <span className="rounded-full bg-cyan-400/25 px-2 py-0.5 text-[10px] font-bold text-cyan-200 border border-cyan-300/30">
          Smart
        </span>
      </div>

      {/* Description */}
      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-blue-100/90 font-medium">
        Curate personalized itineraries, discover hidden gems, and craft detailed stories for your journeys.
      </p>

      {/* Open Assistant Link */}
      <Link
        to="/dashboard/ai"
        className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1E3A8A] shadow-md transition-all hover:bg-blue-50 hover:shadow-lg hover:scale-[1.02] active:scale-95"
      >
        <span>Open Assistant</span>
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default AICard;