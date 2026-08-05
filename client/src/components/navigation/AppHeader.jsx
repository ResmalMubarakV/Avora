import { Link } from "react-router-dom";

import Logo from "../common/Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

// ==========================================
// APP HEADER COMPONENT
// ==========================================
/**
 * Renders the primary application header navbar. Dynamically switches between 
 * an authenticated owner layout (featuring Home link, search bar, and user menu dropdown) 
 * and a public visitor layout (featuring Login & Get Started CTAs).
 */
const AppHeader = ({
    isOwner = false,
    isLoggedIn = false,
}) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
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
                    md:py-5
                "
            >
                {/* Brand Logo Section */}
                <div className="flex-shrink-0">
                    {/* Mobile Logo View */}
                    <div className="sm:hidden">
                        <Logo
                            to={isLoggedIn ? "/dashboard" : "/"}
                            size="sm"
                        />
                    </div>

                    {/* Desktop Logo View */}
                    <div className="hidden sm:block">
                        <Logo
                            to={isLoggedIn ? "/dashboard" : "/"}
                            size="lg"
                        />
                    </div>
                </div>

                {isOwner ? (
                    <>
                        {/* Navigation Links */}
                        <nav className="ml-10 hidden items-center gap-8 md:flex">
                            <Link
                                to="/dashboard"
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition-colors
                                    duration-300
                                    hover:text-slate-900
                                "
                            >
                                Home
                            </Link>
                        </nav>

                        {/* Search Bar Bar */}
                        <div className="mx-auto w-full max-w-xl px-6">
                            <SearchBar />
                        </div>

                        {/* User Menu Dropdown */}
                        <UserMenu />
                    </>
                ) : (
                    /* Public Visitor Action Links */
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                        {/* Login Link */}
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
                            "
                        >
                            Login
                        </Link>

                        {/* Get Started Registration Button */}
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

                                hover:-translate-y-0.5
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
                )}
            </div>
        </header>
    );
};

export default AppHeader;