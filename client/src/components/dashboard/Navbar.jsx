import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import LogoutModal from "../navigation/LogoutModal";
import Logo from "../common/Logo";
import SearchBar from "../navigation/SearchBar";
import UserMenu from "../navigation/UserMenu";

const Navbar = ({
    sidebarOpen,
    setSidebarOpen,
    isMobile,
}) => {

    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    const handleLogout = () => {

        setShowLogoutModal(false);

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/login", {
            replace: true,
        });

    };

    return (

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

            <div
                className="
                    mx-auto
                    flex
                    h-20
                    max-w-7xl
                    items-center
                    px-6
                "
            >

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

                {/* Center Search */}

                <div className="hidden lg:flex w-full max-w-xl justify-center">

                    <SearchBar />

                </div>

                {/* Right */}

                <div className="flex flex-1 items-center justify-end gap-3">

                    <UserMenu />

                    <button
                        onClick={() =>
                            setShowLogoutModal(true)
                        }
                        className="
                            hidden
                            md:flex
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
                        "
                    >
                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </div>

            {/* Mobile Search */}

            <div className="px-4 pb-4 sm:px-6 lg:hidden">

                <SearchBar />

            </div>

            <LogoutModal
                open={showLogoutModal}
                onClose={() =>
                    setShowLogoutModal(false)
                }
                onConfirm={handleLogout}
            />

        </header>

    );

};

export default Navbar;