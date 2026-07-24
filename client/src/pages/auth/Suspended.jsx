import { Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import avoraLogo from "../../assets/images/avoraLogo.png";

const Suspended = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">

            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    px-8
                    py-10
                    shadow-sm
                "
            >

                {/* Logo */}

                <div className="flex justify-center">

                    <img
                        src={avoraLogo}
                        alt="Avora"
                        className="h-20 w-auto select-none"
                        draggable={false}
                    />

                </div>

                {/* Heading */}

                <div className="mt-10 text-center">

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">

                        Account Temporarily Suspended

                    </h1>

                </div>

                {/* Description */}

                <div className="mt-6 space-y-5 text-center">

                    <p className="text-slate-600 leading-7">

                        Your Avora account has been temporarily suspended.

                    </p>

                    <p className="text-slate-600 leading-7">

                        If you believe this action was taken by mistake,
                        please contact the Avora support team.
                        We'll review your account and assist you as soon as
                        possible.

                    </p>

                </div>

                {/* Contact Support */}

                <a
                    href="mailto:support@avora.app"
                    className="
                        mt-10
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-[#1E3A8A]
                        px-6
                        py-3.5
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:bg-[#16213E]
                        hover:scale-[1.01]
                        active:scale-[0.98]
                    "
                >

                    <Mail size={18} />

                    Contact Avora Support

                </a>

                {/* Logout */}

                <div className="mt-8 flex justify-center">

                    <button
                        onClick={handleLogout}
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-slate-500
                            transition-colors
                            duration-200
                            hover:text-slate-900
                        "
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </div>

            </div>

        </div>
    );
};

export default Suspended;