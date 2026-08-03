import {
    CalendarDays,
    Globe,
    Lock,
    MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MemoryActions from "../memory/MemoryActions";

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

const MemoryCard = ({
    memory,
    openFrom = "/dashboard",
    openLabel = "Dashboard",
    redirectTo = "/dashboard",
    showActions = true,
}) => {

    const navigate = useNavigate();

    return (

        <div
            onClick={() =>
                navigate(
                    `/${memory.user.username}/${memory.slug}`,
                    {
                        state: {
                            from: openFrom,
                            label: openLabel,
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

            {/* Cover */}

            <div className="relative overflow-hidden rounded-t-2xl">

                <img
                    src={memory.coverImage}
                    alt={memory.title}
                    loading="lazy"
                    className="
                        h-56
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />

                {/* Visibility */}

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

            {/* Body */}

            <div className="relative p-5">

                <h3 className="pr-14 text-xl font-bold text-slate-900">

                    {memory.title}

                </h3>

                <div className="mt-4 flex items-center gap-2 text-slate-500">

                    <MapPin size={16} />

                    <span className="truncate">

                        {memory.location}

                    </span>

                </div>

                <div className="mt-2 flex items-center gap-2 text-slate-500">

                    <CalendarDays size={16} />

                    <span>

                        {formatDate(memory.startDate)}

                    </span>

                </div>

                {/* Actions */}

                {showActions && (
                    <div
                        className="
                            absolute
                            bottom-5
                            right-5
                        "
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

    );

};

export default MemoryCard;