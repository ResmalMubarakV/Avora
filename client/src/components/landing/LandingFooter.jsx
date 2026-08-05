import avoraLogo from "../../assets/images/avoraLogo.png";

// ==========================================
// LANDING FOOTER COMPONENT
// ==========================================
/**
 * Renders the landing page footer section. Features ambient background gradients,
 * the Avora brand logo with smooth scroll-to-top interactivity, mission statement text,
 * a decorative divider, and copyright notice.
 */
const LandingFooter = () => {
    // --- Smooth Scroll to Top Handler ---
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer
            className="
                relative
                overflow-hidden
                border-t
                border-slate-200
                bg-gradient-to-br
                from-white
                via-[#F8FAFC]
                to-[#EEF4FF]
            "
        >
            {/* Background Ambient Glow & Lighting Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Left Glow Accent */}
                <div
                    className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-80
                        bg-gradient-to-r
                        from-[#1E3A8A]/12
                        via-[#1E3A8A]/5
                        to-transparent
                    "
                />

                {/* Right Glow Accent */}
                <div
                    className="
                        absolute
                        right-0
                        top-0
                        h-full
                        w-80
                        bg-gradient-to-l
                        from-[#3559D4]/12
                        via-[#3559D4]/5
                        to-transparent
                    "
                />

                {/* Top Highlight */}
                <div
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-32
                        bg-gradient-to-b
                        from-white
                        via-white/70
                        to-transparent
                    "
                />

                {/* Bottom Highlight */}
                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-32
                        bg-gradient-to-t
                        from-[#1E3A8A]/6
                        to-transparent
                    "
                />

                {/* Center Ambient Blur Glow */}
                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-[500px]
                        w-[500px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-[#1E3A8A]/6
                        blur-[120px]
                    "
                />
            </div>

            {/* Footer Inner Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 md:px-8">
                <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-center md:gap-14 md:text-left">
                    {/* Logo with Scroll-to-Top Action */}
                    <button
                        type="button"
                        onClick={scrollToTop}
                        aria-label="Back to top"
                        className="
                            rounded-2xl
                            transition-all
                            duration-300
                            hover:scale-105
                            cursor-pointer
                        "
                    >
                        <img
                            src={avoraLogo}
                            alt="Avora Logo"
                            draggable="false"
                            className="
                                h-20
                                w-auto
                                drop-shadow-lg
                                sm:h-24
                                md:h-28
                            "
                        />
                    </button>

                    {/* Mission Tagline */}
                    <div>
                        <p
                            className="
                                max-w-sm
                                text-base
                                leading-8
                                text-slate-700
                                sm:text-lg
                            "
                        >
                            Every adventure deserves
                            <br />
                            a place to be remembered.
                        </p>
                    </div>
                </div>

                {/* Decorative Divider */}
                <div
                    className="
                        mx-auto
                        mt-12
                        h-px
                        w-80
                        bg-gradient-to-r
                        from-transparent
                        via-[#1E3A8A]/25
                        to-transparent
                    "
                />

                {/* Copyright Notice */}
                <p
                    className="
                        mt-8
                        text-center
                        text-sm
                        text-slate-500
                    "
                >
                    © 2026 Avora. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default LandingFooter;