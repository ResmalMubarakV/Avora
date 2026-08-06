import { ShieldCheck, ArrowDown, Compass, AlertCircle } from "lucide-react";
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 pt-28 pb-16 sm:px-8">
            {/* Background Image with Frosted Light Glass Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Scenic Landscape"
                    className="h-full w-full object-cover scale-100 transition-transform duration-1000 hover:scale-105 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-slate-50/90 to-slate-50 backdrop-blur-sm" />
                
                {/* Blueprint Grid Texture */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a05_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Hero Main Content Container */}
            <div className="relative z-10 mx-auto max-w-4xl text-center w-full mt-8">
                
                {/* Floating Status Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 backdrop-blur-md mb-8 shadow-sm">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span className="truncate">Account Pending Administrative Review</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] sm:leading-tight">
                    Your Journey <br />
                    <span className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#3559D4] bg-clip-text text-transparent">
                        Has Begun
                    </span>
                </h1>

                {/* Ultra-Clean Glassmorphic Information Card */}
                <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-white bg-white/70 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(30,58,138,0.15)] text-left space-y-4">
                    <div className="flex items-center gap-3 text-[#1E3A8A] font-bold text-sm sm:text-base tracking-tight">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shadow-sm text-[#3559D4]">
                            <ShieldCheck size={20} />
                        </div>
                        <span>Welcome to the Avora Global Community</span>
                    </div>
                    
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                        Your account has been successfully created and secured. To maintain a trusted environment for travel creators, our administration team reviews all incoming registrations.
                    </p>
                    
                    <div className="flex items-start gap-3 border-t border-slate-100 pt-5 mt-2">
                        <AlertCircle className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                            While our team verifies your credentials, feel free to explore inspiring logs and expeditions shared by global explorers below.
                        </p>
                    </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={handleExploreProfiles}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#2541b2] px-8 py-4 text-sm font-bold text-white shadow-[0_15px_30px_-5px_rgba(30,58,138,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-5px_rgba(30,58,138,0.4)] active:scale-95 cursor-pointer"
                    >
                        <span>Explore Community Profiles</span>
                        <ArrowDown size={16} className="animate-bounce shrink-0 text-blue-300" />
                    </button>
                </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center text-slate-400 hidden sm:block">
                <div className="animate-bounce flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest font-bold">
                    <span>Scroll</span>
                    <ArrowDown size={14} className="text-[#3559D4]" />
                </div>
            </div>
        </section>
    );
};

export default PendingHero;