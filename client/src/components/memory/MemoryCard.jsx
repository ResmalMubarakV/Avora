import {
    CalendarDays,
    MapPin,
    Globe,
    Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MemoryActions from "../memory/MemoryActions";

// ==========================================
// DATE FORMATTER UTILITY
// ==========================================
/**
 * Formats a given ISO date string into a localized Indian date format (e.g. 15 Jan 2026).
 */
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
/**
 * Renders an interactive travel memory card with cover image zoom, public/private badges, 
 * location and date details, and hover-triggered memory actions menu.
 */
const MemoryCard = ({ memory }) => {
    const navigate = useNavigate();

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
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
            "
        >
            {/* Cover Image & Visibility Badge */}
            <div className="relative overflow-hidden rounded-t-2xl">
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

                {/* Visibility Status Badge */}
                <div className="absolute top-3 right-3">
                    {memory.isPublic ? (
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                rounded-full
                                bg-white/95
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-slate-700
                                shadow
                                backdrop-blur
                            "
                        >
                            <Globe size={14} />
                            Public
                        </div>
                    ) : (
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                rounded-full
                                bg-white/95
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-slate-700
                                shadow
                                backdrop-blur
                            "
                        >
                            <Lock size={14} />
                            Private
                        </div>
                    )}
                </div>
            </div>

            {/* Card Body Content */}
            <div className="relative p-5">
                <h3 className="pr-14 text-xl font-bold text-slate-900 line-clamp-1">
                    {memory.title}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin size={16} className="shrink-0 text-slate-400" />
                    <span className="truncate">
                        {memory.location}
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-slate-500 text-sm">
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