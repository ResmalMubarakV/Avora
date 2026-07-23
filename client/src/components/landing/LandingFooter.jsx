import avoraLogo from "../../assets/images/avoraLogo.png";

const LandingFooter = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="bg-transparent">

            <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">

                <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-center md:gap-12 md:text-left">

                    <button
                        onClick={scrollToTop}
                        aria-label="Back to top"
                        className="cursor-pointer rounded-xl transition duration-300 hover:scale-105"
                    >
                        <img
                            src={avoraLogo}
                            alt="Avora Logo"
                            className="h-20 w-auto sm:h-24 md:h-28"
                            draggable="false"
                        />
                    </button>

                    <div>
                        <p className="max-w-xs text-base leading-7 text-slate-600 sm:text-lg">
                            Every adventure deserves
                            <br />
                            a place to be remembered.
                        </p>
                    </div>

                </div>

                <div className="mx-auto mt-10 h-px w-72 bg-slate-300" />

                <p className="mt-8 text-center text-sm text-slate-500">
                    © 2026 Avora. All rights reserved.
                </p>

            </div>

        </footer>
    );
};

export default LandingFooter;