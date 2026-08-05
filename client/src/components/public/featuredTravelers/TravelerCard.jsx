import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

// ==========================================
// TRAVELER CARD COMPONENT
// ==========================================
/**
 * Renders an interactive public traveler profile card with avatar fallback support, 
 * location badges, hover lift/glow transitions, and a direct "View Profile" navigation link.
 */
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
            {/* Traveler Avatar Image */}
            <div className="flex justify-center">
                <img
                    src={
                        traveler.profileImage ||
                        "https://ui-avatars.com/api/?background=0f172a&color=ffffff&name=" +
                            encodeURIComponent(traveler.name)
                    }
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
                        shadow-md
                    "
                />
            </div>

            {/* Traveler Full Name */}
            <h3 className="mt-4 text-center text-xl sm:text-2xl font-bold text-white tracking-tight">
                {traveler.name}
            </h3>

            {/* Traveler Handle Username */}
            <p className="mt-1 text-center text-sm font-medium text-slate-400">
                @{traveler.username}
            </p>

            {/* Location Detail */}
            {traveler.location && (
                <div className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-sky-400">
                    <FiMapPin className="text-base shrink-0" />
                    <span className="truncate">{traveler.location}</span>
                </div>
            )}

            {/* Divider Line */}
            <div className="my-5 border-t border-white/10" />

            {/* Bottom Action Footer */}
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
                <span className="text-sm font-semibold">
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