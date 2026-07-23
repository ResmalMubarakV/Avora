import TravelerCard from "./TravelerCard";

import avatar1 from "../../../assets/public/travelers/resmal.jpg";
import avatar2 from "../../../assets/public/travelers/sophia.jpg";
import avatar3 from "../../../assets/public/travelers/lucas.jpg";

const travelers = [
    {
        id: 1,
        name: "Resmal Mubarak V",
        username: "resmal._",
        location: "Kerala, India",
        avatar: avatar1,
    },
    {
        id: 2,
        name: "Sophia",
        username: "sophia",
        location: "Zermatt, Switzerland",
        avatar: avatar2,
    },
    {
        id: 3,
        name: "Lucas",
        username: "lucas",
        location: "Santorini, Greece",
        avatar: avatar3,
    },
];

const FeaturedTravelers = () => {
    return (
        <section className="bg-transparent py-16 sm:py-20 lg:py-24">

            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400 sm:text-sm">
                        PUBLIC PROFILES
                    </p>

                    <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                        Discover Fellow Travelers
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                        Explore public travel profiles, discover unique adventures, and get inspired
                        by stories shared from every corner of the world.
                    </p>

                </div>

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
                            key={traveler.id}
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
                <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                    {travelers.map((traveler) => (
                        <TravelerCard
                            key={traveler.id}
                            traveler={traveler}
                        />
                    ))}
                </div>

            </div>

        </section>
    );
};

export default FeaturedTravelers;