import { useState } from "react";
import {
    CalendarDays,
    MapPin,
    Globe,
    Lock,
    Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import MemoryActions from "../memory/MemoryActions";
import api from "../../../api/axios";

// ==========================================
// DATE FORMATTER UTILITY
// ==========================================
const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

// ==========================================
// MEMORY CARD COMPONENT
// ==========================================
const MemoryCard = ({ memory, onLikeToggle, isOwner = false, isLoggedIn = false }) => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(memory?.isLiked || false);
    const [likeLoading, setLikeLoading] = useState(false);

    const canLike = isOwner || isLoggedIn;

    // --- Handle Like Toggle API Call ---
    const handleLikeClick = async (e) => {
        e.stopPropagation(); // Prevent card navigation click
        if (!canLike || likeLoading) return;

        try {
            setLikeLoading(true);
            const nextState = !liked;
            setLiked(nextState); // Optimistic UI update

            await api.patch(`/api/memories/${memory._id}/like`);
            
            if (onLikeToggle) {
                onLikeToggle(memory._id, nextState);
            }

            toast.success(nextState ? "Added to liked memories" : "Removed from liked memories");
        } catch (error) {
            setLiked(!liked); // Revert on error
            console.error(error);
            toast.error("Unable to update like status.");
        } finally {
            setLikeLoading(false);
        }
    };

    return (
        <div
            onClick={() =>
                navigate(
                    `/${memory.user.username}/${memory.slug}`,
                    {
                        state: {
                            from: "/dashboard",
                            label: "Dashboard",
                        },
                    }
                )
            }
            className="
                group
                relative
                cursor-pointer
                overflow-visible
                rounded-[28px]
                border
                border-slate-200/80
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:shadow-xl
                hover:border-slate-300
            "
        >
            {/* Cover Image & Badges Container */}
            <div className="relative overflow-hidden rounded-t-[28px]">
                <img
                    src={memory.coverImage}
                    alt={memory.title}
                    className="
                        h-56
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />

                {/* Top-Left: Interactive Like Button Placeholder / Toggle */}
                {(canLike || liked) && (
                    <div className="absolute top-3 left-3 z-10">
                        <button
                            type="button"
                            onClick={canLike ? handleLikeClick : undefined}
                            aria-label="Like Memory"
                            disabled={!canLike || likeLoading}
                            className={`
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                backdrop-blur-md
                                transition-all
                                duration-200
                                shadow-md
                                ${canLike ? "cursor-pointer active:scale-90" : "cursor-default"}
                                ${
                                    liked
                                        ? "bg-rose-500 text-white shadow-rose-500/30"
                                        : "bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500"
                                }
                            `}
                        >
                            <Heart size={16} className={liked ? "fill-current" : ""} />
                        </button>
                    </div>
                )}

                {/* Top-Right: Visibility Status Badge */}
                <div className="absolute top-3 right-3">
                    {memory.isPublic ? (
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-white/95
                                px-3.5
                                py-1.5
                                text-xs
                                font-bold
                                text-slate-700
                                shadow-md
                                backdrop-blur-md
                            "
                        >
                            <Globe size={13} className="text-blue-600" />
                            Public
                        </div>
                    ) : (
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-white/95
                                px-3.5
                                py-1.5
                                text-xs
                                font-bold
                                text-slate-700
                                shadow-md
                                backdrop-blur-md
                            "
                        >
                            <Lock size={13} className="text-slate-500" />
                            Private
                        </div>
                    )}
                </div>
            </div>

            {/* Card Body Content */}
            <div className="relative p-5 sm:p-6">
                <h3 className="pr-12 text-lg sm:text-xl font-black text-slate-900 line-clamp-1 tracking-tight">
                    {memory.title}
                </h3>

                <div className="mt-3.5 flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
                    <MapPin size={16} className="shrink-0 text-[#3559D4]" />
                    <span className="truncate">
                        {memory.location}
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
                    <CalendarDays size={16} className="shrink-0 text-slate-400" />
                    <span>
                        {formatDate(memory.startDate)}
                    </span>
                </div>

                {/* Hover Memory Actions Menu Wrapper */}
                <div
                    className="
                        absolute
                        bottom-5
                        right-5
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                    "
                    onClick={(e) => e.stopPropagation()}
                >
                    <MemoryActions
                        memory={memory}
                        redirectTo="/dashboard"
                    />
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;