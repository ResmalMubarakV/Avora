import heroImage from "../../../assets/images/pending-bg.png";

// ==========================================
// PENDING HERO COMPONENT
// ==========================================
/**
 * Renders the hero banner for newly registered users awaiting admin approval. 
 * Features a scenic background image with gradient overlays, an approval status badge, 
 * smooth scrolling navigation to the featured travelers section, and animated bounce indicators.
 */
const PendingHero = () => {
    // --- Smooth Scroll to Featured Profiles Section ---
    const handleExploreProfiles = () => {
        const section = document.getElementById("featured-travelers");

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Scenic Landscape Image */}
            <img
                src={heroImage}
                alt="Mountain Landscape"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark Gradient Overlay */}
            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-black/80
                    via-slate-950/40
                    to-slate-950
                "
            />

            {/* Hero Main Content Container */}
            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-5
                    py-24
                    sm:px-8
                    lg:px-12
                "
            >
                <div className="mx-auto max-w-3xl text-center">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300 sm:text-sm">
                        WELCOME TO AVORA
                    </p>

                    <h1
                        className="
                            text-4xl
                            font-extrabold
                            leading-tight
                            tracking-tight
                            text-white
                            sm:text-5xl
                            lg:text-6xl
                            xl:text-7xl
                        "
                    >
                        Your Journey
                        <br />
                        Has Begun
                    </h1>

                    <p
                        className="
                            mx-auto
                            mt-8
                            max-w-2xl
                            text-base
                            leading-7
                            text-slate-300
                            sm:mt-10
                            sm:text-lg
                            sm:leading-8
                        "
                    >
                        Your account has been successfully created and is
                        currently awaiting approval.
                        <br />
                        <br />
                        While our team reviews your request, discover inspiring
                        travel stories shared by explorers from around the world.
                    </p>

                    {/* CTA Actions Button & Status Badge Group */}
                    <div
                        className="
                            mt-10
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-5
                            sm:mt-12
                            sm:flex-row
                        "
                    >
                        <button
                            type="button"
                            onClick={handleExploreProfiles}
                            className="
                                rounded-full
                                bg-sky-500
                                px-8
                                py-3.5
                                text-sm
                                font-semibold
                                text-white
                                cursor-pointer
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:scale-105
                                hover:bg-sky-400
                                hover:shadow-xl
                                hover:shadow-sky-500/30
                                active:scale-95
                                sm:px-10
                                sm:py-4
                            "
                        >
                            Explore Profiles
                        </button>

                        <div
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-3
                                rounded-full
                                border
                                border-sky-500/20
                                bg-slate-900/40
                                px-5
                                py-3
                                backdrop-blur-md
                                sm:w-auto
                            "
                        >
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400 shrink-0" />

                            <span className="text-sm font-medium text-slate-300">
                                Awaiting approval
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Scroll Bounce Indicator */}
            <div
                className="
                    absolute
                    bottom-6
                    left-1/2
                    z-20
                    -translate-x-1/2
                    text-center
                    text-slate-400
                    sm:bottom-8
                "
            >
                <p className="mb-2 text-xs uppercase tracking-[0.35em] font-semibold">
                    EXPLORE
                </p>

                <div className="animate-bounce text-2xl">
                    ↓
                </div>
            </div>
        </section>
    );
};

export default PendingHero;