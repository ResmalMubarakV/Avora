import { useState } from "react";
import {
    CalendarDays,
    MapPin,
    Globe,
    Lock,
    Heart,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import MemoryActions from "../memory/MemoryActions";
import api from "../../../api/axios";

const RETURN_KEY = "avora_edit_return_to";

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
const MemoryCard = ({ memory, onLikeToggle, isOwner = false, isLoggedIn = false, redirectTo = "" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [liked, setLiked] = useState(memory?.isLiked || false);
    const [likeLoading, setLikeLoading] = useState(false);

    const canLike = isOwner || isLoggedIn;

    // --- Compute Exact Return Path Including Pagination (e.g., ?page=4) ---
    const originPath = typeof redirectTo === "object" ? redirectTo?.from : redirectTo;
    const finalFrom = originPath || location.pathname + location.search;

    // --- Handle Like Toggle API Call ---
    const handleLikeClick = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!canLike || likeLoading) return;

        try {
            setLikeLoading(true);
            const nextState = !liked;
            setLiked(nextState); // Optimistic UI update

            memory.isLiked = nextState;
            if (onLikeToggle) {
                onLikeToggle(memory._id, nextState);
            }

            await api.patch(`/api/memories/${memory._id}/like`);
        } catch (error) {
            setLiked(!liked); // Revert on error
            memory.isLiked = !liked;
            if (onLikeToggle) {
                onLikeToggle(memory._id, !liked);
            }
            console.error(error);
            toast.error("Unable to update like status.");
        } finally {
            setLikeLoading(false);
        }
    };

    return (
        <div
            onClick={() => {
                sessionStorage.setItem(RETURN_KEY, finalFrom);
                navigate(
                    `/${memory.user.username}/${memory.slug}`,
                    {
                        state: {
                            from: finalFrom,
                            label: finalFrom.includes("/dashboard") ? "Dashboard" : "Profile",
                        },
                    }
                );
            }}
            className="
                group
                relative
                cursor-pointer
                overflow-visible
                rounded-[28px]
                border
                border-slate-200/80
                dark:border-slate-800
                bg-white
                dark:bg-slate-900/95
                shadow-[0_2px_12px_rgba(30,58,138,0.04)]
                dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-slate-300
                dark:hover:border-indigo-500/80
                hover:shadow-[0_8px_25px_rgba(30,58,138,0.08)]
                dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]
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
                            onClick={handleLikeClick}
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
                                        : "bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-white hover:text-rose-500"
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
                                dark:bg-sky-950/90
                                dark:border
                                dark:border-sky-500/40
                                dark:text-sky-300
                                dark:shadow-[0_0_12px_rgba(56,189,248,0.25)]
                                px-3.5
                                py-1.5
                                text-xs
                                font-bold
                                text-slate-700
                                shadow-md
                                backdrop-blur-md
                                transition-all
                            "
                        >
                            <Globe size={13} className="text-blue-600 dark:text-sky-400" />
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
                                dark:bg-indigo-950/90
                                dark:border
                                dark:border-indigo-500/40
                                dark:text-indigo-300
                                dark:shadow-[0_0_12px_rgba(99,102,241,0.25)]
                                px-3.5
                                py-1.5
                                text-xs
                                font-bold
                                text-slate-700
                                shadow-md
                                backdrop-blur-md
                                transition-all
                            "
                        >
                            <Lock size={13} className="text-slate-500 dark:text-indigo-400" />
                            Private
                        </div>
                    )}
                </div>
            </div>

            {/* Card Body Content */}
            <div className="relative p-5 sm:p-6">
                <h3 className="pr-12 text-lg sm:text-xl font-black text-slate-900 dark:text-white line-clamp-1 tracking-tight">
                    {memory.title}
                </h3>

                <div className="mt-3.5 flex items-center gap-2 text-slate-500 dark:text-slate-300 text-xs sm:text-sm font-medium">
                    <MapPin size={16} className="shrink-0 text-[#3559D4] dark:text-indigo-400" />
                    <span className="truncate">
                        {memory.location}
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                    <CalendarDays size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />
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
                        redirectTo={{ from: finalFrom, label: redirectTo?.label || (finalFrom.includes("/dashboard") ? "Dashboard" : "Profile") }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;