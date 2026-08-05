import { useEffect, useState } from "react";

import TravelerCard from "./TravelerCard";
import { getFeaturedTravelers } from "../../../api/publicApi";

// ==========================================
// FEATURED TRAVELERS SECTION COMPONENT
// ==========================================
/**
 * Renders the featured public travelers section on the public landing page.
 * Features data fetching with loading skeleton and error states, a responsive 
 * horizontal snap-scroll carousel for mobile/tablets, and a 3-column grid for desktops.
 */
const FeaturedTravelers = () => {
    const [travelers, setTravelers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --- Fetch Featured Travelers on Mount ---
    useEffect(() => {
        const fetchTravelers = async () => {
            try {
                setLoading(true);
                const data = await getFeaturedTravelers();
                setTravelers(data);
            } catch (err) {
                console.error("Failed to load featured travelers:", err);
                setError("Unable to load travelers.");
            } finally {
                setLoading(false);
            }
        };

        fetchTravelers();
    }, []);

    return (
        <section
            id="featured-travelers"
            className="bg-transparent py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                {/* Section Header Banner */}
                <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400 sm:text-sm">
                        PUBLIC PROFILES
                    </p>

                    <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                        Discover Fellow Travelers
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                        Explore public travel profiles, discover unique
                        adventures, and get inspired by stories shared from every
                        corner of the world.
                    </p>
                </div>

                {/* Loading State Banner */}
                {loading && (
                    <div className="flex justify-center">
                        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-8 py-6 text-sm font-medium text-slate-300 shadow-md">
                            Loading travelers...
                        </div>
                    </div>
                )}

                {/* Error State Banner */}
                {!loading && error && (
                    <div className="flex justify-center">
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-6 text-sm font-medium text-red-300 shadow-md">
                            {error}
                        </div>
                    </div>
                )}

                {/* Empty State Banner */}
                {!loading && !error && travelers.length === 0 && (
                    <div className="flex justify-center">
                        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-8 py-6 text-sm font-medium text-slate-300 shadow-md">
                            No public travelers found.
                        </div>
                    </div>
                )}

                {/* Travelers Data List */}
                {!loading && !error && travelers.length > 0 && (
                    <>
                        {/* Mobile Swipe Hint Pill */}
                        <div className="mb-8 flex items-center justify-center lg:hidden">
                            <span className="rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400 backdrop-blur shadow-sm">
                                ← Swipe to explore →
                            </span>
                        </div>

                        {/* Mobile & Tablet Horizontal Carousel */}
                        <div
                            className="
                                no-scrollbar
                                flex
                                gap-5
                                overflow-x-auto
                                snap-x
                                snap-mandatory
                                pb-4
                                lg:hidden
                            "
                        >
                            {travelers.map((traveler) => (
                                <div
                                    key={traveler._id}
                                    className="
                                        w-[320px]
                                        max-w-[85vw]
                                        shrink-0
                                        snap-center
                                    "
                                >
                                    <TravelerCard traveler={traveler} />
                                </div>
                            ))}
                        </div>

                        {/* Desktop 3-Column Grid */}
                        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
                            {travelers.map((traveler) => (
                                <TravelerCard
                                    key={traveler._id}
                                    traveler={traveler}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedTravelers;