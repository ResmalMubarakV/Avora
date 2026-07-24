import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Logo from "../common/Logo";
import SearchBar from "../navigation/SearchBar";
import UserMenu from "../navigation/UserMenu";

const Navbar = ({
    sidebarOpen,
    setSidebarOpen,
    isMobile,
}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
              
                {/* Left */}
                <div className="flex flex-1 items-center gap-4">
                    {isMobile && (
                        <button
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                transition
                                hover:bg-slate-100
                            "
                        >
                            <Menu size={22} />
                        </button>
                    )}

                    <Logo
                        to="/dashboard"
                        size="sm"
                    />
                </div>

                {/* Desktop Search */}
                <div className="hidden flex-1 justify-center px-10 lg:flex">
                    <div className="w-full max-w-xl">
                        <SearchBar />
                    </div>
                </div>

                {/* Right */}
                <div className="ml-auto flex items-center gap-3">
                    <UserMenu />

                    {/* Desktop & Tablet Logout */}
                    <button
                        onClick={handleLogout}
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-200
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-red-600
                            transition-all
                            duration-300
                            hover:border-red-300
                            hover:bg-red-50
                            hover:text-red-700
                            md:flex
                        "
                    >
                        <LogOut size={18} />

                        Logout
                    </button>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="px-4 pb-4 lg:hidden sm:px-6">
                <SearchBar />
            </div>
        </header>
    );
};

export default Navbar;