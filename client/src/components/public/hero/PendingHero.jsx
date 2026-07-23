import heroImage from "../../../assets/images/pending-bg.png";

const PendingHero = () => {
    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background */}
            <img
                src={heroImage}
                alt="Mountain Landscape"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay */}
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

            {/* Hero Content */}
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
                    lg:px-12"
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

                    <p className="
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

                    <div className="
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
                            className="
                                rounded-full
                                bg-sky-500
                                px-8 
                                py-3.5 
                                sm:px-10 
                                sm:py-4
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:scale-105
                                hover:bg-sky-400
                                hover:shadow-xl
                                hover:shadow-sky-500/30
                                active:scale-95
                            "
                        >
                            Explore Stories
                        </button>

                        <div
                            className="
                                flex
                                w-full
                                justify-center
                                sm:w-auto
                                items-center
                                gap-3
                                rounded-full
                                border
                                border-sky-500/20
                                bg-slate-900/40
                                px-5
                                py-3
                                backdrop-blur-md
                            "
                        >
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400" />

                            <span className="text-sm text-slate-300">
                                Awaiting approval
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="
                    absolute
                    bottom-6 
                    sm:bottom-8
                    left-1/2
                    z-20
                    -translate-x-1/2
                    text-center
                    text-slate-400
                "
            >
                <p className="mb-2 text-xs uppercase tracking-[0.35em]">
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