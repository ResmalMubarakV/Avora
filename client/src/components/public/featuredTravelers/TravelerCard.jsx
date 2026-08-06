import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

// ==========================================
// TRAVELER CARD COMPONENT (PREMIUM LIGHT)
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
                rounded-[2rem]
                border
                border-slate-100
                bg-white
                p-8
                shadow-[0_15px_40px_-15px_rgba(30,58,138,0.05)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-blue-100
                hover:shadow-[0_20px_50px_-10px_rgba(30,58,138,0.15)]
                w-full
                overflow-hidden
            "
        >
            {/* Subtle Hover Gradient Glow */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />

            <div className="relative z-10">
                {/* Traveler Avatar Image */}
                <div className="flex justify-center">
                    <div className="relative">
                        <img
                            src={
                                traveler.profileImage ||
                                "https://ui-avatars.com/api/?background=f1f5f9&color=1e3a8a&name=" +
                                    encodeURIComponent(traveler.name)
                            }
                            alt={traveler.name}
                            className="
                                h-20
                                w-20
                                rounded-[1.25rem]
                                border-2
                                border-white
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-105
                                shadow-[0_10px_20px_rgba(30,58,138,0.1)]
                            "
                        />
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold shadow-sm" />
                    </div>
                </div>

                {/* Full Name */}
                <h3 className="mt-5 text-center text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#1E3A8A] transition-colors truncate">
                    {traveler.name}
                </h3>

                {/* Username Handle */}
                <p className="mt-1 text-center text-sm font-semibold text-slate-400 truncate">
                    @{traveler.username}
                </p>

                {/* Location Detail */}
                {traveler.location && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-[#3559D4] bg-blue-50 py-1.5 px-3.5 rounded-full border border-blue-100 max-w-fit mx-auto transition-colors group-hover:bg-[#3559D4] group-hover:text-white group-hover:border-[#3559D4]">
                        <FiMapPin className="text-sm shrink-0" />
                        <span className="truncate">{traveler.location}</span>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="relative z-10 mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-slate-400 transition-colors duration-300 group-hover:text-[#1E3A8A]">
                <span className="text-xs font-bold uppercase tracking-widest">
                    View Journal
                </span>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] bg-slate-50 border border-slate-100 transition-all duration-300 group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:border-[#1E3A8A] shadow-sm">
                    <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
            </div>
        </Link>
    );
};

export default TravelerCard;