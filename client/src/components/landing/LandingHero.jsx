import { Link } from "react-router-dom";
import heroLanding from "../../assets/images/heroLanding.png";

const LandingHero = () => {
    return (
        <section className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-5 py-12 md:flex-row md:items-center md:justify-between md:gap-10 md:px-8 md:py-16 lg:min-h-[calc(100vh-96px)] lg:py-0">

            {/* Left Content */}
            <div className="w-full text-center md:max-w-md md:text-left lg:max-w-xl">

                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-lg sm:text-sm">
                    ✈️ Your Travel Memories, Forever
                </div>

                <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:mt-8 lg:text-6xl lg:leading-[1.08]">
                    Every Journey
                    <br />
                    Deserves To Be
                    <br />
                    Remembered.
                </h1>

                <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:mx-0 lg:mt-6">
                    Preserve every trip with photos, videos, stories and
                    locations in one beautiful digital travel diary powered by AI.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start lg:mt-10">

                    <Link
                        to="/register"
                        className="rounded-full bg-slate-900 px-7 py-3.5 text-center text-white transition-all duration-300 hover:bg-slate-800"
                    >
                        Start Your Journey
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-full border border-slate-300 px-7 py-3.5 text-center text-slate-900 transition-all duration-300 hover:bg-slate-100"
                    >
                        Login
                    </Link>

                </div>

            </div>

            {/* Right Content */}
            <div className="flex w-full justify-center md:flex-1 md:justify-end">

                <img
                    src={heroLanding}
                    alt="Avora Hero"
                    draggable="false"
                    className="w-full max-w-[280px] animate-float object-contain transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02] sm:max-w-sm md:max-w-md lg:max-w-2xl"
                />

            </div>

        </section>
    );
};

export default LandingHero;