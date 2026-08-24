import { Link } from "react-router-dom";
import Logo from "../common/Logo";

// ==========================================
// LANDING NAVBAR COMPONENT
// ==========================================
/**
 * Renders the top navigation bar for the public landing page.
 * Features a sticky blurred header, responsive brand logo sizes, and authentication 
 * action buttons (Login & Get Started).
 */
const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div
                className="
                    mx-auto
                    flex
                    max-w-7xl
                    w-full
                    items-center
                    justify-between

                    px-4
                    py-4

                    sm:px-5
                    md:px-8
                    md:py-6
                "
            >
                {/* Brand Logo Section */}
                <div className="flex-shrink-0">
                    {/* Mobile Logo View */}
                    <div className="sm:hidden">
                        <Logo to="/" size="sm" />
                    </div>

                    {/* Tablet & Desktop Logo View */}
                    <div className="hidden sm:block">
                        <Logo to="/" size="lg" />
                    </div>
                </div>

                {/* Right Action Buttons Section */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                    {/* Login Link (Hidden on small mobile screens) */}
                    <Link
                        to="/login"
                        className="
                            hidden
                            sm:block

                            text-sm
                            font-semibold
                            text-slate-700

                            transition-colors
                            duration-300

                            hover:text-slate-900

                            md:text-base
                            cursor-pointer
                        "
                    >
                        Login
                    </Link>

                    {/* Mobile Get Started Button (Goes to Login) */}
                    <Link
                        to="/login"
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
                            hover:-translate-y-0.5
                            hover:bg-slate-800
                            hover:shadow-md
                            sm:hidden
                            cursor-pointer
                        "
                    >
                        Get Started
                    </Link>

                    {/* Tablet & Desktop Get Started Button (Goes to Register) */}
                    <Link
                        to="/register"
                        className="
                            hidden
                            sm:rounded-full
                            sm:bg-slate-900
                            sm:px-5
                            sm:py-2.5
                            sm:text-sm
                            sm:font-semibold
                            sm:text-white
                            sm:shadow-sm
                            sm:transition-all
                            sm:duration-300
                            sm:hover:-translate-y-0.5
                            sm:hover:bg-slate-800
                            sm:hover:shadow-md
                            md:px-6
                            md:py-3
                            md:text-base
                            sm:inline-block
                            cursor-pointer
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