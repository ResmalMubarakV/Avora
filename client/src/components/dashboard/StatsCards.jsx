import { Globe2, Images, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatsCards = ({
    totalMemories = 0,
    publicMemories = 0,
    privateMemories = 0,
}) => {

    const navigate = useNavigate();

    const stats = [
        {
            title: "Total",
            value: totalMemories,
            description: "Every journey you've captured.",
            icon: Images,
            iconBg: "bg-[#1E3A8A]",
            iconColor: "text-white",
            path: "/dashboard/memories",
        },
        {
            title: "Public",
            value: publicMemories,
            description: "Shared with everyone.",
            icon: Globe2,
            iconBg: "bg-[#1E3A8A]/15",
            iconColor: "text-[#1E3A8A]",
            path: "/dashboard/memories?visibility=public",
        },
        {
            title: "Private",
            value: privateMemories,
            description: "Visible only to you.",
            icon: Lock,
            iconBg: "bg-[#1E3A8A]/15",
            iconColor: "text-[#1E3A8A]",
            path: "/dashboard/memories?visibility=private",
        },
    ];

    return (

        <section className="mb-8 lg:mb-10">

            <div className="grid grid-cols-3 gap-3 md:grid-cols-3 md:gap-5 lg:gap-6">

                {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (

                        <button
                            key={stat.title}
                            onClick={() => navigate(stat.path)}
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-gradient-to-br
                                from-white
                                via-[#F8FAFC]
                                to-[#1E3A8A]/10
                                p-3
                                sm:p-2
                                md:p-5
                                lg:p-7
                                xl:p-8
                            "
                        >

                            {/* Navy Background Glow */}

                            <div
                                className="
                                    absolute
                                    -right-14
                                    -top-14
                                    h-40
                                    w-40
                                    rounded-full
                                    bg-[#1E3A8A]/10
                                    blur-3xl
                                    transition-all
                                    duration-500
                                    group-hover:bg-[#1E3A8A]/15
                                    group-hover:scale-110
                                "
                            />

                            {/* Content */}

                            <div className="relative z-10">

                                <div className="flex items-center justify-between">

                                    <div
                                        className={`
                                            ${stat.iconBg}
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            transition-all
                                            duration-300
                                            group-hover:scale-110
                                            md:h-14
                                            md:w-14
                                            md:rounded-2xl
                                        `}
                                    >

                                        <Icon
                                            size={18}
                                            className={stat.iconColor}
                                        />

                                    </div>

                                </div>

                                <h2 className="
                                    mt-4
                                    text-2xl
                                    sm:text-4xl
                                    lg:text-5xl
                                ">

                                    {stat.value}

                                </h2>

                                <p className="
                                    mt-1
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                    md:text-sm
                                ">

                                    {stat.title}

                                </p>

                                <p className="
                                    mt-2
                                    hidden
                                    text-xs
                                    leading-6
                                    text-slate-500
                                    md:block
                                ">

                                    {stat.description}

                                </p>

                            </div>

                        </button>

                    );

                })}

            </div>

        </section>

    );

};

export default StatsCards;