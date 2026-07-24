import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

const DashboardHero = () => {
    const navigate = useNavigate();

    const { user, loading } = useCurrentUser();

    return (
        <section className="mb-6 md:mb-8 lg:mb-10">

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                {/* Left */}

                <div>

                    <h2
                        className="
                            text-[2.25rem]
                            leading-none
                            font-bold
                            tracking-tight
                            text-slate-900

                            sm:text-4xl
                            lg:text-5xl
                        "
                    >
                        Dashboard
                    </h2>

                    <h3
                        className="
                            mt-3
                            text-[1.05rem]
                            leading-snug
                            font-semibold
                            text-slate-700

                            sm:mt-2
                            sm:text-xl

                            lg:text-2xl
                        "
                    >
                        Welcome back,{" "}
                        {loading
                            ? "Traveler"
                            : user?.name || "Traveler"}{" "}
                        👋
                    </h3>

                    <p
                        className="
                            mt-2
                            text-[15px]
                            leading-6
                            text-slate-500

                            sm:mt-1
                            sm:text-base

                            lg:text-lg
                        "
                    >
                        Here's your travel summary.
                    </p>

                </div>

                {/* Desktop / Tablet Only */}

                <div className="hidden md:flex">

                    <button
                        onClick={() => navigate("/dashboard/create-memory")}
                        className="
                            group
                            inline-flex
                            items-center
                            justify-center
                            gap-2

                            rounded-2xl

                            bg-gradient-to-r
                            from-[#1E3A8A]
                            to-[#3559D4]

                            px-6
                            py-3.5

                            text-base
                            font-semibold
                            text-white

                            shadow-lg
                            shadow-[#1E3A8A]/20

                            transition-all
                            duration-300

                            hover:-translate-y-0.5
                            hover:shadow-xl
                            hover:shadow-[#1E3A8A]/30

                            active:scale-[0.98]
                        "
                    >

                        <Plus
                            size={18}
                            className="
                                transition-transform
                                duration-300
                                group-hover:rotate-90
                            "
                        />

                        <span>

                            New Memory

                        </span>

                    </button>

                </div>

            </div>

        </section>
    );
};

export default DashboardHero;