import {
  CalendarDays,
  Globe,
  Lock,
  MapPin,
  Image,
  Video,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MemoryActions from "../../memory/MemoryActions";

// ==========================================
// UTILITY: FORMAT DATE
// ==========================================
/**
 * Formats ISO date strings into Indian standard display format (e.g., "12 Oct 2026").
 */
const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==========================================
// MEMORIES CARD COMPONENT
// ==========================================
/**
 * Renders a travel memory card for listing pages with hidden descriptions on mobile,
 * limited 3-line description clamping for tablet and above screens, media counts, 
 * and properly aligned actions toolbar.
 */
const MemoriesCard = ({
  memory,
  username,
  isOwner = false,
  redirectTo = "",
}) => {
  const navigate = useNavigate();

  // --- Calculate Media Item Counts ---
  const totalPhotos =
    memory.media?.filter((item) => item.type === "image").length || 0;
  const totalVideos =
    memory.media?.filter((item) => item.type === "video").length || 0;

  // --- Handle Navigation to Detailed Memory View ---
  const handleOpenMemory = () => {
    // Robust resolution for owner/author username to prevent 404 routing bugs
    const profileUsername =
      typeof memory.user === "object"
        ? memory.user?.username
        : memory.author?.username || username;

    if (!profileUsername || !memory.slug) return;

    navigate(`/${profileUsername}/${memory.slug}`, {
      state: redirectTo || undefined,
    });
  };

  return (
    <div
      onClick={handleOpenMemory}
      className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Cover Image & Visibility Badge */}
        <div className="relative h-36 sm:h-60 overflow-hidden">
          <img
            src={memory.coverImage}
            alt={memory.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          {/* Visibility Badge */}
          <div className="absolute left-2 top-2 sm:left-4 sm:top-4">
            {memory.isPublic ? (
              <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-white/95 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 backdrop-blur shadow">
                <Globe size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Public</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-white/95 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 backdrop-blur shadow">
                <Lock size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Private</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="relative p-3 sm:p-5">
          {/* Title */}
          <h2
            className={`text-sm sm:text-xl font-bold tracking-tight text-slate-900 line-clamp-1 ${
              isOwner ? "pr-8 sm:pr-12" : ""
            }`}
          >
            {memory.title}
          </h2>

          {/* Description Excerpt: Hidden on mobile (hidden), clamped to 3 lines on sm screens and above */}
          <p className="hidden sm:-webkit-box mt-2 text-sm leading-relaxed text-slate-600 overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {memory.description}
          </p>

          {/* Metadata & Actions Row Container */}
          <div className="mt-2.5 sm:mt-4 flex items-end justify-between gap-2">
            {/* Metadata (Location & Date) */}
            <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
                <MapPin size={14} className="shrink-0 sm:w-4 sm:h-4 text-slate-400" />
                <span className="truncate">{memory.location}</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
                <CalendarDays size={14} className="shrink-0 sm:w-4 sm:h-4 text-slate-400" />
                <span>{formatDate(memory.startDate)}</span>
              </div>
            </div>

            {/* Owner Actions Toolbar */}
            {isOwner && (
              <div
                className="shrink-0 translate-y-0.5 sm:translate-y-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MemoryActions
                  memory={memory}
                  redirectTo={redirectTo}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-3 pb-3 sm:px-5 sm:pb-5 pt-0">
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Photos Count */}
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs text-slate-700">
              <Image size={12} className="sm:w-3.5 sm:h-3.5" />
              {totalPhotos}
            </div>

            {/* Videos Count */}
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs text-slate-700">
              <Video size={12} className="sm:w-3.5 sm:h-3.5" />
              {totalVideos}
            </div>
          </div>

          {/* Read Memory Link */}
          <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#3559D4] transition-transform duration-300 group-hover:translate-x-1">
            <span>View</span>
            <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoriesCard;