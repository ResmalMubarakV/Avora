import { AlertTriangle } from "lucide-react";

const NewChatModal = ({
    open,
    onClose,
    onConfirm,
}) => {

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-black/50
                backdrop-blur-sm
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    p-7
                    shadow-2xl
                "
            >

                <div className="flex justify-center">

                    <div
                        className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-100
                            text-[#3559D4]
                        "
                    >

                        <AlertTriangle size={30} />

                    </div>

                </div>

                <h2
                    className="
                        mt-5
                        text-center
                        text-2xl
                        font-bold
                    "
                >

                    Start New Chat?

                </h2>

                <p
                    className="
                        mt-3
                        text-center
                        text-slate-500
                    "
                >

                    Your current conversation will be cleared.

                </p>

                <div
                    className="
                        mt-8
                        flex
                        gap-3
                    "
                >

                    <button
                        onClick={onClose}
                        className="
                            flex-1
                            rounded-xl
                            border
                            py-3
                            font-medium
                        "
                    >

                        Cancel

                    </button>

                    <button
                        onClick={onConfirm}
                        className="
                            flex-1
                            rounded-xl
                            bg-[#3559D4]
                            py-3
                            font-medium
                            text-white
                        "
                    >

                        New Chat

                    </button>

                </div>

            </div>

        </div>

    );

};

export default NewChatModal;