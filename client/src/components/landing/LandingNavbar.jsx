import avoraLogo from "../../assets/images/avoraLogo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-5 md:px-8 md:py-6">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-1.5 sm:gap-2 md:gap-3"
                >
                    <img
                        src={avoraLogo}
                        alt="Avora Logo"
                        className="h-9 w-auto select-none sm:h-10 md:h-16"
                        draggable="false"
                    />

                    <span className="text-xl font-light uppercase tracking-[0.12em] text-slate-900 sm:text-2xl md:text-[42px] md:tracking-[0.16em]">
                        AVORA
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-5">

                    <Link
                        to="/login"
                        className="text-xs font-medium text-slate-700 transition-colors duration-300 hover:text-slate-900 sm:text-sm md:text-base"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-md sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-base"
                    >
                        Get Started
                    </Link>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;