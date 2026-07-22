import { Link } from "react-router-dom";

import {
    ArrowLeft,
    MapPin,
    CalendarDays,
    Camera,
    Video,
    Globe,
    Bike,
    Car,
    Plane,
    Train,
    Bus,
    Ship,
    Footprints,
    Compass
} from "lucide-react";

const MemoryInfo = ({ username, memory }) => {

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

    const totalVideos = memory.media.filter(
        item => item.type === "video"
    ).length;

    const totalPhotos = memory.media.filter(
        item => item.type === "image"
    ).length;

    const totalDays =
        Math.ceil(
            (
                new Date(memory.endDate) -
                new Date(memory.startDate)
            ) /
            (1000 * 60 * 60 * 24)
        ) + 1;

    return (

        <div className="flex flex-col h-full">

            {/* Back */}

            <Link
                to={`/${username}`}
                className="
                    inline-flex
                    items-center
                    gap-2
                    w-fit
                    rounded-full
                    bg-gray-50
                    px-4
                    py-2
                    text-sm
                    text-gray-600
                    transition
                    hover:bg-gray-100
                    mb-10
                "
            >
                <ArrowLeft size={18} />
                Back to Profile
            </Link>

            {/* Title */}

            <h1 className="text-[56px] leading-none font-bold tracking-tight text-gray-900">
                {memory.title}
            </h1>

            {/* Basic Info */}

            <div className="mt-10 space-y-5">

                <div className="flex items-center gap-3">

                    <MapPin
                        size={20}
                        className=""
                    />

                    <span className="text-gray-700">
                        {memory.location}
                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <CalendarDays
                        size={20}
                        className=""
                    />

                    <span className="text-gray-700">

                        {new Date(memory.startDate).toLocaleDateString()}
                        {" - "}
                        {new Date(memory.endDate).toLocaleDateString()}

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <TravelIcon
                        size={20}
                        className=""
                    />

                    <span className="text-gray-700 capitalize">
                        {memory.modeOfTravel}
                    </span>

                </div>

            </div>

            {/* Divider */}

            <div className="my-10 h-px " />

            {/* Journey Stats */}

            <div className="space-y-5">

                <div className="flex items-center gap-3">

                    <Camera
                        size={20}
                        className=""
                    />

                    <span className="text-gray-700">

                        <strong>{totalPhotos}</strong> Photos

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <Video
                        size={20}
                        className=""
                    />

                    <span className="text-gray-700">

                        <strong>{totalVideos}</strong> Videos

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <CalendarDays
                        size={20}
                        className=""
                    />

                    <span className="">

                        <strong>{totalDays}</strong> Days

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <Globe
                        size={20}
                        className=""
                    />

                    <span className="text-gray-700">

                        {memory.isPublic
                            ? "Public Memory"
                            : "Private Memory"}

                    </span>

                </div>

            </div>

        </div>

    );

};

export default MemoryInfo;