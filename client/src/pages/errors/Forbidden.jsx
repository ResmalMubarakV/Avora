import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import avoraLogo from "../../assets/images/avoraLogo.png";

const Forbidden = () => {

    const navigate = useNavigate();

    const handleGoBack = () => {

        if (window.history.length > 1) {

            navigate(-1);

        } else {

            navigate("/");

        }

    };

    return (

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-10">

            {/* Background Blurs */}

            <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-100 opacity-30 blur-3xl" />

            <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-100 opacity-30 blur-3xl" />

            {/* Card */}

            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">

                {/* Icon */}

                <div className="flex justify-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

                        <ShieldAlert
                            size={30}
                            className="text-[#1E3A8A]"
                        />

                    </div>

                </div>

                {/* Logo */}

                <div className="mt-8 flex justify-center">

                    <img
                        src={avoraLogo}
                        alt="Avora"
                        className="h-20 w-auto"
                        draggable={false}
                    />

                </div>

                {/* Heading */}

                <h1 className="mt-8 text-center text-3xl font-bold tracking-tight text-slate-900">

                    Access Restricted

                </h1>

                {/* Description */}

                <div className="mt-6 space-y-5 text-center">

                    <p className="leading-7 text-slate-600">

                        You don't have permission to
                        access this page.

                    </p>

                    <p className="leading-7 text-slate-600">

                        If you believe this is a mistake,
                        please contact the administrator.

                    </p>

                </div>

                {/* Button */}

                <button
                    onClick={handleGoBack}
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
                        hover:scale-[1.01]
                        hover:bg-[#16213E]
                        active:scale-[0.98]
                    "
                >

                    <ArrowLeft size={18} />

                    Go Back

                </button>

            </div>

        </div>

    );

};

export default Forbidden;