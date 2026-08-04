import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import LandingFooter from "../components/landing/LandingFooter";

const DashboardLayout = () => {

    const location = useLocation();

    const isAIPage =
        location.pathname === "/dashboard/ai";

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [isMobile, setIsMobile] = useState(
        window.innerWidth < 768
    );

    useEffect(() => {

        const handleResize = () => {

            const mobile =
                window.innerWidth < 768;

            setIsMobile(mobile);

            if (mobile) {

                setSidebarOpen(false);

            }

        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () =>

            window.removeEventListener(
                "resize",
                handleResize
            );

    }, []);

    return (

        <div className="min-h-screen bg-slate-50">

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isMobile={isMobile}
            />

            <div
                className={`
                    transition-all
                    duration-300

                    ${
                        !isMobile
                            ? sidebarOpen
                                ? "ml-72"
                                : "ml-20"
                            : "ml-0"
                    }
                `}
            >

                {/* Hide Navbar on AI Page */}

                {!isAIPage && (

                    <Navbar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        isMobile={isMobile}
                    />

                )}

                <main
                    className={
                        isAIPage
                            ? "h-screen overflow-hidden"
                            : `
                                max-w-[1600px]
                                mx-auto
                                px-4
                                sm:px-6
                                lg:px-8
                                py-6
                            `
                    }
                >

                    <Outlet />

                </main>

                {/* Hide Footer on AI Page */}

                {!isAIPage && (

                    <LandingFooter />

                )}

            </div>

        </div>

    );

};

export default DashboardLayout;