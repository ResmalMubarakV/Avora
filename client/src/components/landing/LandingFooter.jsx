import { ShieldCheck, Sparkles } from "lucide-react";
import avoraLogo from "../../assets/images/avoraLogo.png";

// ==========================================
// LANDING FOOTER COMPONENT (MINIMAL ELITE)
// ==========================================
const LandingFooter = () => {
    return (
        <footer className="relative overflow-hidden border-t border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50 pt-12 pb-8">
            
            {/* Extremely Subtle Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -bottom-20 left-1/2 h-[15rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#1E3A8A]/5 to-transparent blur-[80px]" />
                {/* Blueprint Texture Fade */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a03_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a03_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_100%_at_50%_100%,#000_50%,transparent_100%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                
                {/* Top Section: Grid Layout for Left, Middle, Right alignment */}
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
                    
                    {/* Left: Brand Logo (Increased Size) */}
                    <div className="flex justify-center md:justify-start">
                        <img
                            src={avoraLogo}
                            alt="Avora Logo"
                            className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                            draggable={false}
                        />
                    </div>

                    {/* Middle: Tagline */}
                    <div className="flex justify-center text-center">
                        <p className="max-w-xs text-sm sm:text-base font-medium leading-relaxed text-slate-500">
                            The world's most elegant platform for preserving your global travel memories.
                        </p>
                    </div>

                    {/* Right: Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-50">
                            <ShieldCheck className="h-4 w-4 text-[#3559D4]" />
                            <span>Encrypted Vault</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-50">
                            <Sparkles className="h-4 w-4 text-[#3559D4]" />
                            <span>AI Curated</span>
                        </div>
                    </div>

                </div>

                {/* Sleek Divider */}
                <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* Bottom Section: Copyright & Links */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        © {new Date().getFullYear()} Avora Platforms Inc.
                    </p>

                    <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
                        <a href="/privacy" className="hover:text-[#1E3A8A] transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-[#1E3A8A] transition-colors">Terms</a>
                        <a href="/contact" className="hover:text-[#1E3A8A] transition-colors">Contact</a>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;