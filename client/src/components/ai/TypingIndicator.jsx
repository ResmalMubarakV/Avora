import {
    Bot,
    Sparkles,
} from "lucide-react";

const TypingIndicator = () => {

    return (

        <div
            className="
                flex
                items-start
                gap-4
            "
        >

            {/* AI Avatar */}

            <div
                className="
                    relative

                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center

                    rounded-2xl

                    bg-gradient-to-br
                    from-[#3559D4]
                    to-[#1E3A8A]

                    text-white

                    shadow-lg
                "
            >

                <Bot size={22} />

                <span
                    className="
                        absolute
                        -top-1
                        -right-1

                        flex
                        h-5
                        w-5
                        items-center
                        justify-center

                        rounded-full

                        bg-white

                        text-[#3559D4]

                        shadow
                    "
                >

                    <Sparkles size={10} />

                </span>

            </div>

            {/* Typing */}

            <div className="flex-1">

                <p
                    className="
                        mb-3
                        text-sm
                        font-semibold
                        text-slate-900
                    "
                >
                    Avora AI
                </p>

                <div
                    className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-slate-200

                        bg-white

                        px-5
                        py-3

                        shadow-sm
                    "
                >

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#3559D4]
                            animate-bounce
                        "
                    />

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#3559D4]
                            animate-bounce
                            [animation-delay:150ms]
                        "
                    />

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#3559D4]
                            animate-bounce
                            [animation-delay:300ms]
                        "
                    />

                </div>

                <p
                    className="
                        mt-3
                        text-sm
                        text-slate-500
                    "
                >
                    Thinking about your next adventure...
                </p>

            </div>

        </div>

    );

};

export default TypingIndicator;