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

// ==========================================
// MEMORY INFO COMPONENT
// ==========================================
/**
 * Renders metadata and details for a specific travel memory view card,
 * including a fully interactive like heart button and like status indicator.
 */
const MemoryInfo = ({ memory }) => {
    const [liked, setLiked] = useState(memory?.isLiked || false);
    const [loading, setLoading] = useState(false);

    // --- Handle Like Toggle ---
    const handleLikeToggle = async () => {
        if (loading) return;

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

    // --- Media Count Calculations ---
    const totalPhotos = memory.media?.filter(
        (media) => media.type === "image"
    ).length || 0;

    const totalVideos = memory.media?.filter(
        (media) => media.type === "video"
    ).length || 0;

    // --- Total Trip Days Calculation ---
    const totalDays =
        Math.ceil(
            (
                new Date(memory.endDate) -
                new Date(memory.startDate)
            ) /
            (1000 * 60 * 60 * 24)
        ) + 1;

    // --- Date Formatters ---
    const startDate = new Date(memory.startDate).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );

    const endDate = new Date(memory.endDate).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );

    return (
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Memory Title & Interactive Like Button Header */}
            <div className="flex items-start justify-between gap-4">
                <h1
                    className="
                        text-xl
                        sm:text-3xl
                        lg:text-4xl
                        font-extrabold
                        tracking-tight
                        leading-tight
                        text-slate-900
                    "
                >
                    {memory.title}
                </h1>

                {/* Interactive Like Action Button */}
                <button
                    type="button"
                    onClick={handleLikeToggle}
                    aria-label="Like Memory"
                    className={`
                        flex
                        h-11
                        w-11
                        sm:h-12
                        sm:w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        transition-all
                        duration-300
                        cursor-pointer
                        shadow-sm
                        active:scale-95
                        ${
                            liked
                                ? "bg-rose-50 border-rose-200 text-rose-500 shadow-rose-100"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50"
                        }
                    `}
                >
                    <Heart size={22} className={liked ? "fill-current" : ""} />
                </button>
            </div>

            {/* Top Divider */}
            <div className="mt-4 sm:mt-6 h-px bg-slate-200" />

            {/* Metadata Details List */}
            <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
                {/* Destination Location */}
                <div className="flex items-start gap-3">
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            sm:h-10
                            sm:w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-sky-100
                            text-sky-600
                        "
                    >
                        <MapPin size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-slate-400
                            "
                        >
                            Destination
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                sm:text-base
                                font-semibold
                                text-slate-900
                                truncate
                            "
                        >
                            {memory.location}
                        </p>
                    </div>
                </div>

                {/* Travel Dates */}
                <div className="flex items-start gap-3">
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            sm:h-10
                            sm:w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-sky-100
                            text-sky-600
                        "
                    >
                        <CalendarDays size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-slate-400
                            "
                        >
                            Travel Dates
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                sm:text-base
                                font-semibold
                                text-slate-900
                                truncate
                            "
                        >
                            {startDate} — {endDate}
                        </p>
                    </div>
                </div>

                {/* Mode of Travel */}
                <div className="flex items-start gap-3">
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            sm:h-10
                            sm:w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-sky-100
                            text-sky-600
                        "
                    >
                        <TravelIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-slate-400
                            "
                        >
                            Mode of Travel
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                sm:text-base
                                font-semibold
                                capitalize
                                text-slate-900
                                truncate
                            "
                        >
                            {memory.modeOfTravel}
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div>
            {/* Middle Divider */}
            <div className="my-4 sm:my-6 h-px bg-slate-200" />

            {/* Clean Icon-Text Micro-Stats Bar */}
            <div
                className="
                    grid
                    grid-cols-4
                    lg:flex
                    lg:flex-col
                    items-center
                    lg:items-stretch
                    gap-2
                    lg:gap-3
                    rounded-2xl
                    border
                    border-slate-200/80
                    bg-slate-50/80
                    p-2.5
                    sm:px-4
                    sm:py-3
                    lg:py-4
                "
            >
                {/* Photos */}
                <div className="flex items-center justify-center lg:justify-between gap-1.5 text-xs font-semibold text-slate-700 bg-white lg:bg-transparent rounded-xl lg:rounded-none p-2 lg:p-0 border border-slate-200/60 lg:border-none shadow-xs lg:shadow-none">
                    <div className="flex items-center gap-1.5">
                        <Camera size={15} className="text-slate-400 shrink-0" />
                        <span className="hidden lg:inline text-slate-500 font-medium text-xs">Photos</span>
                    </div>
                    <span>{totalPhotos}</span>
                </div>

                {/* Videos */}
                <div className="flex items-center justify-center lg:justify-between gap-1.5 text-xs font-semibold text-slate-700 bg-white lg:bg-transparent rounded-xl lg:rounded-none p-2 lg:p-0 border border-slate-200/60 lg:border-none shadow-xs lg:shadow-none">
                    <div className="flex items-center gap-1.5">
                        <Video size={15} className="text-slate-400 shrink-0" />
                        <span className="hidden lg:inline text-slate-500 font-medium text-xs">Videos</span>
                    </div>
                    <span>{totalVideos}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-center lg:justify-between gap-1.5 text-xs font-semibold text-slate-700 bg-white lg:bg-transparent rounded-xl lg:rounded-none p-2 lg:p-0 border border-slate-200/60 lg:border-none shadow-xs lg:shadow-none">
                    <div className="flex items-center gap-1.5">
                        <Clock size={15} className="text-slate-400 shrink-0" />
                        <span className="hidden lg:inline text-slate-500 font-medium text-xs">Duration</span>
                    </div>
                    <span>{totalDays}D</span>
                </div>

                {/* Visibility */}
                <div
                    className={`
                        flex
                        items-center
                        justify-center
                        lg:justify-between
                        gap-1.5
                        text-xs
                        font-semibold
                        bg-white
                        lg:bg-transparent
                        rounded-xl
                        lg:rounded-none
                        p-2
                        lg:p-0
                        border
                        border-slate-200/60
                        lg:border-none
                        shadow-xs
                        lg:shadow-none
                        ${
                            memory.isPublic
                                ? "text-emerald-700"
                                : "text-slate-700"
                        }
                    `}
                >
                    <div className="flex items-center gap-1.5">
                        {memory.isPublic ? <Globe size={15} className="text-emerald-500 shrink-0" /> : <Lock size={15} className="text-slate-500 shrink-0" />}
                        <span className="hidden lg:inline text-slate-500 font-medium text-xs">Status</span>
                    </div>
                    <span>{memory.isPublic ? "Public" : "Private"}</span>
                </div>
            </div>
          </div>
        </div>
    );
};

export default MemoryInfo;