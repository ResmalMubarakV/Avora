import { Trash2, X } from "lucide-react";

const DeleteMediaModal = ({
    open,
    loading,
    onClose,
    onDelete,
}) => {

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-sm
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    p-8
                    shadow-2xl
                "
            >

                <div
                    className="
                        mb-6
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-red-100
                    "
                >

                    <Trash2
                        size={30}
                        className="text-red-600"
                    />

                </div>

                <h2
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    Delete Media?
                </h2>

                <p
                    className="
                        mt-3
                        leading-7
                        text-slate-500
                    "
                >
                    This media will be permanently deleted from this
                    memory and cannot be recovered.
                </p>

                <div
                    className="
                        mt-8
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            px-5
                            py-3
                            font-medium
                            text-slate-700
                            transition
                            hover:bg-slate-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        Cancel

                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={loading}
                        className="
                            rounded-xl
                            bg-red-600
                            px-5
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-red-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {loading
                            ? "Deleting..."
                            : "Delete"}

                    </button>

                </div>

            </div>

        </div>

    );

};

export default DeleteMediaModal;