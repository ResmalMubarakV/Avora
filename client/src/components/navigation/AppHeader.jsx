import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import Logo from "../common/Logo";

const AppHeader = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">

            <div className="mx-auto flex h-16 max-w-7xl items-center px-5">

                {/* Logo */}

                <Logo
                    to="/dashboard"
                    size="sm"
                />

                {/* Navigation */}

                <nav className="ml-10 hidden items-center gap-8 md:flex">

                    <Link
                        to="/dashboard"
                        className="text-sm font-medium text-slate-700 hover:text-black"
                    >
                        Home
                    </Link>

                </nav>

                {/* Search */}

                <SearchBar />

                {/* User */}

                <UserMenu />

            </div>

        </header>
    );
};

export default AppHeader;