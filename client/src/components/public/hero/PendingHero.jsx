import { ShieldCheck, ArrowDown, Compass } from "lucide-react";
import heroImage from "../../../assets/images/pending-bg.png";

// ==========================================
// PENDING HERO COMPONENT (RESPONSIVE)
// ==========================================
const PendingHero = () => {
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-8">
            {/* Background Scenic Landscape Image */}
            <img
                src={heroImage}
                alt="Scenic Landscape"
                className="absolute inset-0 h-full w-full object-cover scale-100 transition-transform duration-1000 hover:scale-105"
            />

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 backdrop-blur-[2px]" />

            {/* Hero Main Content Container */}
            <div className="relative z-10 mx-auto max-w-4xl text-center w-full">
                
                {/* Floating Amber Status Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-3.5 py-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider sm:tracking-widest text-amber-200 backdrop-blur-xl mb-6 sm:mb-8 shadow-xl shadow-amber-500/10">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    </span>
                    <span className="truncate">Account Pending Administrative Review</span>
                </div>

                <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] sm:leading-none drop-shadow-sm">
                    Your Journey <br />
                    <span className="bg-gradient-to-r from-sky-400 via-blue-200 to-white bg-clip-text text-transparent">
                        Has Begun
                    </span>
                </h1>

                {/* Ultra-Clean Glassmorphic Information Card */}
                <div className="mx-auto mt-6 sm:mt-8 max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-5 sm:p-9 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-left space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 text-sky-300 font-bold text-xs sm:text-sm tracking-wide">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-inner">
                            <Compass size={18} />
                        </div>
                        <span>Welcome to the Avora Global Community</span>
                    </div>
                    <p className="text-xs sm:text-base text-slate-100 leading-relaxed font-medium">
                        Your account has been successfully created and secured. To maintain a trusted environment for travel creators, our administration team reviews all incoming registrations.
                    </p>
                    <div className="border-t border-white/15 pt-3 sm:pt-4 text-[11px] sm:text-xs text-slate-300 font-medium">
                        While our team verifies your credentials, feel free to explore inspiring logs and expeditions shared by global explorers below.
                    </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={handleExploreProfiles}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <span>Explore Community Profiles</span>
                        <ArrowDown size={15} className="animate-bounce shrink-0" />
                    </button>
                </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 -translate-x-1/2 text-center text-white/70 hidden sm:block">
                <div className="animate-bounce flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest font-semibold">
                    <span>Scroll</span>
                    <ArrowDown size={13} />
                </div>
            </div>
        </section>
    );
};

export default PendingHero;