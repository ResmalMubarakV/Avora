import {
    Sparkles,
    Bot,
    Plus,
    ArrowLeft,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewChatModal from "./NewChatModal";

const AIHeader = ({
    title,
    onNewChat,
}) => {

    const navigate = useNavigate();
    const [showModal, setShowModal] =
    useState(false);

    return (

        <header
            className="
                sticky
                top-0
                z-30

                border-b
                border-slate-200/70

                bg-white/80
                backdrop-blur-xl
            "
        >

            {/* Desktop */}

            <div
                className="
                    mx-auto
                    hidden
                    max-w-6xl
                    items-center
                    justify-between

                    px-6
                    py-4

                    md:flex
                "
            >

                <div className="flex items-center gap-4">

                    <div
                        className="
                            relative

                            flex
                            h-14
                            w-14
                            items-center
                            justify-center

                            rounded-3xl

                            bg-gradient-to-br
                            from-[#3559D4]
                            via-[#4166E0]
                            to-[#1E3A8A]

                            text-white

                            shadow-lg
                            shadow-blue-300/40
                        "
                    >

                        <Bot size={26} />

                        <span
                            className="
                                absolute
                                -top-1
                                -right-1

                                flex
                                h-6
                                w-6
                                items-center
                                justify-center

                                rounded-full

                                bg-white

                                text-[#3559D4]

                                shadow
                            "
                        >

                            <Sparkles size={12} />

                        </span>

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">

                            {title || "New Chat"}

                        </h1>

                        <p className="mt-1 text-sm text-slate-500">

                            Personalized travel planning powered by your memories

                        </p>

                    </div>

                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        border
                        border-slate-200

                        bg-white

                        px-4
                        py-2.5

                        text-sm
                        font-medium

                        transition-all

                        hover:border-[#3559D4]
                        hover:text-[#3559D4]
                    "
                >

                    <Plus size={18} />

                    New Chat

                </button>

            </div>

            {/* Mobile */}

            <div
                className="
                    flex
                    items-center
                    justify-between

                    px-4
                    py-3

                    md:hidden
                "
            >

                <button
                    onClick={() => navigate("/dashboard")}
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-slate-200

                        bg-white

                        transition

                        hover:bg-slate-100
                    "
                >

                    <ArrowLeft size={20} />

                </button>

                <h1
                    className="
                        text-lg
                        font-semibold
                        text-slate-900
                    "
                >

                    Avora AI

                </h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-xl

                        bg-[#3559D4]

                        text-white

                        transition

                        hover:bg-[#2748BC]
                    "
                >

                    <Plus size={18} />

                </button>

            </div>

            <NewChatModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => {

                    onNewChat();

                    setShowModal(false);

                }}
            />

        </header>

    );

};

export default AIHeader;