import { createPortal } from "react-dom";
import {
    AlertTriangle,
    Loader2,
} from "lucide-react";

const DeleteMemoryModal = ({
    open,
    loading,
    onClose,
    onDelete,
}) => {

    if (!open) return null;

    return createPortal(

        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-black/50
                px-4
                backdrop-blur-sm
            "
            onClick={onClose}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-2xl
                    animate-in
                    zoom-in-95
                    duration-200
                "
            >

                {/* Header */}

                <div className="border-b border-slate-200 p-6">

                    <div
                        className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-full
                            bg-red-100
                            text-red-600
                        "
                    >
                        <AlertTriangle size={30} />
                    </div>

                    <h2
                        className="
                            mt-5
                            text-center
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Delete Memory?
                    </h2>

                    <p
                        className="
                            mt-3
                            text-center
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        This action cannot be undone.
                        <br />
                        Your memory, cover image and all gallery
                        media will be permanently deleted.
                    </p>

                </div>

                {/* Footer */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-3
                        p-6
                        sm:flex-row
                    "
                >

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                        className="
                            flex-1
                            rounded-xl
                            border
                            border-slate-300
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-slate-700
                            transition-all
                            duration-200
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onDelete}
                        className="
                            flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:bg-red-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {loading ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                                Deleting...
                            </>

                        ) : (

                            <>
                                <AlertTriangle size={18} />
                                Delete Memory
                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>,

        document.body

    );

};

export default DeleteMemoryModal;