import { useState, useRef } from "react";
import {
  CalendarDays,
  Globe,
  Lock,
  MapPin,
  Image,
  Video,
  ArrowRight,
  Heart,
  Pin,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import MemoryActions from "../../memory/MemoryActions";
import api from "../../../api/axios";

const RETURN_KEY = "avora_edit_return_to";

// ==========================================
// UTILITY: FORMAT DATE
// ==========================================
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
const MemoriesCard = ({
  memory,
  username,
  isOwner = false,
  isLoggedIn = false,
  redirectTo = "",
  onLikeToggle,
  onPinUpdated,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(memory.isLiked || false);
  const [animatingHeart, setAnimatingHeart] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  
  const lastTapRef = useRef(0);
  const canLike = isOwner || isLoggedIn;

  const handleToggleLike = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!canLike || likeLoading) return;

    try {
      setLikeLoading(true);
      const newStatus = !isLiked;
      setIsLiked(newStatus);
      setAnimatingHeart(true);
      setTimeout(() => setAnimatingHeart(false), 600);

      memory.isLiked = newStatus;
      if (onLikeToggle) onLikeToggle(memory._id, newStatus);

      await api.patch(`/api/memories/${memory._id}/like`);
    } catch (error) {
      setIsLiked(!isLiked);
      memory.isLiked = !isLiked;
      if (onLikeToggle) onLikeToggle(memory._id, !isLiked);
      toast.error("Failed to update favorite status");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleUnpinFromBadge = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await api.patch(`/api/memories/${memory._id}/pin`);
      memory.isPinned = data.isPinned;
      toast.success("Memory unpinned.");
      if (onPinUpdated) {
        onPinUpdated(memory._id, data.isPinned);
      }
    } catch (error) {
      toast.error("Unable to unpin memory.");
    }
  };

  const handleTouchEnd = (e) => {
    if (!canLike) return;

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;
    
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      handleToggleLike(e);
    }
    lastTapRef.current = currentTime;
  };

  const totalPhotos =
    memory.media?.filter((item) => item.type === "image").length || 0;
  const totalVideos =
    memory.media?.filter((item) => item.type === "video").length || 0;

  // --- Pre-calculate finalFrom including query string/pagination ---
  const originPath = typeof redirectTo === "object" ? redirectTo?.from : redirectTo;
  const finalFrom = originPath || location.pathname + location.search;

  // --- Handle Navigation ---
  const handleOpenMemory = () => {
    const profileUsername =
      typeof memory.user === "object"
        ? memory.user?.username
        : memory.author?.username || username;

    if (!profileUsername || !memory.slug) return;

    sessionStorage.setItem(RETURN_KEY, finalFrom);

    navigate(`/${profileUsername}/${memory.slug}`, {
      state: {
        from: finalFrom,
        label: typeof redirectTo === "object" && redirectTo?.label ? redirectTo.label : "Back",
      },
    });
  };

  return (
    <div
      onClick={handleOpenMemory}
      onTouchEnd={handleTouchEnd}
      className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between select-none"
    >
      <div>
        <div className="relative h-36 sm:h-60 overflow-hidden">
          <img
            src={memory.coverImage}
            alt={memory.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          <div className="absolute left-2 top-2 sm:left-4 sm:top-4 flex items-center gap-1.5 z-10">
            {(isOwner || !memory.isPublic) && (
              <div>
                {memory.isPublic ? (
                  <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-white/95 dark:bg-sky-950/90 dark:border dark:border-sky-500/40 dark:text-sky-300 dark:shadow-[0_0_12px_rgba(56,189,248,0.25)] px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 backdrop-blur shadow transition-all">
                    <Globe size={12} className="sm:w-3.5 sm:h-3.5 dark:text-sky-400" />
                    <span className="hidden xs:inline">Public</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-white/95 dark:bg-indigo-950/90 dark:border dark:border-indigo-500/40 dark:text-indigo-300 dark:shadow-[0_0_12px_rgba(99,102,241,0.25)] px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 backdrop-blur shadow transition-all">
                    <Lock size={12} className="sm:w-3.5 sm:h-3.5 dark:text-indigo-400" />
                    <span className="hidden xs:inline">Private</span>
                  </div>
                )}
              </div>
            )}

            {memory.isPinned && (
              <button
                type="button"
                onClick={handleUnpinFromBadge}
                title="Click to unpin memory"
                className="flex items-center gap-1 rounded-full bg-slate-900/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold text-white backdrop-blur shadow border border-white/20 transition hover:bg-red-600 cursor-pointer group/pin"
              >
                <Pin size={11} className="fill-white text-white sm:w-3 sm:h-3 transition group-hover/pin:rotate-45" />
                <span>Pinned</span>
              </button>
            )}
          </div>

          {(canLike || isLiked) && (
            <div className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10">
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={!canLike || likeLoading}
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all shadow-sm ${
                  canLike ? "cursor-pointer" : "cursor-default"
                } ${
                  isLiked 
                    ? "bg-rose-50 border-rose-200 text-rose-600" + (canLike ? " hover:scale-105" : "")
                    : "bg-white/90 backdrop-blur-xs border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200"
                }`}
                title={!canLike ? "Liked" : (isLiked ? "Remove from favorites" : "Mark as favorite")}
              >
                <Heart 
                  size={16} 
                  className={`sm:w-[18px] sm:h-[18px] transition-transform duration-300 ${isLiked ? "fill-rose-500" : ""} ${isLiked && canLike ? "scale-110" : ""} ${animatingHeart ? "scale-125" : ""}`} 
                />
              </button>
            </div>
          )}
        </div>

        <div className="relative p-3 sm:p-5">
          <h2
            className={`text-sm sm:text-xl font-bold tracking-tight text-slate-900 line-clamp-1 ${
              isOwner ? "pr-8 sm:pr-12" : ""
            }`}
          >
            {memory.title}
          </h2>

          <p className="hidden sm:-webkit-box mt-2 text-sm leading-relaxed text-slate-600 overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {memory.description}
          </p>

          <div className="mt-2.5 sm:mt-4 flex items-end justify-between gap-2">
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

            {isOwner && (
              <div
                className="shrink-0 translate-y-0.5 sm:translate-y-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MemoryActions
                  memory={memory}
                  redirectTo={{ from: finalFrom, label: redirectTo?.label }}
                  onPinUpdated={onPinUpdated}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 sm:px-5 sm:pb-5 pt-0">
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs text-slate-700">
              <Image size={12} className="sm:w-3.5 sm:h-3.5" />
              {totalPhotos}
            </div>

            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs text-slate-700">
              <Video size={12} className="sm:w-3.5 sm:h-3.5" />
              {totalVideos}
            </div>
          </div>

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