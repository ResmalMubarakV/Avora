import { CheckCircle2 } from "lucide-react";

// ==========================================
// WHY CHOOSE AVORA FEATURES DATA
// ==========================================
const features = [
    {
        title: "AI-Powered Travel Stories",
        description:
            "Transform your travel memories into beautifully written stories with intelligent AI assistance.",
    },
    {
        title: "Photos & Videos Together",
        description:
            "Keep every photo and video from your journey organized in one beautiful place.",
    },
    {
        title: "Public & Private Memories",
        description:
            "Choose what to share with the world and what to keep just for yourself.",
    },
    {
        title: "Your Digital Travel Journal",
        description:
            "Relive every adventure through a timeline designed to preserve your memories forever.",
    },
];

// ==========================================
// WHY CHOOSE AVORA COMPONENT
// ==========================================
/**
 * Renders the "Why Choose Avora" feature showcase section on the landing page.
 * Features a centered header banner, responsive multi-column feature grid cards, 
 * and interactive hover animations.
 */
const WhyChooseAvora = () => {
    return (
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
            {/* Section Header */}
            <div className="mx-auto max-w-3xl text-center">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    Why Choose Avora
                </span>

                <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                    More Than A Gallery.
                    <br />
                    It's Your Travel Story.
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                    Avora helps you preserve every adventure with photos,
                    videos, memories and AI-powered storytelling—
                    beautifully organized in one private journal.
                </p>
            </div>

            {/* Features Grid */}
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 sm:gap-10 lg:mt-24 lg:gap-x-16 lg:gap-y-12">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="group flex items-start gap-4 rounded-2xl p-2 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Feature Icon Badge */}
                        <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-colors duration-300 group-hover:bg-slate-900 shadow-sm">
                            <CheckCircle2 className="h-6 w-6 text-slate-900 transition-colors duration-300 group-hover:text-white" />
                        </div>

                        {/* Feature Text Content */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                                {feature.title}
                            </h3>

                            <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseAvora;