// ==========================================
// WHY CHOOSE AVORA COMPONENT (`client/src/pages/public/WhyChooseAvora.jsx`)
// ==========================================
import { Sparkles, Image as ImageIcon, Lock, Map } from "lucide-react";

const features = [
    {
        icon: Sparkles,
        title: "AI-Powered Travel Stories",
        description:
            "Transform your scattered travel memories into beautifully written, cinematic stories with intelligent AI assistance.",
    },
    {
        icon: ImageIcon,
        title: "Photos & Videos Together",
        description:
            "Keep every high-resolution photo and 4K video from your journey seamlessly organized in one beautiful place.",
    },
    {
        icon: Lock,
        title: "Private Memory Vault",
        description:
            "Bank-level security for your memories. Choose exactly what to share with the world and what to keep just for yourself.",
    },
    {
        icon: Map,
        title: "Interactive Digital Journal",
        description:
            "Relive every adventure through an interactive mapping timeline designed to preserve your exact routes forever.",
    },
];

const WhyChooseAvora = () => {
    return (
        <section className="relative overflow-hidden mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32 w-full">
            
            {/* Ambient Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(53,89,212,0.03)_0,transparent_60%)] pointer-events-none" />

            {/* Section Header */}
            <div className="relative z-10 mx-auto max-w-3xl text-center w-full">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white px-4 py-2 text-xs font-bold text-[#1E3A8A] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3559D4]" />
                    Why Choose Avora
                </div>

                <h2 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl 2xl:text-6xl">
                    More Than A Gallery.
                    <br />
                    <span className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#3559D4] bg-clip-text text-transparent">
                        It's Your Travel Legacy.
                    </span>
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
                    Avora helps you preserve every adventure with photos,
                    videos, and AI-powered storytelling—
                    beautifully orchestrated into a private, premium journal.
                </p>
            </div>

            {/* Premium Feature Grid */}
            <div className="relative z-10 mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:mt-24 md:grid-cols-2 lg:gap-8 w-full">
                {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.title}
                            className="group relative flex flex-col items-start gap-4 rounded-[2rem] bg-white p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(30,58,138,0.15)] border border-slate-100 hover:border-blue-100 overflow-hidden w-full"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />

                            {/* Feature Icon Badge */}
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-slate-50 border border-slate-100 transition-all duration-500 group-hover:bg-[#1E3A8A] group-hover:border-[#1E3A8A] group-hover:shadow-[0_10px_20px_rgba(30,58,138,0.2)]">
                                <Icon className="h-6 w-6 text-slate-700 transition-colors duration-500 group-hover:text-white" />
                            </div>

                            {/* Feature Text Content */}
                            <div className="mt-2 w-full min-w-0">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default WhyChooseAvora;