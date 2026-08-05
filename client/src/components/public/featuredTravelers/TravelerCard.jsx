import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

// ==========================================
// TRAVELER CARD COMPONENT (RESPONSIVE DARK)
// ==========================================
const TravelerCard = ({ traveler }) => {
    return (
        <Link
            to={`/${traveler.username}`}
            className="
                group
                relative
                flex
                flex-col
                justify-between
                rounded-3xl
                border
                border-slate-800
                bg-slate-900/90
                backdrop-blur-xl
                p-6
                sm:p-7
                shadow-xl
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-sky-500/50
                hover:bg-slate-900
                hover:shadow-2xl
                hover:shadow-sky-500/10
                w-full
            "
        >
            <div className="relative z-10">
                {/* Traveler Avatar Image */}
                <div className="flex justify-center">
                    <div className="relative">
                        <img
                            src={
                                traveler.profileImage ||
                                "https://ui-avatars.com/api/?background=1e293b&color=ffffff&name=" +
                                    encodeURIComponent(traveler.name)
                            }
                            alt={traveler.name}
                            className="
                                h-16
                                w-16
                                sm:h-20
                                sm:w-20
                                rounded-2xl
                                border-2
                                border-slate-700
                                object-cover
                                transition-transform
                                duration-300
                                group-hover:scale-105
                                shadow-lg
                            "
                        />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold shadow-md" />
                    </div>
                </div>

                {/* Full Name */}
                <h3 className="mt-4 sm:mt-5 text-center text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-sky-400 transition-colors truncate">
                    {traveler.name}
                </h3>

                {/* Username Handle */}
                <p className="mt-0.5 text-center text-xs font-semibold text-slate-400 truncate">
                    @{traveler.username}
                </p>

                {/* Location Detail */}
                {traveler.location && (
                    <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-sky-400 bg-sky-500/10 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full border border-sky-500/20 max-w-full mx-auto shadow-inner">
                        <FiMapPin className="text-xs sm:text-sm shrink-0" />
                        <span className="truncate">{traveler.location}</span>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-slate-400 transition-colors duration-300 group-hover:text-white">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                    View Travel Log
                </span>

                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-400 shadow-md">
                    <FiArrowRight className="text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
            </div>
        </Link>
    );
};

export default TravelerCard;