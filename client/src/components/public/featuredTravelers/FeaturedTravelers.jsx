import { useEffect, useState } from "react";

import TravelerCard from "./TravelerCard";
import { getFeaturedTravelers } from "../../../api/publicApi";

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
                console.error(err);
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

                {loading && (
                    <div className="flex justify-center">
                        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-8 py-6 text-slate-300">
                            Loading travelers...
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex justify-center">
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-6 text-red-300">
                            {error}
                        </div>
                    </div>
                )}

                {!loading && !error && travelers.length === 0 && (
                    <div className="flex justify-center">
                        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-8 py-6 text-slate-300">
                            No public travelers found.
                        </div>
                    </div>
                )}

                {!loading && !error && travelers.length > 0 && (
                    <>
                        <div className="mb-8 flex items-center justify-center lg:hidden">
                            <span className="rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400 backdrop-blur">
                                ← Swipe to explore →
                            </span>
                        </div>

                        {/* Mobile & Tablet Carousel */}
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

                        {/* Desktop Grid */}
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