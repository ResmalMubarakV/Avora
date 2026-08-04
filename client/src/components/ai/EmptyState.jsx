import {
    Sparkles,
    Map,
    Backpack,
    Camera,
    Wallet,
    UtensilsCrossed,
    Plane,
} from "lucide-react";

const suggestions = [
    {
        icon: <Plane size={20} />,
        title: "Plan my next adventure",
        prompt:
            "Suggest my next travel destination based on my previous trips.",
    },
    {
        icon: <Map size={20} />,
        title: "Create a travel itinerary",
        prompt:
            "Create a complete itinerary for my next vacation.",
    },
    {
        icon: <Wallet size={20} />,
        title: "Estimate travel budget",
        prompt:
            "Estimate the budget for my next trip.",
    },
    {
        icon: <Camera size={20} />,
        title: "Write Instagram captions",
        prompt:
            "Write creative Instagram captions for my travel photos.",
    },
    {
        icon: <UtensilsCrossed size={20} />,
        title: "Recommend local food",
        prompt:
            "Recommend local foods I should try during my trip.",
    },
    {
        icon: <Backpack size={20} />,
        title: "Packing checklist",
        prompt:
            "Prepare a packing checklist for my next journey.",
    },
];

const EmptyState = ({ onSelect }) => {

    return (

        <div
            className="
                mx-auto
                flex
                max-w-4xl
                flex-col
                items-center

                px-6
                py-20
            "
        >

            <div
                className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center

                    rounded-3xl

                    bg-gradient-to-br
                    from-[#3559D4]
                    to-[#1E3A8A]

                    text-white

                    shadow-xl
                    shadow-blue-300/40
                "
            >

                <Sparkles size={36} />

            </div>

            <h1
                className="
                    mt-8
                    text-center
                    text-4xl
                    font-bold
                    tracking-tight
                    text-slate-900
                "
            >
                How can Avora AI help you today?
            </h1>

            <p
                className="
                    mt-4
                    max-w-2xl
                    text-center
                    text-lg
                    leading-8
                    text-slate-500
                "
            >
                Plan trips, discover destinations, estimate budgets,
                create itineraries, write travel memories and receive
                personalized recommendations based on your previous journeys.
            </p>

            <div
                className="
                    mt-14
                    hidden
                    w-full
                    gap-5

                    md:grid
                    md:grid-cols-2
                    lg:grid-cols-3
                "
            >

                {suggestions.map((item) => (

                    <button
                        key={item.title}
                        onClick={() => onSelect(item.prompt)}
                        className="
                            group

                            rounded-3xl

                            border
                            border-slate-200

                            bg-white/80
                            backdrop-blur-xl

                            p-6

                            text-left

                            shadow-sm

                            transition-all
                            duration-300

                            hover:-translate-y-2
                            hover:border-[#3559D4]
                            hover:shadow-xl
                        "
                    >

                        <div
                            className="
                                mb-5

                                flex
                                h-12
                                w-12
                                items-center
                                justify-center

                                rounded-2xl

                                bg-blue-50

                                text-[#3559D4]

                                transition-transform
                                duration-300

                                group-hover:scale-110
                            "
                        >

                            {item.icon}

                        </div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                            "
                        >
                            {item.title}
                        </h3>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Click to instantly ask Avora AI.
                        </p>

                    </button>

                ))}

            </div>

        </div>

    );

};

export default EmptyState;