import useCurrentUser from "../../hooks/useCurrentUser";

const DashboardHero = () => {
    const { user, loading } = useCurrentUser();

    return (
        <section>
            <h2
                className="
                    text-3xl
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
                    mt-2
                    text-lg
                    font-semibold
                    text-slate-700
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
                    mt-1
                    text-sm
                    text-slate-500
                    sm:text-base
                    lg:text-lg
                "
            >
                Here's your travel summary.
            </p>
        </section>
    );
};

export default DashboardHero;