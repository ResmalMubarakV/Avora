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
        title: "Photos &",
        subtitle: "Videos",
    },
    {
        icon: Sparkles,
        value: "AI Powered",
        title: "Travel Story",
        subtitle: "Generation",
    },
    {
        icon: Globe2,
        value: "Digital",
        title: "Travel",
        subtitle: "Journal",
    },
    {
        icon: ShieldCheck,
        value: "Privacy First",
        title: "Public or",
        subtitle: "Private Sharing",
    },
];

const LandingHighlightsBar = () => {
    return (
        <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10 lg:-mt-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl sm:p-6 md:rounded-[32px]">

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {highlights.map((highlight) => {
                        const Icon = highlight.icon;

                        return (
                            <div
                                key={highlight.title}
                                className="group flex flex-col items-center rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 lg:items-start lg:text-left"
                            >
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition-colors duration-300 group-hover:bg-slate-900 group-hover:text-white">
                                    <Icon className="h-7 w-7" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                    {highlight.value}
                                </h3>

                                <p className="mt-2 text-base font-semibold text-slate-800 sm:text-lg">
                                    {highlight.title}
                                </p>

                                <p className="text-sm text-slate-500 sm:text-base">
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

export default LandingHighlightsBar;