import {
    ArrowLeft,
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
    Pencil,
} from "lucide-react";

import {
    useNavigate,
    useLocation,
} from "react-router-dom";
   
const MemoryInfo = ({
    username,
    memory,
    isOwner,
    locationState,
}) => {

        const navigate = useNavigate();
        const location = useLocation();
        const from =
            locationState?.from || `/${username}`;

        const label =
            locationState?.label || "Profile";

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

    const totalPhotos = memory.media.filter(
        media => media.type === "image"
    ).length;

    const totalVideos = memory.media.filter(
        media => media.type === "video"
    ).length;

    const totalDays =
        Math.ceil(
            (
                new Date(memory.endDate) -
                new Date(memory.startDate)
            ) /
            (1000 * 60 * 60 * 24)
        ) + 1;

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

    <div className="flex flex-col">

        {/* Top Actions */}

    <div className="flex items-center justify-between gap-4">

        {/* Back Button */}

        <button
            type="button"
            onClick={() => navigate(from)}
            className="
                inline-flex
                items-center
                gap-2

                rounded-full
                border
                border-slate-200

                bg-white

                px-4
                py-2

                text-xs
                sm:text-sm
                font-medium
                text-slate-800

                shadow-sm

                transition-all
                duration-300

                hover:bg-slate-50
                hover:shadow-md
            "
        >
            <ArrowLeft size={16} />

            <span>
                Back to {label}
            </span>

        </button>

        {/* Edit Button */}

        {isOwner && (

            <button
                type="button"
                onClick={() =>
                    navigate(
                        `/dashboard/edit-memory/${memory._id}`,
                        {
                            state: {
                                from: location.pathname,
                            },
                        }
                    )
                }
                className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    bg-gradient-to-r
                    from-[#1E3A8A]
                    to-[#3559D4]

                    px-4
                    py-2

                    text-xs
                    sm:text-sm
                    font-semibold
                    text-white

                    shadow-md

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-lg
                "
            >
                <Pencil size={16} />

                <span>
                    Edit Memory
                </span>

            </button>

        )}

    </div>

        {/* Badge */}

        <div
            className="
                mt-7
                inline-flex
                w-fit
                rounded-full
                border
                border-sky-200
                bg-sky-50
                px-3
                py-1.5
                text-[11px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-sky-600
            "
        >
            Travel Memory
        </div>

        {/* Title */}

        <h1
            className="
                mt-5
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                tracking-tight
                leading-tight
                text-slate-900
            "
        >
            {memory.title}
        </h1>

        {/* Divider */}

        <div className="mt-8 h-px bg-slate-200" />

        {/* Details */}

        <div className="mt-8 space-y-6">

            {/* Destination */}

            <div className="flex items-start gap-4">

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-sky-100
                        text-sky-600
                    "
                >
                    <MapPin size={20} />
                </div>

                <div>

                    <p
                        className="
                            text-[10px]
                            sm:text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-slate-500
                        "
                    >
                        Destination
                    </p>

                    <p
                        className="
                            mt-1
                            text-base
                            sm:text-lg
                            font-semibold
                            text-slate-900
                        "
                    >
                        {memory.location}
                    </p>

                </div>

            </div>

            {/* Travel Dates */}

            <div className="flex items-start gap-4">

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-sky-100
                        text-sky-600
                    "
                >
                    <CalendarDays size={20} />
                </div>

                <div>

                    <p
                        className="
                            text-[10px]
                            sm:text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-slate-500
                        "
                    >
                        Travel Dates
                    </p>

                    <p
                        className="
                            mt-1
                            text-base
                            sm:text-lg
                            font-semibold
                            text-slate-900
                        "
                    >
                        {startDate} — {endDate}
                    </p>

                </div>

            </div>

            {/* Mode */}

            <div className="flex items-start gap-4">

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-sky-100
                        text-sky-600
                    "
                >
                    <TravelIcon size={20} />
                </div>

                <div>

                    <p
                        className="
                            text-[10px]
                            sm:text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-slate-500
                        "
                    >
                        Mode of Travel
                    </p>

                    <p
                        className="
                            mt-1
                            text-base
                            sm:text-lg
                            font-semibold
                            capitalize
                            text-slate-900
                        "
                    >
                        {memory.modeOfTravel}
                    </p>

                </div>

            </div>

        </div>
                {/* Divider */}

        <div className="my-8 h-px bg-slate-200" />

        {/* Journey Summary */}

<div
    className="
        flex
        flex-nowrap
        items-center
        justify-between
        gap-2
        overflow-x-auto
        scrollbar-hide
    "
>

    <span
        className="
            inline-flex
            shrink-0
            items-center
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-2.5
            py-1.5
            text-[10px]
            sm:px-4
            sm:py-2
            sm:text-sm
            font-medium
            text-slate-700
        "
    >
        📷 {totalPhotos}
    </span>

    <span
        className="
            inline-flex
            shrink-0
            items-center
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-2.5
            py-1.5
            text-[10px]
            sm:px-4
            sm:py-2
            sm:text-sm
            font-medium
            text-slate-700
        "
    >
        🎥 {totalVideos}
    </span>

    <span
        className="
            inline-flex
            shrink-0
            items-center
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-2.5
            py-1.5
            text-[10px]
            sm:px-4
            sm:py-2
            sm:text-sm
            font-medium
            text-slate-700
        "
    >
        🗓 {totalDays} Days
    </span>

    <span
        className={`
            inline-flex
            shrink-0
            items-center
            rounded-full
            border
            px-2.5
            py-1.5
            text-[10px]
            sm:px-4
            sm:py-2
            sm:text-sm
            font-medium
            ${
                memory.isPublic
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-700"
            }
        `}
    >
        🌍 {memory.isPublic ? "Public" : "Private"}
    </span>

    </div>
</div>
);

};

export default MemoryInfo;