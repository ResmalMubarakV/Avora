import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

const TravelerCard = ({ traveler }) => {
    return (
        <Link
            to={`/${traveler.username}`}
            className="
                group
                block
                rounded-3xl
                border
                border-white/10
                bg-slate-900
                p-6
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-sky-500/40
                hover:shadow-xl
                hover:shadow-sky-500/10
            "
        >
            {/* Avatar */}
            <div className="flex justify-center">
                <img
                    src={traveler.avatar}
                    alt={traveler.name}
                    className="
                        h-20
                        w-20
                        rounded-full
                        border-4
                        border-slate-800
                        object-cover
                        transition-transform
                        duration-300
                        group-hover:scale-105
                    "
                />
            </div>

            {/* Name */}
            <h3 className="mt-4 text-center text-2xl font-bold text-white">
                {traveler.name}
            </h3>

            {/* Username */}
            <p className="mt-1 text-center text-slate-400">
                @{traveler.username}
            </p>

            {/* Location */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sky-400">
                <FiMapPin className="text-base" />

                <span>{traveler.location}</span>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-white/10" />

            {/* Bottom */}
            <div
                className="
                    flex
                    items-center
                    justify-between
                    text-white
                    transition-colors
                    duration-300
                    group-hover:text-sky-400
                "
            >
                <span className="font-medium">
                    View Profile
                </span>

                <FiArrowRight
                    className="
                        text-lg
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                    "
                />
            </div>
        </Link>
    );
};

export default TravelerCard;