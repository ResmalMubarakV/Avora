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

const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const MemoriesCard = ({
    memory,
    username,
    isOwner = false,
    redirectTo = "",
}) => {

    const navigate = useNavigate();

    const totalPhotos =
        memory.media?.filter(
            (item) => item.type === "image"
        ).length || 0;

    const totalVideos =
        memory.media?.filter(
            (item) => item.type === "video"
        ).length || 0;

    const handleOpenMemory = () => {

    const profileUsername =
        memory.user?.username || username;

    navigate(
        `/${profileUsername}/${memory.slug}`,
        {
            state: redirectTo || undefined,
        }
    );

};

    return (

        <div
            onClick={handleOpenMemory}
            className="
                group
                relative
                cursor-pointer
                overflow-hidden
                rounded-3xl
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

            <div className="relative h-64 overflow-hidden">

                <img
                    src={memory.coverImage}
                    alt={memory.title}
                    loading="lazy"
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                    "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                {/* Visibility */}

                <div className="absolute left-4 top-4">

                    {memory.isPublic ? (

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white/95
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-slate-700
                                backdrop-blur
                                shadow
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
                                gap-2
                                rounded-full
                                bg-white/95
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-slate-700
                                backdrop-blur
                                shadow
                            "
                        >

                            <Lock size={14} />

                            Private

                        </div>

                    )}

                </div>

            </div>

            {/* Body */}

            <div className="relative p-6">

                {/* Owner Actions */}

            {isOwner && (

                <div
                    className="absolute bottom-26 right-6"
                    onClick={(e) => e.stopPropagation()}
                >

                    <MemoryActions
                        memory={memory}
                        redirectTo={redirectTo}
                    />

                </div>

            )}

                {/* Title */}

                <h2
                    className={`
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900

                        ${isOwner ? "pr-14" : ""}
                    `}
                >

                    {memory.title}

                </h2>

                {/* Description */}

                <p
                    className="
                        mt-3
                        overflow-hidden
                        text-sm
                        leading-7
                        text-slate-600
                        [display:-webkit-box]
                        [-webkit-box-orient:vertical]
                        [-webkit-line-clamp:3]
                    "
                >

                    {memory.description}

                </p>

                {/* Meta */}

                <div className="mt-6 space-y-3">

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-slate-500
                        "
                    >

                        <MapPin size={16} />

                        <span className="truncate">

                            {memory.location}

                        </span>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-slate-500
                        "
                    >

                        <CalendarDays size={16} />

                        <span>

                            {formatDate(
                                memory.startDate
                            )}

                        </span>

                    </div>

                </div>

                {/* Divider */}

                <div className="my-6 h-px bg-slate-200" />

                {/* Footer */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                bg-slate-100
                                px-3
                                py-1.5
                                text-sm
                                text-slate-700
                            "
                        >

                            <Image size={15} />

                            {totalPhotos}

                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                bg-slate-100
                                px-3
                                py-1.5
                                text-sm
                                text-slate-700
                            "
                        >

                            <Video size={15} />

                            {totalVideos}

                        </div>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-[#3559D4]
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                        "
                    >

                        Read Memory

                        <ArrowRight size={16} />

                    </div>

                </div>

            </div>

        </div>

    );

};

export default MemoriesCard;