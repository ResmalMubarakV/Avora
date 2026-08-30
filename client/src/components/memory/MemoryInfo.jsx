import { useState } from "react";
import {
    MapPin,
    CalendarDays,
    Globe,
    Bike,
    Car,
    Plane,
    Train,
    Bus,
    Ship,
    Footprints,
    Compass,
    Camera,
    Video,
    Clock,
    Lock,
    Heart,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../api/axios";
import WeatherComparisonCard from "./WeatherComparisonCard";

// ==========================================
// MEMORY INFO COMPONENT
// ==========================================
const MemoryInfo = ({ memory, isOwner = false, isLoggedIn = false }) => {
    const [liked, setLiked] = useState(memory?.isLiked || false);
    const [loading, setLoading] = useState(false);

    const canLike = isOwner || isLoggedIn;

    // --- Handle Like Toggle ---
    const handleLikeToggle = async () => {
        if (!canLike || loading) return;

        try {
            setLoading(true);
            const nextState = !liked;
            setLiked(nextState); // Optimistic UI

            await api.patch(`/api/memories/${memory._id}/like`);
            toast.success(nextState ? "Added to your liked memories!" : "Removed from liked memories");
        } catch (error) {
            setLiked(!liked); // Revert on error
            console.error(error);
            toast.error("Failed to update like status.");
        } finally {
            setLoading(false);
        }
    };

    // --- Travel Mode Icon Map ---
    const travelIcons = {
        bike: Bike,
        car: Car,
        flight: Plane,
        train: Train,
        bus: Bus,
        ship: Ship,
        walk: Footprints,
    };

    const TravelIcon =
        travelIcons[memory.modeOfTravel?.toLowerCase()] || Compass;

    const totalPhotos = memory.media?.filter(media => media.type === "image").length || 0;
    const totalVideos = memory.media?.filter(media => media.type === "video").length || 0;

    const totalDays = Math.ceil(
        (new Date(memory.endDate) - new Date(memory.startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;

    const startDate = new Date(memory.startDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });

    const endDate = new Date(memory.endDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });

    return (
        <div className="flex flex-col h-full justify-between lg:py-2">
          <div>
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl sm:text-3xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                    {memory.title}
                </h1>

                {/* Conditional Like Action Button */}
                {(canLike || liked) && (
                    <button
                        type="button"
                        onClick={canLike ? handleLikeToggle : undefined}
                        aria-label="Like Memory"
                        disabled={!canLike || loading}
                        className={`
                            flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 shadow-sm
                            ${canLike ? "cursor-pointer active:scale-95" : "cursor-default"}
                            ${
                                liked
                                    ? "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-500 dark:text-rose-400 shadow-rose-100 dark:shadow-none"
                                    : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-slate-700"
                            }
                        `}
                    >
                        <Heart size={22} className={liked ? "fill-current" : ""} />
                    </button>
                )}
            </div>

            <div className="mt-3 sm:mt-4 h-px bg-slate-200 dark:bg-slate-800" />

            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {/* Destination Location */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800/90 text-[#1E3A8A] dark:text-indigo-400 border border-blue-100/60 dark:border-slate-700/80 shadow-2xs">
                        <MapPin size={15} className="sm:w-[16px] sm:h-[16px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-400">Destination</p>
                        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{memory.location}</p>
                    </div>
                </div>

                {/* Travel Dates */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800/90 text-[#1E3A8A] dark:text-indigo-400 border border-blue-100/60 dark:border-slate-700/80 shadow-2xs">
                        <CalendarDays size={15} className="sm:w-[16px] sm:h-[16px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-400">Travel Dates</p>
                        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{startDate} — {endDate}</p>
                    </div>
                </div>

                {/* Mode of Travel */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800/90 text-[#1E3A8A] dark:text-indigo-400 border border-blue-100/60 dark:border-slate-700/80 shadow-2xs">
                        <TravelIcon size={15} className="sm:w-[16px] sm:h-[16px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-400">Mode of Travel</p>
                        <p className="mt-0.5 text-xs sm:text-sm font-semibold capitalize text-slate-900 dark:text-slate-100 truncate">{memory.modeOfTravel}</p>
                    </div>
                </div>

                {/* Destination Weather Comparison (Historical Travel Date vs Live Today) */}
                {memory.location && (
                  <WeatherComparisonCard location={memory.location} startDate={memory.startDate} className="mt-3" />
                )}
            </div>
          </div>

          <div>
            <div className="my-3 sm:my-4 h-px bg-slate-200 dark:bg-slate-800" />

            {/* Compact 4-Column Stats Grid Matching Right-Side Media Layout */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
              {/* Photos */}
              <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-50/80 to-blue-50/30 dark:from-slate-900/90 dark:to-indigo-950/30 p-2 sm:p-2.5 transition-colors">
                <Camera size={14} className="text-blue-600 dark:text-indigo-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Photos</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{totalPhotos}</span>
              </div>

              {/* Videos */}
              <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-50/80 to-blue-50/30 dark:from-slate-900/90 dark:to-indigo-950/30 p-2 sm:p-2.5 transition-colors">
                <Video size={14} className="text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Videos</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{totalVideos}</span>
              </div>

              {/* Duration */}
              <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-50/80 to-blue-50/30 dark:from-slate-900/90 dark:to-indigo-950/30 p-2 sm:p-2.5 transition-colors">
                <Clock size={14} className="text-amber-500 dark:text-amber-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{totalDays}D</span>
              </div>

              {/* Status */}
              <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-50/80 to-blue-50/30 dark:from-slate-900/90 dark:to-indigo-950/30 p-2 sm:p-2.5 transition-colors">
                {memory.isPublic ? (
                  <Globe size={14} className="text-emerald-500 dark:text-emerald-400 mb-1" />
                ) : (
                  <Lock size={14} className="text-slate-400 dark:text-slate-500 mb-1" />
                )}
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</span>
                <span className={`text-xs sm:text-sm font-extrabold mt-0.5 ${memory.isPublic ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                  {memory.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </div>
          </div>
        </div>
    );
};

export default MemoryInfo;