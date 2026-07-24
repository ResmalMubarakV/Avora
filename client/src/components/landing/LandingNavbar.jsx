import { Link } from "react-router-dom";
import Logo from "../common/Logo";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">

            <div
                className="
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between

                    px-4
                    py-4

                    sm:px-5
                    md:px-8
                    md:py-6
                "
            >

                {/* Logo */}

                <div className="flex-shrink-0">

                    {/* Mobile Logo */}

                    <div className="sm:hidden">
                        <Logo to="/" size="sm" />
                    </div>

                    {/* Tablet & Desktop Logo */}

                    <div className="hidden sm:block">
                        <Logo to="/" size="lg" />
                    </div>

                </div>

                {/* Actions */}

                <div className="flex items-center gap-2 sm:gap-3 md:gap-5">

                    {/* Hide Login on Mobile */}

                    <Link
                        to="/login"
                        className="
                            hidden
                            sm:block

                            text-sm
                            font-medium
                            text-slate-700

                            transition-colors
                            duration-300

                            hover:text-slate-900

                            md:text-base
                        "
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="
                            rounded-full

                            bg-slate-900

                            px-4
                            py-2.5

                            text-sm
                            font-semibold
                            text-white

                            shadow-sm

                            transition-all
                            duration-300

                            hover:bg-slate-800
                            hover:shadow-md

                            sm:px-5
                            md:px-6
                            md:py-3
                            md:text-base
                        "
                    >
                        Get Started
                    </Link>

                </div>

            </div>

        </nav>
    );
};

export default Navbar;