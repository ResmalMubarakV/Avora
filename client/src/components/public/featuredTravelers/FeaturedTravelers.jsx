import { useEffect, useState } from "react";
import { Loader2, Globe, AlertCircle, Sparkles } from "lucide-react";

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
            className="relative py-24 sm:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
        >
            {/* Ambient Background Decorative Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-sky-300 mb-4 shadow-sm backdrop-blur-md">
                        <Sparkles size={13} />
                        <span>Community Feed</span>
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Discover Fellow Travelers
                    </h2>

                    <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-medium">
                        Browse verified public profiles, read immersive journals, and get inspired by stories shared from every corner of the world.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 size={36} className="animate-spin text-sky-400" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
                            Loading Community Profiles...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="flex justify-center px-4">
                        <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm font-semibold text-red-300 shadow-sm backdrop-blur-md">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && travelers.length === 0 && (
                    <div className="flex justify-center px-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md px-8 py-6 text-sm font-medium text-slate-400 shadow-sm text-center">
                            No public travelers available yet. Check back soon!
                        </div>
                    </div>
                )}

                {/* Travelers Responsive Grid (No horizontal scrolling) */}
                {!loading && !error && travelers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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