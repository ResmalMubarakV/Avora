import { useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import avoraLogo from "../../assets/images/avoraLogo.png";
import avoraLogoDark from "../../assets/images/avoraLogoDark.png";
import LegalModal from "../common/LegalModal";

const LandingFooter = () => {
    const [legalModalOpen, setLegalModalOpen] = useState(false);
    const [legalTab, setLegalTab] = useState("privacy");

    const openLegal = (tab) => {
        setLegalTab(tab);
        setLegalModalOpen(true);
    };

    return (
        <footer className="relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-12 pb-8 w-full transition-colors duration-300">
            
            {/* Ambient Glowing Background Effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -bottom-20 left-1/2 h-[15rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#1E3A8A]/5 dark:from-indigo-600/15 to-transparent blur-[80px]" />
                {/* Blueprint Texture Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a03_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a03_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#6366f10a_1px,transparent_1px),linear-gradient(to_bottom,#6366f10a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_100%_at_50%_100%,#000_50%,transparent_100%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
                
                {/* Top Section: Grid Layout for Left, Middle, Right alignment */}
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3 w-full">
                    
                    {/* Left: Brand Logo */}
                    <div className="flex justify-center md:justify-start">
                        {/* Light Mode Logo */}
                        <img
                            src={avoraLogo}
                            alt="Avora Logo"
                            className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105 dark:hidden"
                            draggable={false}
                        />
                        {/* Dark Mode Logo */}
                        <img
                            src={avoraLogoDark}
                            alt="Avora Logo Dark"
                            className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-transform duration-500 hover:scale-105 hidden dark:block"
                            draggable={false}
                        />
                    </div>

                    {/* Middle: Tagline */}
                    <div className="flex justify-center text-center">
                        <p className="max-w-xs text-sm sm:text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                            The world's most elegant platform for preserving your global travel memories.
                        </p>
                    </div>

                    {/* Right: Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/90 dark:hover:border-indigo-500/40">
                            <ShieldCheck className="h-4 w-4 text-[#3559D4] dark:text-indigo-400 shrink-0" />
                            <span>Encrypted Vault</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/90 dark:hover:border-indigo-500/40">
                            <Sparkles className="h-4 w-4 text-[#3559D4] dark:text-indigo-400 shrink-0" />
                            <span>AI Curated</span>
                        </div>
                    </div>

                </div>

                {/* Sleek Divider */}
                <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

                {/* Bottom Section: Copyright & Links */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row w-full">
                    
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        © {new Date().getFullYear()} Avora Platforms Inc.
                    </p>

                    <div className="flex items-center gap-6 text-xs font-medium text-slate-400 dark:text-slate-400">
                        <button
                            type="button"
                            onClick={() => openLegal("privacy")}
                            className="hover:text-[#1E3A8A] dark:hover:text-indigo-300 transition-colors cursor-pointer"
                        >
                            Privacy Policy
                        </button>
                        <button
                            type="button"
                            onClick={() => openLegal("terms")}
                            className="hover:text-[#1E3A8A] dark:hover:text-indigo-300 transition-colors cursor-pointer"
                        >
                            Terms & Conditions
                        </button>
                    </div>

                </div>
            </div>

            {/* Legal Lightbox Modal */}
            <LegalModal
                isOpen={legalModalOpen}
                onClose={() => setLegalModalOpen(false)}
                initialTab={legalTab}
            />
        </footer>
    );
};

export default LandingFooter;