// ==========================================
// LANDING HIGHLIGHTS BAR COMPONENT (`client/src/pages/public/LandingHighlights.jsx`)
// ==========================================
import {
    Globe2,
    Images,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

const highlights = [
    {
        icon: Images,
        value: "Unlimited",
        title: "Photos & Videos",
        subtitle: "Zero storage limits",
    },
    {
        icon: Sparkles,
        value: "AI Powered",
        title: "Story Generation",
        subtitle: "Smart travel timelines",
    },
    {
        icon: Globe2,
        value: "Digital",
        title: "Travel Journal",
        subtitle: "Interactive world map",
    },
    {
        icon: ShieldCheck,
        value: "Privacy First",
        title: "Secure Sharing",
        subtitle: "Public or private vaults",
    },
];

const LandingHighlights = () => {
    return (
        <section className="relative z-20 mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10 lg:-mt-8">
            {/* Unified Glassmorphic Floating Panel */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/80 backdrop-blur-2xl p-2 shadow-[0_25px_60px_-15px_rgba(30,58,138,0.15)] md:rounded-[2.5rem]">
                
                {/* Subtle internal glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/50 pointer-events-none" />

                <div className="relative grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                    
                    {highlights.map((highlight, index) => {
                        const Icon = highlight.icon;

                        return (
                            <div
                                key={highlight.title}
                                className="group flex flex-col items-center p-8 text-center transition-all duration-500 hover:bg-slate-50/50 lg:items-start lg:text-left"
                            >
                                {/* Premium Icon Container */}
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[1rem] bg-gradient-to-br from-[#1E3A8A]/5 to-[#3559D4]/10 text-[#1E3A8A] border border-[#1E3A8A]/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(30,58,138,0.2)]">
                                    <Icon className="h-6 w-6" />
                                </div>

                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    {highlight.value}
                                </h3>

                                <p className="mt-1.5 text-base font-bold text-slate-700">
                                    {highlight.title}
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-400">
                                    {highlight.subtitle}
                                </p>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
};

export default LandingHighlights;