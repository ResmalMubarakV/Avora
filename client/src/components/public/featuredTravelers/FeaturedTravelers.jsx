import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";

import TravelerCard from "./TravelerCard";
import { getFeaturedTravelers } from "../../../api/publicApi";

// ==========================================
// FEATURED TRAVELERS SECTION COMPONENT (GRID LAYOUT)
// ==========================================
const FeaturedTravelers = () => {
    const [travelers, setTravelers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTravelers = async () => {
            try {
                setLoading(true);
                const data = await getFeaturedTravelers();
                setTravelers(data);
            } catch (err) {
                console.error("Failed to load featured travelers:", err);
                setError("Unable to load public travelers at the moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchTravelers();
    }, []);

    return (
        <section
            id="featured-travelers"
            className="relative py-24 sm:py-32 bg-slate-50 overflow-hidden"
        >
            {/* Ambient Background Decorative Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-sky-200/40 blur-[100px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
                {/* Section Header */}
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1E3A8A] mb-6 shadow-sm backdrop-blur-md">
                        <Sparkles size={14} className="text-[#3559D4]" />
                        <span>Community Feed</span>
                    </div>

                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        Discover Fellow Travelers
                    </h2>

                    <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
                        Browse verified public profiles, read immersive journals, and get inspired by stories shared from every corner of the world.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={40} className="animate-spin text-[#3559D4]" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
                            Loading Community Profiles...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="flex justify-center px-4">
                        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-red-600 shadow-sm">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && travelers.length === 0 && (
                    <div className="flex justify-center px-4">
                        <div className="rounded-2xl border border-slate-200 bg-white backdrop-blur-md px-10 py-8 text-sm font-medium text-slate-500 shadow-sm text-center">
                            No public travelers available yet. Check back soon!
                        </div>
                    </div>
                )}

                {/* Travelers Responsive Bento Grid */}
                {!loading && !error && travelers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {travelers.map((traveler) => (
                            <TravelerCard
                                key={traveler._id}
                                traveler={traveler}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedTravelers;